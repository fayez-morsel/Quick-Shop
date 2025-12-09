import { create } from "zustand";
import {
  apiGetBuyerOrders,
  apiGetSellerOrders,
  apiPlaceOrder,
  apiUpdateOrderStatus,
} from "../api/orders";
import type { CartItem, Order, OrderStatus, Product } from "../types";
import { normalizeProduct } from "./shared";
import { useProductStore } from "./useProductStore";
import { useCartStore } from "./useCartStore";

type OrderState = {
  orders: Order[];
  ordersLoading: boolean;
  confirmedOrderIds: string[];
};

type OrderActions = {
  fetchBuyerOrders: () => Promise<void>;
  fetchSellerOrders: () => Promise<void>;
  placeOrder: (items?: CartItem[]) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  autoDeliverAfterConfirm: (orderId: string) => void;
  markOrderConfirmed: (orderId: string) => void;
  hardReset: () => void;
};

const hasToken = () =>
  typeof window !== "undefined" && Boolean(localStorage.getItem("qs-token"));

const normalizeOrderItem = (item: any) => {
  const normalizedProduct = typeof item.product === "object" ? normalizeProduct(item.product) : undefined;
  return {
    ...item,
    product: normalizedProduct ?? item.product,
    productId:
      typeof item.product === "string"
        ? item.product
        : normalizedProduct?._id ?? normalizedProduct?.id ?? "",
    qty: item.quantity ?? item.qty ?? 1,
    quantity: item.quantity ?? item.qty ?? 1,
  };
};

const normalizeOrders = (rawOrders: any[]): Order[] => {
  const products: Product[] = [];
  const normalizedOrders: Order[] = (rawOrders ?? []).map((o: any) => {
    const items = (o.items ?? []).map((item: any) => {
      const normalizedItem = normalizeOrderItem(item);
      if (normalizedItem.product && typeof normalizedItem.product === "object") {
        products.push(normalizedItem.product as Product);
      }
      return normalizedItem;
    });
    return {
      ...o,
      _id: o._id ?? o.id ?? "",
      id: o._id ?? o.id ?? "",
      storeId: (o.store ?? o.storeId ?? "") as string,
      buyerEmail: o.buyerEmail ?? o?.buyer?.email ?? "",
      buyerName: o.buyerName ?? o?.buyer?.name ?? "",
      items,
    } as Order;
  });

  if (products.length) {
    useProductStore.getState().upsertProducts(products);
  }
  return normalizedOrders;
};

export const useOrderStore = create<OrderState & OrderActions>((set) => ({
  orders: [],
  ordersLoading: false,
  confirmedOrderIds: [],

  hardReset: () => set({ orders: [], confirmedOrderIds: [] }),

  fetchBuyerOrders: async () => {
    if (!hasToken()) return;
    set({ ordersLoading: true });
    try {
      const res = await apiGetBuyerOrders();
      const normalized = normalizeOrders(res.data ?? []);
      set({ orders: normalized, ordersLoading: false });
    } catch {
      set({ ordersLoading: false });
    }
  },

  fetchSellerOrders: async () => {
    if (!hasToken()) return;
    set({ ordersLoading: true });
    try {
      const res = await apiGetSellerOrders();
      const normalized = normalizeOrders(res.data ?? []);
      set({ orders: normalized, ordersLoading: false });
    } catch {
      set({ ordersLoading: false });
    }
  },

  placeOrder: async (items) => {
    const cartStore = useCartStore.getState();
    const productStore = useProductStore.getState();
    const cartItems =
      items ??
      Object.entries(cartStore.cart).map(([productId, qty]) => {
        const product = productStore.productsMap[productId];
        return {
          product: product ?? productId,
          productId,
          quantity: qty,
          qty,
        };
      });
    if (!cartItems.length) return null;
    const payload = cartItems.map((item) => ({
      productId:
        typeof item.product === "string"
          ? item.product
          : (item.product as Product)._id ?? (item.product as Product).id,
      quantity: item.quantity ?? item.qty ?? 1,
    }));
    const res = await apiPlaceOrder(payload);
    await cartStore.clearCart();
    await useOrderStore.getState().fetchBuyerOrders();
    return res.data?._id ?? null;
  },

  updateOrderStatus: async (orderId, status) => {
    if (!hasToken()) return;
    await apiUpdateOrderStatus(orderId, status);
    await Promise.allSettled([
      useOrderStore.getState().fetchSellerOrders(),
      useOrderStore.getState().fetchBuyerOrders(),
    ]);
  },

  autoDeliverAfterConfirm: (orderId) => {
    useOrderStore.getState().markOrderConfirmed(orderId);
    if (!hasToken()) return;
    setTimeout(() => {
      void useOrderStore.getState().updateOrderStatus(orderId, "Delivered");
    }, 5 * 60 * 1000);
  },

  markOrderConfirmed: (orderId) =>
    set((state) => ({
      confirmedOrderIds: state.confirmedOrderIds.includes(orderId)
        ? state.confirmedOrderIds
        : [...state.confirmedOrderIds, orderId],
    })),
}));
