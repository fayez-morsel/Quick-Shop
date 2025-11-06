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
  setSort: (sort: FilterState["sortBy"]) => void;
  setDiscounted: (v: boolean) => void;

  // cart
  addtoCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  //ui
  toggleCart: () => void;
};
