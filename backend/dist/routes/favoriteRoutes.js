import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getFavorites, toggleFavorite } from "../controllers/favoriteController.js";
const router = Router();
router.get("/", auth, getFavorites);
router.post("/:productId", auth, toggleFavorite);
export default router;
//# sourceMappingURL=favoriteRoutes.js.map