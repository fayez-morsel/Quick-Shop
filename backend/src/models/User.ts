// src/models/User.ts
import { Schema, model, type Document, Types } from "mongoose";

export type UserRole = "buyer" | "seller";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  store?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
    },

    store: { type: Schema.Types.ObjectId, ref: "Store" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
