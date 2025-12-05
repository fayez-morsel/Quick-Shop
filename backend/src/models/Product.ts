// src/models/Product.ts
import { Schema, model, type Document, Types } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  compareAtPrice?: number;
  store: Types.ObjectId;
  brand?: string;
  category: string;
  image: string;
  inStock: boolean;
  stock: number;
  rating: {
    value: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },

    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    brand: { type: String, trim: true },
    category: { type: String, required: true },

    image: { type: String, required: true },

    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0, min: 0 },

    rating: {
      value: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);

productSchema.index({ store: 1 });
productSchema.index({ category: 1 });
productSchema.index({ title: "text" });

export const Product = model<IProduct>("Product", productSchema);
