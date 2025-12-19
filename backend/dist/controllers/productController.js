import { Types } from "mongoose";
import { Product } from "../models/Product.js";
import { Store } from "../models/Store.js";
import { User } from "../models/User.js";
const BRANDS = [
    "Tech Hub",
    "KeyZone",
    "SoundWave",
    "DataHub",
    "ErgoWorks",
    "HomeLight",
    "Store"
];
const pickBrand = (seed, fallback) => {
    if (!seed)
        return fallback;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return BRANDS[hash % BRANDS.length];
};
export const getAllProducts = async (req, res) => {
    const { limit, page, storeId, category, q } = req.query;
    const filter = {};
    if (storeId && Types.ObjectId.isValid(storeId)) {
        filter.store = new Types.ObjectId(storeId);
    }
    if (category) {
        filter.category = category;
    }
    if (q) {
        filter.title = { $regex: q, $options: "i" };
    }
    const parsedLimit = limit ? Math.min(200, Math.max(1, parseInt(limit, 10))) : undefined;
    const parsedPage = page && parsedLimit ? Math.max(1, parseInt(page, 10)) : undefined;
    let query = Product.find(filter).sort({ createdAt: -1 });
    if (parsedLimit) {
        query = query.limit(parsedLimit);
    }
    if (parsedLimit && parsedPage) {
        query = query.skip(parsedLimit * (parsedPage - 1));
    }
    const products = await query.lean();
    res.json(products);
};
export const getProductById = async (req, res) => {
    const product = await Product.findById(new Types.ObjectId(req.params.id));
    if (!product)
        return res.status(404).json({ error: "Product not found" });
    res.json(product);
};
export const createProduct = async (req, res) => {
    try {
        const { storeId, title, price, compareAtPrice, category, stock, image, brand } = req.body;
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ error: "Only sellers can create products" });
        }
        if (!title || typeof title !== "string") {
            return res.status(400).json({ error: "Title is required" });
        }
        if (price === undefined || Number.isNaN(Number(price))) {
            return res.status(400).json({ error: "Price is required" });
        }
        const safeCategory = typeof category === "string" && category.trim().length > 0
            ? category
            : "General";
        const safeImage = typeof image === "string" && image.trim().length > 0
            ? image
            : "https://via.placeholder.com/400";
        // Resolve store id: must belong to the authenticated seller
        let resolvedStoreId = storeId;
        let store = null;
        if (resolvedStoreId) {
            if (!Types.ObjectId.isValid(resolvedStoreId)) {
                return res.status(400).json({ error: "Invalid or missing storeId" });
            }
            store = await Store.findById(new Types.ObjectId(resolvedStoreId));
            if (!store) {
                return res.status(400).json({ error: "Store not found" });
            }
            if (store.owner.toString() !== req.user.userId.toString()) {
                return res
                    .status(403)
                    .json({ error: "You can only create products for your own store" });
            }
        }
        else {
            store = await Store.findOne({ owner: req.user.userId });
            if (!store) {
                // Auto-create store for seller without store
                const user = await User.findById(req.user.userId);
                store = await Store.create({
                    name: user?.name ? `${user.name}'s Store` : "My Store",
                    owner: req.user.userId,
                    email: user?.email ?? "",
                    category: category || "General",
                    approved: false,
                    status: "pending",
                });
            }
            resolvedStoreId = store?._id?.toString();
        }
        if (!resolvedStoreId || !Types.ObjectId.isValid(resolvedStoreId) || !store) {
            return res.status(400).json({ error: "Invalid or missing storeId" });
        }
        const numericStock = typeof stock === "number" ? stock : Number(stock ?? 0);
        const product = await Product.create({
            store: store._id,
            title,
            price,
            compareAtPrice,
            category: safeCategory,
            brand: typeof brand === "string" && brand.trim().length > 0
                ? brand.trim()
                : pickBrand(title ?? store.name, store.name) ?? store.name,
            stock: numericStock,
            image: safeImage,
            inStock: numericStock > 0,
        });
        res.status(201).json(product);
    }
    catch (err) {
        console.error("createProduct error", err);
        res.status(500).json({ error: "Server error" });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product id" });
        }
        if (!req.user || req.user.role !== "seller") {
            return res.status(403).json({ error: "Only sellers can delete products" });
        }
        const productObjectId = new Types.ObjectId(id);
        const product = await Product.findById(productObjectId);
        if (!product)
            return res.status(404).json({ error: "Product not found" });
        const store = await Store.findById(product.store);
        if (!store) {
            return res.status(400).json({ error: "Store not found for this product" });
        }
        if (store.owner.toString() !== req.user.userId.toString()) {
            return res
                .status(403)
                .json({ error: "You are not allowed to delete this product" });
        }
        await Product.deleteOne({ _id: productObjectId });
        res.json({ success: true, message: "Product deleted" });
    }
    catch (err) {
        console.error("deleteProduct error", err);
        res.status(500).json({ error: "Server error" });
    }
};
//# sourceMappingURL=productController.js.map