// src/models/Review.ts
import { Schema, model, type Document, Types } from "mongoose";

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  order: Types.ObjectId;
  rating: number; 
  comment?: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });

export const Review = model<IReview>("Review", reviewSchema);
