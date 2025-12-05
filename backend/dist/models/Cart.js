// src/models/Cart.ts
import { Schema, model, Types } from "mongoose";
const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
}, { _id: false });
const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    items: [cartItemSchema],
}, { timestamps: { createdAt: false, updatedAt: true } });
export const Cart = model("Cart", cartSchema);
//# sourceMappingURL=Cart.js.map