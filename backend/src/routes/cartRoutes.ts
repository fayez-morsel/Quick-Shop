import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cartController.js";

const router = Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.patch("/update", auth, updateCartItem);
router.delete("/remove/:productId", auth, removeCartItem);

export default router;
