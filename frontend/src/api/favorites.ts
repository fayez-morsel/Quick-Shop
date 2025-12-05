import { http } from "./http";

export const apiGetFavorites = () => http.get("/favorites");

export const apiToggleFavorite = (productId: string) =>
  http.post(`/favorites/${productId}`);
