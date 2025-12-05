import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthReq } from "../middleware/auth.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

export const getCart = async (req: AuthReq, res: Response) => {
  const userId = req.user!.userId;

  let cart = await Cart.findOne({ user: userId })
    .populate("items.product", "title price image images inStock stock")
    .lean();
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  res.json(cart);
};

export const addToCart = async (req: AuthReq, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user!.userId;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    const productObjectId = new Types.ObjectId(productId);
    const qty = Math.max(1, Number.isFinite(Number(quantity)) ? Number(quantity) : 1);

    const exists = await Product.exists({ _id: productObjectId });
    if (!exists) return res.status(404).json({ error: "Product not found" });

    // Increment if exists, otherwise push new
    let cart = await Cart.findOneAndUpdate(
      { user: userId, "items.product": productObjectId },
      { $inc: { "items.$.quantity": qty } },
      { new: true }
    );

    if (!cart) {
      cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $push: { items: { product: productObjectId, quantity: qty } } },
        { new: true, upsert: true }
      );
    }

    const updated = await Cart.findOne({ user: userId })
      .populate("items.product", "title price image images inStock stock")
      .lean();
    res.json(updated);
  } catch (err) {
    console.error("addToCart error", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCartItem = async (req: AuthReq, res: Response) => {
  const { productId, quantity } = req.body;
  const userId = req.user!.userId;
  if (!productId || !Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: "Invalid productId" });
  }
  const productObjectId = new Types.ObjectId(productId);
  const qty = Math.max(1, Number.isFinite(Number(quantity)) ? Number(quantity) : 1);

  await Cart.updateOne(
    { user: userId, "items.product": productObjectId },
    { $set: { "items.$.quantity": qty } }
  );

  const updated = await Cart.findOne({ user: userId })
    .populate("items.product", "title price image images inStock stock")
    .lean();
  res.json(updated);
};

export const removeCartItem = async (req: AuthReq, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user!.userId;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    const productObjectId = new Types.ObjectId(productId);

    await Cart.updateOne(
      { user: userId },
      { $pull: { items: { product: productObjectId } } }
    );

    const updated = await Cart.findOne({ user: userId })
      .populate("items.product", "title price image images inStock stock")
      .lean();
    res.json(updated);
  } catch (err) {
    console.error("removeCartItem error", err);
    res.status(500).json({ error: "Server error" });
  }
};
