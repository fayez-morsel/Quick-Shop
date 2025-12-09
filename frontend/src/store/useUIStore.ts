import { create } from "zustand";
import type { Brand, Category, FilterState } from "../types";

type UIState = {
  cartOpen: boolean;
  filters: FilterState;
};

type UIActions = {
  toggleCart: () => void;
  setQuery: (q: string) => void;
  setSort: (sort: FilterState["sortBy"]) => void;
  setDiscounted: (value: boolean) => void;
  setCategory: (category: Category | "all" | Category[]) => void;
  setBrand: (brand: Brand | "all" | Brand[]) => void;
  setMaxPrice: (value: number) => void;
  clearFilters: () => void;
};

const defaultFilters: FilterState = {
  query: "",
  store: "all",
  category: [],
  brand: [],
  minPrice: 0,
  maxPrice: 9999,
  discountedOnly: false,
  sortBy: "popular",
};

export const useUIStore = create<UIState & UIActions>((set) => ({
  cartOpen: false,
  filters: defaultFilters,

  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

  setQuery: (q) => set((state) => ({ filters: { ...state.filters, query: q } })),

  setSort: (sort) =>
    set((state) => ({ filters: { ...state.filters, sortBy: sort } })),

  setDiscounted: (value) =>
    set((state) => ({
      filters: { ...state.filters, discountedOnly: value },
    })),

  setCategory: (category) =>
    set((state) => {
      let updated: Category[] = [];
      if (category === "all") {
        updated = [];
      } else if (Array.isArray(category)) {
        updated = category;
      } else {
        const hasCategory = state.filters.category.includes(category);
        updated = hasCategory
          ? state.filters.category.filter((c) => c !== category)
          : [...state.filters.category, category];
      }
      return { filters: { ...state.filters, category: updated } };
    }),

  setBrand: (brand) =>
    set((state) => {
      let updated: Brand[] = [];
      if (brand === "all") {
        updated = [];
      } else if (Array.isArray(brand)) {
        updated = brand;
      } else {
        const hasBrand = state.filters.brand.includes(brand);
        updated = hasBrand
          ? state.filters.brand.filter((b) => b !== brand)
          : [...state.filters.brand, brand];
      }
      return { filters: { ...state.filters, brand: updated } };
    }),

  setMaxPrice: (value) =>
    set((state) => ({ filters: { ...state.filters, maxPrice: value } })),

  clearFilters: () => set({ filters: defaultFilters }),
}));

export const defaultFilterState = defaultFilters;
