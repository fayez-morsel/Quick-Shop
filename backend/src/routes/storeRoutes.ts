import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getMyStore, approveStore } from "../controllers/storeController.js";

const router = Router();

router.get("/me", auth, getMyStore);
router.patch("/:id/approve", auth, approveStore);

export default router;
