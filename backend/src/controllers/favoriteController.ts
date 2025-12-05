import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthReq } from "../middleware/auth.js";
import { Favorite } from "../models/Favorite.js";

export const getFavorites = async (req: AuthReq, res: Response) => {
  const userId = req.user!.userId;
  const favorites = await Favorite.find({ user: userId }).populate("product");
  res.json(favorites);
};

export const toggleFavorite = async (req: AuthReq, res: Response) => {
  const { productId } = req.params;
  const userId = req.user!.userId;
  const productObjectId = new Types.ObjectId(productId);

  const exists = await Favorite.findOne({
    user: userId,
    product: productObjectId,
  });

  if (exists) {
    await Favorite.deleteOne({ _id: exists._id });
  } else {
    await Favorite.create({
      user: userId,
      product: productObjectId,
    });
  }

  const updated = await Favorite.find({ user: userId }).populate("product");
  res.json(updated);
};
