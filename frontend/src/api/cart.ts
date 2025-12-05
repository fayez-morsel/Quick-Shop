import { http } from "./http";

export const apiGetCart = () => http.get("/cart");

export const apiAddToCart = (productId: string, quantity = 1) =>
  http.post("/cart/add", { productId, quantity });

export const apiUpdateCart = (productId: string, quantity: number) =>
  http.patch("/cart/update", { productId, quantity });

export const apiRemoveCartItem = (productId: string) =>
  http.delete(`/cart/remove/${productId}`);
