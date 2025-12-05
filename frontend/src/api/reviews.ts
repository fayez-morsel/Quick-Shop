import { http } from "./http";

export const apiGetReviews = (productId: string) =>
  http.get(`/reviews/${productId}`);

export const apiAddReview = (
  productId: string,
  orderId: string,
  rating: number,
  comment: string
) => http.post("/reviews", { productId, orderId, rating, comment });
