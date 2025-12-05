// src/models/Store.ts
import { Schema, model, Types } from "mongoose";
const storeSchema = new Schema({
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
}, { timestamps: true });
export const Store = model("Store", storeSchema);
//# sourceMappingURL=Store.js.map