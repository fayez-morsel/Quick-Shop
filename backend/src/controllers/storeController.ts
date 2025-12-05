import type { Response } from "express";
import { Types } from "mongoose";
import type { AuthReq } from "../middleware/auth.js";
import { Store } from "../models/Store.js";

export const getMyStore = async (req: AuthReq, res: Response) => {
  const store = await Store.findOne({ owner: req.user!.userId });
  res.json(store);
};

export const approveStore = async (req: AuthReq, res: Response) => {
  const store = await Store.findByIdAndUpdate(
    new Types.ObjectId(req.params.id),
    { approved: true, status: "approved" },
    { new: true }
  );
  res.json(store);
};
