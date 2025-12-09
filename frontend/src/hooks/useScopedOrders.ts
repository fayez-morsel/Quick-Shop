import { useMemo } from "react";
import { useAuthStore, useOrderStore } from "../store";
import { filterOrdersForScope } from "../utils/orderFilters";

export function useScopedOrders() {
  const orders = useOrderStore((state) => state.orders);
  const userRole = useAuthStore((state) => state.userRole);
  const userEmail = useAuthStore((state) => state.userEmail);
  const userStoreId = useAuthStore((state) => state.userStoreId);

  const scopedOrders = useMemo(
    () => {
      return filterOrdersForScope(orders, userRole, userEmail, userStoreId);
    },
    [orders, userRole, userEmail, userStoreId]
  );

  return { scopedOrders, userRole };
}
