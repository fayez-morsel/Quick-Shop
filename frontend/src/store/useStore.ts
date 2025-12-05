import { create } from "zustand";
import {
  apiLogin,
  apiRegister
} from "../api/auth";
import {
  apiGetProducts,
  apiCreateProduct
} from "../api/products";
import {
  apiGetCart,
  apiAddToCart,
  apiUpdateCart,
  apiRemoveCartItem
} from "../api/cart";
import {
  apiGetFavorites,
  apiToggleFavorite
} from "../api/favorites";
import {
  apiGetBuyerOrders,
  apiGetSellerOrders,
  apiPlaceOrder,
  apiUpdateOrderStatus
} from "../api/orders";
import type {
  Product,
  CartItem,
  FilterState,
  UIState,
  Category,
  Brand,
  Order,
  OrderStatus,
  UserRole,
} from "../types";

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

type State = {
  products: Product[];
  productsLoading: boolean;
  productsError?: string | null;
  filters: FilterState;
  cart: CartItem[];
  cartLoading: boolean;
  favorites: string[];
  favoritesLoading: boolean;
  ui: UIState;
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  userStoreId: string;
  confirmedOrderIds: string[];
  orders: Order[];
  ordersLoading: boolean;
};

type Actions = {
  //filters
  setQuery: (q: string) => void;
  setSort: (sort: "popular" | "priceLow" | "priceHigh") => void;
  setDiscounted: (v: boolean) => void;
  setCategory: (category: Category | "all" | Category[]) => void;
  setBrand: (brand: Brand | "all" | Brand[]) => void;
  clearFilters: () => void;

  // favorites
  loadFavorites: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;

  // cart
  loadCart: () => Promise<void>;
  addToCart: (id: string, qty?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  setQty: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // products
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => void;
  updateProductDetails: (id: string, updates: Partial<Product>) => void;

  // orders
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  fetchBuyerOrders: () => Promise<void>;
  fetchSellerOrders: () => Promise<void>;
  placeOrder: (items?: CartItem[]) => Promise<string | null>;
  autoDeliverAfterConfirm: (orderId: string) => void;

  // auth
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setUserInfo: (info: { name: string; email: string }) => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  initializeAuth: () => void;

  markOrderConfirmed: (orderId: string) => void;
  setSellerStoreId: (storeId?: string) => void;
  toggleCart: () => void;
};

const normalizeProduct = (product: any): Product => {
  const storeName = product.storeName ?? product.store?.name ?? product.store ?? "";
  const brand = product.brand ?? storeName;
  const compareAt = typeof product.compareAtPrice === "number" ? product.compareAtPrice : undefined;
  const discounted =
    typeof compareAt === "number" && typeof product.price === "number"
      ? compareAt > product.price
      : Boolean(product.discounted);

  const normalized: Product = {
    ...product,
    _id: product._id ?? product.id ?? "",
    id: product._id ?? product.id ?? "",
    image: product.image ?? product.images?.[0] ?? "",
    inStock:
      typeof product.inStock === "boolean"
        ? product.inStock
        : product.stock > 0 || product.stock === undefined,
    stock: product.stock ?? 0,
    storeName,
    brand,
    storeId: product.storeId ?? product.store ?? "",
    discounted,
  };
  return normalized;
};

export const useStore = create<State & Actions>((set, get) => ({
  // --- initial data ---
  products: [],
  productsLoading: false,
  productsError: null,
  orders: [],
  ordersLoading: false,
  confirmedOrderIds: [],
  filters: {
    query: "",
    store: "all",
    category: [],
    brand: [],
    minPrice: 0,
    maxPrice: 9999,
    discountedOnly: false,
    sortBy: "popular",
  },
  cart: [],
  cartLoading: false,
  favorites: [],
  favoritesLoading: false,
  ui: { cartOpen: false },
  isAuthenticated: initialAuth,
  userRole: initialRole,
  userName: initialName,
  userEmail: initialEmail,
  userStoreId: initialStoreId,

  // Action
  //filters
  setQuery: (q) => set((s) => ({ filters: { ...s.filters, query: q } })),
  setSort: (sort) => set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
  setDiscounted: (v) =>
    set((s) => ({ filters: { ...s.filters, discountedOnly: v } })),
  setCategory: (category: Category | "all" | Category[]) =>
    set((s) => {
      let updated: Category[] = [];
      if (category === "all") {
        updated = [];
      } else if (Array.isArray(category)) {
        updated = category;
      } else {
        const hasCategory = s.filters.category.includes(category);
        updated = hasCategory
          ? s.filters.category.filter((c) => c !== category)
          : [...s.filters.category, category];
      }
      return { filters: { ...s.filters, category: updated } };
    }),
  setBrand: (brand: Brand | "all" | Brand[]) =>
    set((s) => {
      let updated: Brand[] = [];
      if (brand === "all") {
        updated = [];
      } else if (Array.isArray(brand)) {
        updated = brand;
      } else {
        const hasBrand = s.filters.brand.includes(brand);
        updated = hasBrand
          ? s.filters.brand.filter((b) => b !== brand)
          : [...s.filters.brand, brand];
      }
      return { filters: { ...s.filters, brand: updated } };
    }),

  clearFilters: () =>
    set(() => ({
      filters: {
        query: "",
        store: "all",
        category: [],
        brand: [],
        minPrice: 0,
        maxPrice: 9999,
        discountedOnly: false,
        sortBy: "popular",
      },
    })),

  // Products
  fetchProducts: async () => {
    set({ productsLoading: true, productsError: null });
    try {
      const res = await apiGetProducts();
      const normalized = (res.data ?? []).map(normalizeProduct);
      set({ products: normalized, productsLoading: false });
    } catch (err) {
      set({ productsLoading: false, productsError: "Failed to load products" });
    }
  },
  addProduct: async (product) => {
    try {
      const res = await apiCreateProduct(product);
      const created = normalizeProduct(res.data);
      set((s) => ({ products: [...s.products, created] }));
    } catch {
      // swallow
    }
  },
  removeProduct: (id) =>
    set((s) => ({
      products: s.products.filter((product) => product._id !== id),
    })),
  updateProductDetails: (id, updates) =>
    set((s) => ({
      products: s.products.map((product) => {
        if (product._id !== id) return product;
        const { stock, inStock: explicitInStock, images, ...rest } = updates;
        const nextStock =
          typeof stock === "number" ? stock : product.stock ?? 0;
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
        return {
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
      }),
    })),

  // Cart
  loadCart: async () => {
    if (!get().isAuthenticated) return;
    set({ cartLoading: true });
    try {
      const res = await apiGetCart();
      const items = res.data?.items ?? res.data ?? [];
      const normalized: CartItem[] = items.map((item: any) => {
        const product = normalizeProduct(item.product ?? item);
        const quantity = item.quantity ?? item.qty ?? 1;
        return {
          product,
          productId: product._id,
          quantity,
          qty: quantity,
          _id: item._id,
        };
      });
      set({ cart: normalized, cartLoading: false });
    } catch {
      set({ cartLoading: false });
    }
  },
  addToCart: async (id, qty = 1) => {
    await apiAddToCart(id, qty);
    await get().loadCart();
  },
  removeFromCart: async (id) => {
    await apiRemoveCartItem(id);
    await get().loadCart();
  },
  setQty: async (id, qty) => {
    const nextQty = Math.max(1, qty);
    await apiUpdateCart(id, nextQty);
    await get().loadCart();
  },
  clearCart: async () => {
    const { cart } = get();
    for (const item of cart) {
      const productId =
        typeof item.product === "string" ? item.product : item.product._id;
      await apiRemoveCartItem(productId);
    }
    set({ cart: [] });
  },

  // Favorites
  loadFavorites: async () => {
    if (!get().isAuthenticated) return;
    set({ favoritesLoading: true });
    try {
      const res = await apiGetFavorites();
      const ids =
        res.data?.map(
          (fav: any) =>
            (typeof fav.product === "string"
              ? fav.product
              : fav.product?._id) as string
        ) ?? [];
      set({ favorites: ids, favoritesLoading: false });
    } catch {
      set({ favoritesLoading: false });
    }
  },
  toggleFavorite: async (id) => {
    if (!get().isAuthenticated) return;
    try {
      const res = await apiToggleFavorite(id);
      const ids =
        res.data?.map(
          (fav: any) =>
            (typeof fav.product === "string"
              ? fav.product
              : fav.product?._id) as string
        ) ?? [];
      set({ favorites: ids });
    } catch {
      // no-op
    }
  },

  // Orders
  fetchBuyerOrders: async () => {
    if (!get().isAuthenticated) return;
    set({ ordersLoading: true });
    try {
      const res = await apiGetBuyerOrders();
      const orders = (res.data ?? []).map((o: any) => ({
        ...o,
        _id: o._id ?? o.id ?? "",
        id: o._id ?? o.id ?? "",
        storeId: (o.store ?? o.storeId ?? "") as string,
        buyerEmail:
          o.buyerEmail ??
          o?.buyer?.email ??
          get().userEmail ??
          "",
        buyerName: o.buyerName ?? o?.buyer?.name ?? "",
        items: (o.items ?? []).map((item: any) => ({
          ...item,
          product:
            typeof item.product === "object"
              ? normalizeProduct(item.product)
              : item.product,
          productId:
            typeof item.product === "string"
              ? item.product
              : item.product?._id ?? item.product?.id ?? "",
          qty: item.quantity ?? item.qty ?? 1,
          quantity: item.quantity ?? item.qty ?? 1,
        })),
      }));
      set({ orders, ordersLoading: false });
    } catch {
      set({ ordersLoading: false });
    }
  },
  fetchSellerOrders: async () => {
    if (!get().isAuthenticated) return;
    set({ ordersLoading: true });
    try {
      const res = await apiGetSellerOrders();
      const orders = (res.data ?? []).map((o: any) => ({
        ...o,
        _id: o._id ?? o.id ?? "",
        id: o._id ?? o.id ?? "",
        storeId: (o.store ?? o.storeId ?? "") as string,
        buyerEmail:
          o.buyerEmail ??
          o?.buyer?.email ??
          "",
        buyerName: o.buyerName ?? o?.buyer?.name ?? "",
        items: (o.items ?? []).map((item: any) => ({
          ...item,
          product:
            typeof item.product === "object"
              ? normalizeProduct(item.product)
              : item.product,
          productId:
            typeof item.product === "string"
              ? item.product
              : item.product?._id ?? item.product?.id ?? "",
          qty: item.quantity ?? item.qty ?? 1,
          quantity: item.quantity ?? item.qty ?? 1,
        })),
      }));
      set({ orders, ordersLoading: false });
    } catch {
      set({ ordersLoading: false });
    }
  },
  autoDeliverAfterConfirm: (orderId: string) => {
    // mark as confirmed locally and auto-set delivered after 5 minutes
    get().markOrderConfirmed(orderId);
    const token = typeof window !== "undefined" ? localStorage.getItem("qs-token") : null;
    if (!get().isAuthenticated || !token) return;
    setTimeout(() => {
      void get().updateOrderStatus(orderId, "Delivered");
    }, 5 * 60 * 1000);
  },
  placeOrder: async (items) => {
    const cartItems = items ?? get().cart;
    if (!cartItems.length) return null;
    const payload = cartItems.map((item) => ({
      productId:
        typeof item.product === "string"
          ? item.product
          : (item.product as Product)._id,
      quantity: item.quantity ?? 1,
    }));
    const res = await apiPlaceOrder(payload);
    await get().loadCart();
    await get().fetchBuyerOrders();
    return res.data?._id ?? null;
  },
  updateOrderStatus: async (orderId, status) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("qs-token") : null;
    if (!get().isAuthenticated || !token) {
      return;
    }
    await apiUpdateOrderStatus(orderId, status);
    // Refresh both seller and buyer views so status updates propagate to reviews eligibility
    await Promise.allSettled([get().fetchSellerOrders(), get().fetchBuyerOrders()]);
  },

  // Auth
  login: async (email: string, password: string) => {
    const res = await apiLogin(email, password);

    const { token, user } = res.data;

    // Save JWT
    localStorage.setItem("qs-token", token);
    localStorage.setItem("isAuthenticated", "true");

    // Save user data
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userRole", user.role);
    if (user.storeId) {
      localStorage.setItem("userStoreId", user.storeId);
    } else {
      localStorage.removeItem("userStoreId");
    }

    // Update Zustand state
    set({
      isAuthenticated: true,
      userRole: user.role,
      userName: user.name,
      userEmail: user.email,
      userStoreId: user.storeId || "",
    });

    await get().loadCart();
    await get().loadFavorites();
  },
  logout: () => {
    // Remove everything from localStorage
    localStorage.removeItem("qs-token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStoreId");
    localStorage.removeItem("isAuthenticated");

    // Reset Zustand
    set({
      isAuthenticated: false,
      userRole: "buyer",
      userName: "",
      userEmail: "",
      userStoreId: "",
      cart: [],
      favorites: [],
      orders: [],
    });
  },
  register: async (name, email, password, role) => {
    await apiRegister({ name, email, password, role });
  },
  setRole: (role) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", role);
      }
      return { userRole: role };
    }),
  setUserInfo: ({ name, email }) => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);

    return set({
      userName: name,
      userEmail: email,
    });
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

  markOrderConfirmed: (orderId) => {
    set((s) => ({
      confirmedOrderIds: s.confirmedOrderIds.includes(orderId)
        ? s.confirmedOrderIds
        : [...s.confirmedOrderIds, orderId],
    }));
    if (get().isAuthenticated) {
      void get().fetchBuyerOrders();
      void get().fetchSellerOrders();
    }
  },
  setSellerStoreId: (storeId = "") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userStoreId", storeId);
    }
    set({ userStoreId: storeId });
  },
  toggleCart: () => set((s) => ({ ui: { cartOpen: !s.ui.cartOpen } })),
}));

export const useFilters = () => useStore((s) => s.filters);
