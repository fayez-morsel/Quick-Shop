import { http } from "./http";

export const apiPlaceOrder = (items: any[]) =>
  http.post("/orders", { items });

export const apiGetBuyerOrders = () =>
  http.get("/orders/buyer");

export const apiGetSellerOrders = () =>
  http.get("/orders/seller");

export const apiUpdateOrderStatus = (id: string, status: string) =>
  http.patch(`/orders/${id}/status`, { status });
