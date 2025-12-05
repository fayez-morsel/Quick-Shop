// src/models/Review.ts
import { Schema, model, Types } from "mongoose";
const reviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });
export const Review = model("Review", reviewSchema);
//# sourceMappingURL=Review.js.map