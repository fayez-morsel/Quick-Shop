import { create } from "zustand";
import { apiCreateProduct, apiDeleteProduct, apiGetProducts } from "../api/products";
import type { Product } from "../types";
import { arrayToMap, normalizeProduct } from "./shared";

type ProductState = {
  productsMap: Record<string, Product>;
  productIds: string[];
  productsLoading: boolean;
  productsError?: string | null;
};

type ProductActions = {
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProductDetails: (id: string, updates: Partial<Product>) => void;
  upsertProducts: (products: Product[]) => void;
  replaceProducts: (products: Product[]) => void;
};

const defaultState: ProductState = {
  productsMap: {},
  productIds: [],
  productsLoading: false,
  productsError: null,
};

export const useProductStore = create<ProductState & ProductActions>((set) => ({
  ...defaultState,

  replaceProducts: (products) => {
    const normalized = products.map(normalizeProduct);
    set({
      productsMap: arrayToMap(normalized),
      productIds: normalized.map((p: Product) => p.id),
    });
  },

  upsertProducts: (products) => {
    if (!products.length) return;
    set((state) => {
      const nextMap = { ...state.productsMap };
      const ids = new Set(state.productIds);
      products.forEach((raw) => {
        const normalized = normalizeProduct(raw);
        nextMap[normalized.id] = normalized;
        ids.add(normalized.id);
      });
      return {
        productsMap: nextMap,
        productIds: Array.from(ids),
      };
    });
  },

  fetchProducts: async () => {
    set({ productsLoading: true, productsError: null });
    try {
      const res = await apiGetProducts();
      const normalized = (res.data ?? []).map(normalizeProduct);
      set({
        productsMap: arrayToMap(normalized),
        productIds: normalized.map((p: Product) => p.id),
        productsLoading: false,
      });
    } catch {
      set({ productsLoading: false, productsError: "Failed to load products" });
    }
  },

  addProduct: async (product) => {
    try {
      const looksLikeObjectId = (value: unknown) =>
        typeof value === "string" && /^[a-f\\d]{24}$/i.test(value);
      const userStoreId =
        typeof window !== "undefined"
          ? localStorage.getItem("userStoreId") ?? undefined
          : undefined;
      const validStoreId =
        (userStoreId && looksLikeObjectId(userStoreId) && userStoreId) ||
        (product.storeId && looksLikeObjectId(product.storeId) && product.storeId) ||
        (product.store && looksLikeObjectId(product.store) && product.store) ||
        undefined;
      const payload = {
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        category: product.category,
        stock: product.stock,
        image: product.image ?? product.images?.[0],
        images: product.images,
        brand: product.brand,
        storeId: validStoreId,
      };
      const res = await apiCreateProduct(payload);
      const created = normalizeProduct(res.data ?? payload);
      set((state) => {
        const nextMap = { ...state.productsMap, [created.id]: created };
        const ids = state.productIds.includes(created.id)
          ? state.productIds
          : [...state.productIds, created.id];
        return { productsMap: nextMap, productIds: ids };
      });
    } catch {
      // ignore network errors in UI for now
    }
  },

  removeProduct: async (id) => {
    try {
      await apiDeleteProduct(id);
    } catch {
      // ignore failed deletions for now
      return;
    }
    set((state) => {
      if (!state.productsMap[id]) return state;
      const nextMap = { ...state.productsMap };
      delete nextMap[id];
      return {
        productsMap: nextMap,
        productIds: state.productIds.filter((pid) => pid !== id),
      };
    });
  },

  updateProductDetails: (id, updates) =>
    set((state) => {
      const product = state.productsMap[id];
      if (!product) return state;
      const { stock, inStock: explicitInStock, images, ...rest } = updates;
      const nextStock = typeof stock === "number" ? stock : product.stock ?? 0;
      const normalizedImages = (
        images && images.length
          ? images
          : product.images?.length
          ? product.images
          : product.image
          ? [product.image]
          : []
      ).filter(Boolean);
      const primaryImage = normalizedImages[0] ?? product.image ?? "";
      const updatedProduct: Product = {
        ...product,
        ...rest,
        images: normalizedImages.length
          ? normalizedImages
          : product.images ?? (primaryImage ? [primaryImage] : []),
        image: primaryImage,
        stock: nextStock,
        inStock:
          explicitInStock ??
          (stock !== undefined ? stock > 0 : product.inStock),
      };
      return {
        productsMap: { ...state.productsMap, [id]: updatedProduct },
      };
    }),
}));

export const selectProductsArray = (state: ProductState) =>
  state.productIds
    .map((id) => state.productsMap[id])
    .filter(Boolean) as Product[];
