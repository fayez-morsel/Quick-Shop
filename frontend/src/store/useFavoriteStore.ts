import { create } from "zustand";
import { apiGetFavorites, apiToggleFavorite } from "../api/favorites";

type FavoriteDto = {
  product?: string | { _id?: string; id?: string };
};

type FavoriteState = {
  favoritesMap: Record<string, boolean>;
  favoritesLoading: boolean;
};

type FavoriteActions = {
  loadFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  hardReset: () => void;
};

const hasToken = () =>
  typeof window !== "undefined" && Boolean(localStorage.getItem("qs-token"));

export const useFavoriteStore = create<FavoriteState & FavoriteActions>((set) => ({
  favoritesMap: {},
  favoritesLoading: false,

  hardReset: () => set({ favoritesMap: {} }),

  loadFavorites: async () => {
    if (!hasToken()) return;
    set({ favoritesLoading: true });
    try {
      const res = await apiGetFavorites();
      const items: FavoriteDto[] = Array.isArray(res.data) ? res.data : [];
      const ids = items
        .map((fav) => {
          const product = fav?.product;
          if (!product) return null;
          return typeof product === "string" ? product : product._id ?? product.id ?? null;
        })
        .filter((id): id is string => Boolean(id));
      const map = ids.reduce<Record<string, boolean>>((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});
      set({ favoritesMap: map, favoritesLoading: false });
    } catch {
      set({ favoritesLoading: false });
    }
  },

  toggleFavorite: async (productId) => {
    if (!hasToken()) return;
    set((state) => {
      const next = { ...state.favoritesMap };
      next[productId] = !state.favoritesMap[productId];
      return { favoritesMap: next };
    });
    try {
      await apiToggleFavorite(productId);
    } catch {
      // rollback on failure
      set((state) => {
        const next = { ...state.favoritesMap };
        next[productId] = !state.favoritesMap[productId];
        return { favoritesMap: next };
      });
    }
  },
}));
