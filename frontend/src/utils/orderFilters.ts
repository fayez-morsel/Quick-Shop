import type { Order, UserRole } from "../types";

export function filterOrdersForScope(
  orders: Order[],
  role: UserRole,
  userEmail: string,
  sellerStoreId: string
) {
  if (role === "buyer") {
    if (!userEmail) return [];
    const normalized = userEmail.toLowerCase();
    return orders.filter(
      (o) =>
        ((o.buyerEmail ?? userEmail) as string).toLowerCase() === normalized
    );
  }

  if (role === "seller") {
    const store =
      sellerStoreId ||
      (orders[0]?.storeId ?? orders[0]?.store ?? "")?.toString?.() ||
      "";
    if (!store) return orders;
    return orders.filter(
      (o) => (o.storeId ?? o.store ?? "").toString() === store.toString()
    );
  }

  return [];
}
