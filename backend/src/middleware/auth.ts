import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

export interface AuthReq extends Request {
  user?: { userId: Types.ObjectId; role: "buyer" | "seller" };
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export const auth = (req: AuthReq, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const [, token] = authHeader.split(" ");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: "buyer" | "seller";
    };

    req.user = { userId: new Types.ObjectId(decoded.userId), role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
