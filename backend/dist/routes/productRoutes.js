import { Router } from "express";
import { getAllProducts, getProductById, createProduct } from "../controllers/productController.js";
import { auth } from "../middleware/auth.js";
const router = Router();
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", auth, createProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map