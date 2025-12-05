import { Types } from "mongoose";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });
    const [, token] = authHeader.split(" ");
    if (!token)
        return res.status(401).json({ error: "No token provided" });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: new Types.ObjectId(decoded.userId), role: decoded.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};
//# sourceMappingURL=auth.js.map