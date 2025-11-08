import { create } from "zustand";
import type {
  Product,
  CartItem,
  FilterState,
  UIState,
  Category,
  Brand,
} from "../types";

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
  setCategory: (category: Category | "all") => void; 
  setBrand: (brand: Brand | "all") => void; 
  clearFilters: () => void;

  // cart
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  //ui
  toggleCart: () => void;
};
export const useStore = create<State & Actions>((set) => ({
  // --- initial data ---
  products: [
    {
      id: "p1",
      title: "Wireless Headphones",
      price: 120,
      compareAtPrice: 150,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      category: "Sound",
      image:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800",
      inStock: true,
      rating: { value: 4.7, count: 284 },
    },
    {
      id: "p2",
      title: "Smartwatch Series X",
      price: 199,
      compareAtPrice: 249,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      image:
        "https://images.unsplash.com/photo-1606813902912-0e81e3f2f2cc?w=800",
      inStock: true,
      rating: { value: 4.4, count: 198 },
    },
    {
      id: "p3",
      title: "Mechanical Keyboard",
      price: 89,
      compareAtPrice: 109,
      storeId: "keyzone",
      storeName: "KeyZone",
      category: "Tech",
      image:
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
      inStock: true,
      rating: { value: 4.6, count: 152 },
    },
    {
      id: "p4",
      title: "Gaming Mouse Pro",
      price: 59,
      compareAtPrice: 79,
      storeId: "keyzone",
      storeName: "KeyZone",
      image:
        "https://images.unsplash.com/photo-1612599274560-3e84a1d4a3a4?w=800",
      inStock: true,
      rating: { value: 4.3, count: 310 },
    },
    {
      id: "p5",
      title: "4K Ultra Monitor 27”",
      price: 329,
      compareAtPrice: 399,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      inStock: true,
      rating: { value: 4.8, count: 147 },
    },
    {
      id: "p6",
      title: "Bluetooth Speaker",
      price: 69,
      compareAtPrice: 89,
      storeId: "soundwave",
      storeName: "SoundWave",
      category: "Sound",
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800",
      inStock: true,
      rating: { value: 4.5, count: 224 },
    },
    {
      id: "p7",
      title: "Noise Cancelling Earbuds",
      price: 99,
      compareAtPrice: 129,
      storeId: "soundwave",
      storeName: "SoundWave",
      image:
        "https://images.unsplash.com/photo-1606220838311-9b0e8b7b8b67?w=800",
      inStock: false,
      rating: { value: 4.2, count: 89 },
    },
    {
      id: "p8",
      title: "Portable SSD 1TB",
      price: 159,
      compareAtPrice: 189,
      storeId: "datahub",
      storeName: "DataHub",
      image:
        "https://images.unsplash.com/photo-1611078489935-0cbf84b11b86?w=800",
      inStock: true,
      rating: { value: 4.9, count: 376 },
    },
    {
      id: "p9",
      title: "Laptop Stand Adjustable",
      price: 39,
      compareAtPrice: 49,
      storeId: "ergoworks",
      storeName: "ErgoWorks",
      category: "Home",
      image:
        "https://images.unsplash.com/photo-1588874299471-8c58d8e9f2c2?w=800",
      inStock: true,
      rating: { value: 4.4, count: 128 },
    },
    {
      id: "p10",
      title: "Smart Home Bulb (4-Pack)",
      price: 49,
      compareAtPrice: 69,
      storeId: "homelight",
      storeName: "HomeLight",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800",
      inStock: true,
      rating: { value: 4.3, count: 92 },
    },
    {
      id: "p11",
      title: "Wireless Charger Pad",
      price: 29,
      compareAtPrice: 39,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      image:
        "https://images.unsplash.com/photo-1581349481262-94f52c5f76f6?w=800",
      inStock: true,
      rating: { value: 4.1, count: 75 },
    },
    {
      id: "p12",
      title: "USB-C Docking Station",
      price: 119,
      compareAtPrice: 149,
      storeId: "datahub",
      storeName: "DataHub",
      image:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800",
      inStock: true,
      rating: { value: 4.7, count: 203 },
    },
  ],

  filters: {
    query: "",
    store: "all",
    category: "all",
    brand: "all",
    minPrice: 0,
    maxPrice: 9999,
    discountedOnly: false,
    sortBy: "popular",
  },
  cart: [],
  ui: { cartOpen: false },

  // Action
  //filters
  setQuery: (q) => set((s) => ({ filters: { ...s.filters, query: q } })),
  setSort: (sort) => set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
  setDiscounted: (v) =>
    set((s) => ({ filters: { ...s.filters, discountedOnly: v } })),
  setCategory: (category: Category | "all") =>
    set((s) => ({ filters: { ...s.filters, category } })),
  setBrand: (brand: Brand | "all") =>
    set((s) => ({ filters: { ...s.filters, brand } })), 

  clearFilters: () =>
    set((_s) => ({
      filters: {
        query: "",
        store: "all",
        category: "all",
        brand: "all",
        minPrice: 0,
        maxPrice: 9999,
        discountedOnly: false,
        sortBy: "popular",
      },
    })),

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

export const useProducts = () => useStore((s) => s.products);
export const useFilters = () => useStore((s) => s.filters);
