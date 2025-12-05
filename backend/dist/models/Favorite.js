// src/models/Favorite.ts
import { Schema, model, Types } from "mongoose";
const favoriteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });
export const Favorite = model("Favorite", favoriteSchema);
//# sourceMappingURL=Favorite.js.map