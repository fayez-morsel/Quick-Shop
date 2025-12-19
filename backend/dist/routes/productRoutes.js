import { Router } from "express";
import { getAllProducts, getProductById, createProduct, deleteProduct, } from "../controllers/productController.js";
import { auth } from "../middleware/auth.js";
const router = Router();
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", auth, createProduct);
router.delete("/:id", auth, deleteProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map