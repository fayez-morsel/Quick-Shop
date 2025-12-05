import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getReviews, addReview } from "../controllers/reviewController.js";

const router = Router();

router.get("/:productId", getReviews);
router.post("/", auth, addReview);

export default router;
