import { Types } from "mongoose";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Store } from "../models/Store.js";
import { User } from "../models/User.js";
export const placeOrder = async (req, res) => {
    const { items } = req.body;
    const orderItems = [];
    let total = 0;
    let storeId = null;
    for (const item of items) {
        const product = await Product.findById(new Types.ObjectId(item.productId));
        if (!product)
            continue;
        if (!storeId)
            storeId = product.store;
        total += product.price * item.quantity;
        orderItems.push({
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: item.quantity,
            image: product.image
        });
    }
    if (!storeId || orderItems.length === 0) {
        return res.status(400).json({ error: "No valid items to place an order" });
    }
    const order = await Order.create({
        buyer: req.user.userId,
        store: storeId,
        items: orderItems,
        total
    });
    res.json(order);
};
export const getOrdersForBuyer = async (req, res) => {
    const orders = await Order.find({ buyer: req.user.userId })
        .populate("buyer", "name email")
        .populate("items.product", "title price image category store");
    const normalized = orders.map((order) => {
        const plain = order.toObject();
        const buyer = plain.buyer && typeof plain.buyer === "object"
            ? plain.buyer
            : null;
        return {
            ...plain,
            buyerName: buyer?.name ?? "",
            buyerEmail: buyer?.email ?? "",
            storeId: plain.store?.toString?.() ?? plain.store,
            items: plain.items?.map((item) => ({
                ...item,
                productId: item.product?._id?.toString?.() ??
                    (typeof item.product === "string" ? item.product : undefined),
            })),
        };
    });
    res.json(normalized);
};
export const getOrdersForSeller = async (req, res) => {
    const store = await Store.findOne({ owner: req.user.userId });
    if (!store)
        return res.json([]);
    const buyerIds = await Order.distinct("buyer", { store: store._id });
    const buyers = await User.find({ _id: { $in: buyerIds } }).select("name email");
    const buyerLookup = new Map(buyers.map((b) => [b._id.toString(), { name: b.name, email: b.email }]));
    const orders = await Order.find({ store: store._id }).populate("items.product", "title price image category store");
    const normalized = orders.map((order) => {
        const plain = order.toObject();
        const buyerId = typeof plain.buyer === "string"
            ? plain.buyer
            : plain.buyer?.toString?.() ?? "";
        const buyer = buyerLookup.get(buyerId);
        return {
            ...plain,
            buyerName: buyer?.name ?? "",
            buyerEmail: buyer?.email ?? "",
            storeId: store._id.toString(),
            items: plain.items?.map((item) => ({
                ...item,
                productId: item.product?._id?.toString?.() ??
                    (typeof item.product === "string" ? item.product : undefined),
            })),
        };
    });
    res.json(normalized);
};
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(new Types.ObjectId(req.params.id));
    if (!order)
        return res.status(404).json({ error: "Order not found" });
    order.status = status;
    order.updateHistory = [
        ...(order.updateHistory ?? []),
        { status, changedAt: new Date() },
    ];
    await order.save();
    res.json(order);
};
//# sourceMappingURL=orderController.js.map