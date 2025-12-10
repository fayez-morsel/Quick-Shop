// src/models/Order.ts
import { Schema, model, type Document, Types } from "mongoose";

export type OrderStatus = "unconfirmed" | "pending" | "canceled" | "delivered";

export interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  buyer: Types.ObjectId;
  store: Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  total: number;
  placedAt: Date;
  checkoutCode: string | null;
  checkoutCodeExpires: Date | null;
  updatedAt: Date;
  updateHistory?: Array<{
    status: OrderStatus;
    changedAt: Date;
  }>;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: { type: [orderItemSchema], required: true },
    status: {
      type: String,
      enum: ["unconfirmed", "pending", "canceled", "delivered"],
      default: "unconfirmed",
    },
    total: { type: Number, required: true, min: 0 },
    placedAt: { type: Date, default: Date.now },
    checkoutCode: { type: String, default: null },
    checkoutCodeExpires: { type: Date, default: null },
    updateHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const Order = model<IOrder>("Order", orderSchema);
