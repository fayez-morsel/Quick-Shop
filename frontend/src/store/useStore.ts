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
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9b?w=800",
      inStock: true,
    },
  ],
  filters: {
    query: "",
    store: "all",
    minPrice: 0,
    maxPrice: 9999,
    discountedOnly:false,
    sortBy: "popular",
  },
  
}));


