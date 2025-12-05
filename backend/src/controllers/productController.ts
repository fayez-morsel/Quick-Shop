import type { Response } from "express";
import { Types } from "mongoose";
import { Product } from "../models/Product.js";
import { Store } from "../models/Store.js";
import type { AuthReq } from "../middleware/auth.js";
import { User } from "../models/User.js";

const BRANDS = [
  "Tech Hub",
  "KeyZone",
  "SoundWave",
  "DataHub",
  "ErgoWorks",
  "HomeLight",
  "Store"
] as const;

const pickBrand = (seed: string | undefined, fallback: string) => {
  if (!seed) return fallback;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return BRANDS[hash % BRANDS.length];
};

export const getAllProducts = async (req: AuthReq, res: Response) => {
  const { limit, page, storeId, category, q } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
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

export const getProductById = async (req: AuthReq, res: Response) => {
  const product = await Product.findById(new Types.ObjectId(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

export const createProduct = async (req: AuthReq, res: Response) => {
  try {
    const { storeId, title, price, compareAtPrice, category, stock, image, brand } =
      req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }
    if (price === undefined || Number.isNaN(Number(price))) {
      return res.status(400).json({ error: "Price is required" });
    }
    const safeCategory =
      typeof category === "string" && category.trim().length > 0
        ? category
        : "General";
    const safeImage =
      typeof image === "string" && image.trim().length > 0
        ? image
        : "https://via.placeholder.com/400";

    // Resolve store id: provided or seller-owned
    let resolvedStoreId = storeId as string | undefined;
    if (!resolvedStoreId && req.user?.userId) {
      const owned = await Store.findOne({ owner: req.user.userId });
      resolvedStoreId = owned?._id?.toString();
      // Auto-create store for seller without store
      if (!resolvedStoreId && req.user.role === "seller") {
        const user = await User.findById(req.user.userId);
        const newStore = await Store.create({
          name: user?.name ? `${user.name}'s Store` : "My Store",
          owner: req.user.userId,
          email: user?.email ?? "",
          category: category || "General",
          approved: false,
          status: "pending",
        });
        resolvedStoreId = newStore._id.toString();
      }
    }

    if (!resolvedStoreId || !Types.ObjectId.isValid(resolvedStoreId)) {
      return res.status(400).json({ error: "Invalid or missing storeId" });
    }

    const storeObjectId = new Types.ObjectId(resolvedStoreId);
    const store = await Store.findById(storeObjectId);
    if (!store) return res.status(400).json({ error: "Store not found" });

    const numericStock = typeof stock === "number" ? stock : Number(stock ?? 0);
    const product = await Product.create({
      store: storeObjectId,
      title,
      price,
      compareAtPrice,
      category: safeCategory,
      brand:
        typeof brand === "string" && brand.trim().length > 0
          ? brand.trim()
          : pickBrand(title ?? store.name, store.name) ?? store.name,
      stock: numericStock,
      image: safeImage,
      inStock: numericStock > 0,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error", err);
    res.status(500).json({ error: "Server error" });
  }
};
