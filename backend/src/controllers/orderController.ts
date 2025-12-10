import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthReq } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Store } from "../models/Store.js";
import { User } from "../models/User.js";
import { generateCode } from "../utils/generateCode.js";
import { sendEmail } from "../utils/sendEmail.js";

export const placeOrder = async (req: AuthReq, res: Response) => {
  try {
    const { items } = req.body as {
      items: Array<{ productId: string; quantity: number }>;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Items array is required and cannot be empty" });
    }

    const buyer = await User.findById(req.user!.userId);
    if (!buyer?.email) {
      return res.status(400).json({ error: "Buyer email not found" });
    }

    const orderItems: Array<{
      product: Types.ObjectId;
      title: string;
      price: number;
      quantity: number;
      image: string;
    }> = [];
    let total = 0;
    let storeId: Types.ObjectId | null = null;

    for (const item of items) {
      const product = await Product.findById(
        new Types.ObjectId(item.productId)
      );
      if (!product) continue;

      if (!storeId) storeId = product.store as Types.ObjectId;

      total += product.price * item.quantity;

      orderItems.push({
        product: product._id as Types.ObjectId,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
    }

    if (!storeId || orderItems.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid items to place an order" });
    }

    const checkoutCode = generateCode();
    const checkoutCodeExpires = new Date(Date.now() + 5 * 60 * 1000);

    const order = await Order.create({
      buyer: req.user!.userId,
      store: storeId,
      items: orderItems,
      total,
      status: "unconfirmed",
      checkoutCode,
      checkoutCodeExpires,
      updateHistory: [{ status: "unconfirmed", changedAt: new Date() }],
    });

    let emailSent = false;
    const exposeCode = process.env.NODE_ENV !== "production";
    try {
      await sendEmail(
        buyer.email,
        "Your Order Confirmation Code",
        `Your confirmation code is ${checkoutCode}. It expires in 5 minutes.`
      );
      emailSent = true;
    } catch (err) {
      console.error("Failed to send checkout code", err);
    }

    res.json({
      message: emailSent
        ? "Order placed. Checkout code sent to your email."
        : "Order placed but failed to send checkout code. Use the provided code to confirm.",
      orderId: order._id,
      order,
      checkoutCode: emailSent && !exposeCode ? undefined : checkoutCode,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ error: "Failed to place order. Please try again." });
  }
};

export const getOrdersForBuyer = async (req: AuthReq, res: Response) => {
  const orders = await Order.find({ buyer: req.user!.userId })
    .populate("buyer", "name email")
    .populate("items.product", "title price image category store");

  const normalized = orders.map((order) => {
    const plain = order.toObject();
    const buyer =
      plain.buyer && typeof plain.buyer === "object"
        ? (plain.buyer as { name?: string; email?: string })
        : null;

    return {
      ...plain,
      buyerName: buyer?.name ?? "",
      buyerEmail: buyer?.email ?? "",
      storeId: (plain.store as Types.ObjectId)?.toString?.() ?? plain.store,
      items: plain.items?.map((item: any) => ({
        ...item,
        productId:
          item.product?._id?.toString?.() ??
          (typeof item.product === "string" ? item.product : undefined),
      })),
    };
  });

  res.json(normalized);
};

export const getOrdersForSeller = async (req: AuthReq, res: Response) => {
  const store = await Store.findOne({ owner: req.user!.userId });
  if (!store) return res.json([]);

  const buyerIds = await Order.distinct("buyer", { store: store._id });
  const buyers = await User.find({ _id: { $in: buyerIds } }).select(
    "name email"
  );
  const buyerLookup = new Map(
    buyers.map((b) => [b._id.toString(), { name: b.name, email: b.email }])
  );

  const orders = await Order.find({ store: store._id }).populate(
    "items.product",
    "title price image category store"
  );

  const normalized = orders.map((order) => {
    const plain = order.toObject();
    const buyerId =
      typeof plain.buyer === "string"
        ? plain.buyer
        : (plain.buyer as Types.ObjectId | undefined)?.toString?.() ?? "";
    const buyer = buyerLookup.get(buyerId);

    return {
      ...plain,
      buyerName: buyer?.name ?? "",
      buyerEmail: buyer?.email ?? "",
      storeId: store._id.toString(),
      items: plain.items?.map((item: any) => ({
        ...item,
        productId:
          item.product?._id?.toString?.() ??
          (typeof item.product === "string" ? item.product : undefined),
      })),
    };
  });

  res.json(normalized);
};

export const updateOrderStatus = async (req: AuthReq, res: Response) => {
  const { status } = req.body;

  const order = await Order.findById(new Types.ObjectId(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });

  // Prevent advancing an order that has not been confirmed yet
  if (
    order.status === "unconfirmed" &&
    order.checkoutCode &&
    order.checkoutCodeExpires
  ) {
    return res
      .status(400)
      .json({ error: "Order must be confirmed with code before updating status" });
  }

  order.status = status;
  order.updateHistory = [
    ...(order.updateHistory ?? []),
    { status, changedAt: new Date() },
  ];
  await order.save();

  res.json(order);
};

export const confirmOrder = async (req: AuthReq, res: Response) => {
  const { orderId, code } = req.body as { orderId?: string; code?: string };
  if (!orderId || !code) {
    return res.status(400).json({ error: "orderId and code are required" });
  }

  const order = await Order.findById(new Types.ObjectId(orderId));
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.buyer.toString() !== req.user!.userId.toString()) {
    return res.status(403).json({ error: "Not authorized for this order" });
  }

  if (!order.checkoutCode || !order.checkoutCodeExpires) {
    return res.status(400).json({ error: "No checkout code found" });
  }

  const expired = order.checkoutCodeExpires.getTime() < Date.now();
  const matches = order.checkoutCode === String(code).trim();

  if (expired) return res.status(400).json({ error: "Code expired" });
  if (!matches) return res.status(400).json({ error: "Invalid code" });

  order.status = "pending";
  order.checkoutCode = null;
  order.checkoutCodeExpires = null;
  order.updateHistory = [
    ...(order.updateHistory ?? []),
    { status: "pending", changedAt: new Date() },
  ];
  await order.save();

  return res.json({ message: "Order confirmed and pending." });
};
