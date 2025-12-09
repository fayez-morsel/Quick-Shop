import { create } from "zustand";
import { apiLogin, apiRegister } from "../api/auth";
import type { UserRole } from "../types";
import { useCartStore } from "./useCartStore";
import { useFavoriteStore } from "./useFavoriteStore";
import { useOrderStore } from "./useOrderStore";

type AuthState = {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  userStoreId: string;
};

type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  initializeAuth: () => void;
  setRole: (role: UserRole) => void;
  setUserInfo: (info: { name: string; email: string }) => void;
  setSellerStoreId: (storeId?: string) => void;
};

const initialAuth =
  typeof window !== "undefined"
    ? localStorage.getItem("isAuthenticated") === "true"
    : false;
const initialRole =
  typeof window !== "undefined"
    ? (localStorage.getItem("userRole") as UserRole | null) ?? "buyer"
    : "buyer";
const initialName =
  typeof window !== "undefined" ? localStorage.getItem("userName") ?? "" : "";
const initialEmail =
  typeof window !== "undefined" ? localStorage.getItem("userEmail") ?? "" : "";
const initialStoreId =
  typeof window !== "undefined"
    ? localStorage.getItem("userStoreId") ?? ""
    : "";

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isAuthenticated: initialAuth,
  userRole: initialRole,
  userName: initialName,
  userEmail: initialEmail,
  userStoreId: initialStoreId,

  login: async (email, password) => {
    const res = await apiLogin(email, password);
    const { token, user } = res.data;

    localStorage.setItem("qs-token", token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userRole", user.role);
    if (user.storeId) {
      localStorage.setItem("userStoreId", user.storeId);
    } else {
      localStorage.removeItem("userStoreId");
    }

    set({
      isAuthenticated: true,
      userRole: user.role,
      userName: user.name,
      userEmail: user.email,
      userStoreId: user.storeId || "",
    });

    await Promise.allSettled([
      useCartStore.getState().loadCart(),
      useFavoriteStore.getState().loadFavorites(),
      useOrderStore.getState().fetchBuyerOrders(),
    ]);
  },

  logout: () => {
    localStorage.removeItem("qs-token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStoreId");
    localStorage.removeItem("isAuthenticated");

    useCartStore.getState().hardReset();
    useFavoriteStore.getState().hardReset();
    useOrderStore.getState().hardReset();

    set({
      isAuthenticated: false,
      userRole: "buyer",
      userName: "",
      userEmail: "",
      userStoreId: "",
    });
  },

  register: async (name, email, password, role) => {
    await apiRegister({ name, email, password, role });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("qs-token");
    if (!token) return;
    set({
      isAuthenticated: true,
      userRole: (localStorage.getItem("userRole") as UserRole) || "buyer",
      userName: localStorage.getItem("userName") || "",
      userEmail: localStorage.getItem("userEmail") || "",
      userStoreId: localStorage.getItem("userStoreId") || "",
    });
  },

  setRole: (role) => {
    localStorage.setItem("userRole", role);
    set({ userRole: role });
  },

  setUserInfo: ({ name, email }) => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    set({ userName: name, userEmail: email });
  },

  setSellerStoreId: (storeId = "") => {
    localStorage.setItem("userStoreId", storeId);
    set({ userStoreId: storeId });
  },
}));
