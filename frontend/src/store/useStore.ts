import { create } from "zustand";
import type { Product, CartItem, FilterState, UIState } from "../types";

//types for state and action

type State = {
  products: Product[];
  filters: FilterState;
  cart: CartItem[];
  ui: UIState;
};

type Actions = {
  //filters
  setQuery: (q: string) => void;
  setSort: (sort: "popular" | "priceLow" | "priceHigh") => void;
  setDiscounted: (v: boolean) => void;

  // cart
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  //ui
  toggleCart: () => void;
};
export const useStore = create<State & Actions>((set, _get) => ({
  // --- initial data ---
  products: [
    {
      id: "p1",
      title: "Wireless Headphones",
      price: 120,
      compareAtPrice: 150,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      image:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800",
      inStock: true,
    },
    {
      id: "p2",
      title: "Running Shoes",
      price: 80,
      compareAtPrice: 99,
      storeId: "sportify",
      storeName: "Sportify",
      image:
        "https://images.unsplash.com/photo-1606813902912-0fd5104e6f87?w=800",
      inStock: true,
    },
    {
      id: "p3",
      title: "Leather Wallet",
      price: 40,
      storeId: "style-co",
      storeName: "Style & Co",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9b?w=800",
      inStock: true,
    },
  ],
  filters: {
    query: "",
    store: "all",
    minPrice: 0,
    maxPrice: 9999,
    discountedOnly: false,
    sortBy: "popular",
  },
  cart: [],
  ui: { cartOpen: false },

  // Action
  //filters
  setQuery: (q) =>
    set(
      (s) =>
        ({
          ...s,
          filters: { ...s.filters, query: q },
        } as Partial<State>)
    ),

  setSort: (sort) =>
    set(
      (s) =>
        ({
          ...s,
          filters: { ...s.filters, sortBy: sort as FilterState["sortBy"] },
        } as Partial<State>)
    ),
  setDiscounted: (v) =>
    set(
      (s) =>
        ({
          ...s,
          filters: { ...s.filters, discountedOnly: v },
        } as Partial<State>)
    ),
  // Cart
  addToCart: (id) =>
    set((s) => {
      const exists = s.cart.find((c) => c.productId === id);
      return {
        cart: exists
          ? s.cart.map((c) =>
              c.productId === id ? { ...c, qty: c.qty + 1 } : c
            )
          : [...s.cart, { productId: id, qty: 1 }],
      };
    }),
  removeFromCart: (id) =>
    set((s) => ({ cart: s.cart.filter((c) => c.productId !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      cart: s.cart.map((c) =>
        c.productId === id ? { ...c, qty: Math.max(1, qty) } : c
      ),
    })),
  clearCart: () => set({ cart: [] }),
  toggleCart: () => set((s) => ({ ui: { cartOpen: !s.ui.cartOpen } })),
}));

// Selectors
export const useCartCount = () =>
  useStore((s) => s.cart.reduce((sum, c) => sum + c.qty, 0));

export const useFilteredProducts = () =>
  useStore((s) => {
    const { query, store, minPrice, maxPrice, discountedOnly, sortBy } =
      s.filters;
    let list = [...s.products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q)
      );
    }

    if (store !== "all") list = list.filter((p) => p.storeId === store);
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (discountedOnly)
      list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);

    if (sortBy === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") list.sort((a, b) => b.price - a.price);

    return list;
  });
