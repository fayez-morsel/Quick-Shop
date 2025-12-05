// src/models/Order.ts
import { Schema, model, Types } from "mongoose";
const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
}, { _id: false });
const orderSchema = new Schema({
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: { type: [orderItemSchema], required: true },
    status: {
        type: String,
        enum: [
            "Pending",
            "Processing",
            "Dispatched",
            "Shipped",
            "Delivered",
            "Delivery Unsuccessful",
            "Canceled",
        ],
        default: "Pending",
    },
    total: { type: Number, required: true, min: 0 },
    placedAt: { type: Date, default: Date.now },
    updateHistory: [
        {
            status: { type: String },
            changedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: { createdAt: false, updatedAt: true } });
export const Order = model("Order", orderSchema);
//# sourceMappingURL=Order.js.map