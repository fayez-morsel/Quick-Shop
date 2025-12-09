import { create } from "zustand";
import {
  apiAddToCart,
  apiGetCart,
  apiRemoveCartItem,
  apiUpdateCart,
} from "../api/cart";
import { normalizeProduct } from "./shared";
import type { Product } from "../types";
import { useProductStore } from "./useProductStore";

type CartState = {
  cart: Record<string, number>;
  cartLoading: boolean;
};

type CartActions = {
  loadCart: () => Promise<void>;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  setQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  hydrateFromItems: (items: Array<{ product: Product; quantity: number }>) => void;
  hardReset: () => void;
};

const defaultCartState: CartState = {
  cart: {},
  cartLoading: false,
};

const hasToken = () =>
  typeof window !== "undefined" && Boolean(localStorage.getItem("qs-token"));

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  ...defaultCartState,

  hardReset: () => set({ cart: {} }),

  hydrateFromItems: (items) => {
    const products: Product[] = [];
    const cartMap: Record<string, number> = {};
    items.forEach((item) => {
      const normalized = normalizeProduct(item.product);
      products.push(normalized);
      cartMap[normalized.id] = item.quantity;
    });
    useProductStore.getState().upsertProducts(products);
    set({ cart: cartMap });
  },

  loadCart: async () => {
    if (!hasToken()) return;
    set({ cartLoading: true });
    try {
      const res = await apiGetCart();
      const items = res.data?.items ?? res.data ?? [];
      const products: Product[] = [];
      const cartMap: Record<string, number> = {};
      items.forEach((raw: any) => {
        const normalized = normalizeProduct(raw.product ?? raw);
        const quantity = raw.quantity ?? raw.qty ?? 1;
        products.push(normalized);
        cartMap[normalized.id] = quantity;
      });
      useProductStore.getState().upsertProducts(products);
      set({ cart: cartMap, cartLoading: false });
    } catch {
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId, qty = 1) => {
    if (!hasToken()) return;
    const safeQty = Math.max(1, qty);
    set((state) => ({
      cart: {
        ...state.cart,
        [productId]: (state.cart[productId] ?? 0) + safeQty,
      },
    }));
    try {
      await apiAddToCart(productId, safeQty);
    } catch {
      // rollback on error
      set((state) => {
        const next = { ...state.cart };
        next[productId] = Math.max(0, (next[productId] ?? safeQty) - safeQty);
        if (next[productId] <= 0) {
          delete next[productId];
        }
        return { cart: next };
      });
    }
  },

  removeFromCart: async (productId) => {
    if (!hasToken()) return;
    set((state) => {
      if (!(productId in state.cart)) return state;
      const next = { ...state.cart };
      delete next[productId];
      return { cart: next };
    });
    try {
      await apiRemoveCartItem(productId);
    } catch {
      // restore if failed
      await get().loadCart();
    }
  },

  setQty: async (productId, qty) => {
    if (!hasToken()) return;
    const nextQty = Math.max(1, qty);
    set((state) => ({
      cart: { ...state.cart, [productId]: nextQty },
    }));
    try {
      await apiUpdateCart(productId, nextQty);
    } catch {
      await get().loadCart();
    }
  },

  clearCart: async () => {
    if (!hasToken()) {
      set({ cart: {} });
      return;
    }
    const currentIds = Object.keys(get().cart);
    set({ cart: {} });
    try {
      await Promise.allSettled(currentIds.map((id) => apiRemoveCartItem(id)));
    } catch {
      // ignore individual failures
    }
  },
}));
