import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { User } from "../models/User.js";
import { Store } from "../models/Store.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    if (role === "seller") {
      await Store.create({
        name: `${name}'s Store`,
        email,
        owner: user._id,
        category: "General",
        approved: false,
        status: "pending"
      });
    }

    return res.json({ message: "Account created", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("store");
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const storeId =
      user.store instanceof Types.ObjectId
        ? user.store
        : (user.store as { _id: Types.ObjectId } | undefined)?._id ?? null;

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        storeId
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
