import { create } from "zustand";
import type { Product, CartItem, FilterState,UIState } from "../types";

//types for state and action

type State = {
    products: Product[];
    filters: FilterState;
    cart: CartItem[];
    ui: UIState;
}