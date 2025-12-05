// src/models/Store.ts
import { Schema, model, type Document, Types } from "mongoose";

export type StoreStatus = "pending" | "approved" | "rejected";

export interface IStore extends Document {
  name: string;
  owner: Types.ObjectId;
  email: string;
  category: string;
  description?: string;
  approved: boolean;
  status: StoreStatus;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, required: true, lowercase: true },
    category: { type: String, required: true },
    description: { type: String },
    approved: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Store = model<IStore>("Store", storeSchema);
