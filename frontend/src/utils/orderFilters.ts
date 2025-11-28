import type { Order, UserRole } from "../types";

export function filterOrdersForScope(
  orders: Order[],
  role: UserRole,
  userEmail: string,
  sellerStoreId: string
) {
  if (role === "seller") {
    if (!sellerStoreId) {
      return [];
    }
    return orders.filter((order) => order.storeId === sellerStoreId);
  }

  if (!userEmail) {
    return [];
  }

  return orders.filter((order) => order.buyerEmail === userEmail);
}
