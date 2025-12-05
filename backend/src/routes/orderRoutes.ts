import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { placeOrder, getOrdersForBuyer, getOrdersForSeller, updateOrderStatus } from "../controllers/orderController.js";

const router = Router();

router.post("/", auth, placeOrder);
router.get("/buyer", auth, getOrdersForBuyer);
router.get("/seller", auth, getOrdersForSeller);
router.patch("/:id/status", auth, updateOrderStatus);

export default router;
