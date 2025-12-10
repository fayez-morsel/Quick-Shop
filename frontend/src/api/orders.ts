import { http } from "./http";

export const apiPlaceOrder = (items: any[]) =>
  http.post("/orders", { items });

export const apiGetBuyerOrders = () =>
  http.get("/orders/buyer");

export const apiGetSellerOrders = () =>
  http.get("/orders/seller");

export const apiUpdateOrderStatus = (id: string, status: string) =>
  http.patch(`/orders/${id}/status`, { status });

export const apiConfirmOrder = (orderId: string, code: string) =>
  http.post("/orders/confirm", { orderId, code });
