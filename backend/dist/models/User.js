// src/models/User.ts
import { Schema, model, Types } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer",
    },
    store: { type: Schema.Types.ObjectId, ref: "Store" },
}, { timestamps: true });
export const User = model("User", userSchema);
//# sourceMappingURL=User.js.map