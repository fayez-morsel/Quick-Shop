import { useMemo } from "react";
import { useStore } from "../store/useStore";
import { filterOrdersForScope } from "../utils/orderFilters";

export function useScopedOrders() {
  const orders = useStore((state) => state.orders);
  const userRole = useStore((state) => state.userRole);
  const userEmail = useStore((state) => state.userEmail);
  const userStoreId = useStore((state) => state.userStoreId);

  const scopedOrders = useMemo(
    () => {
      return filterOrdersForScope(orders, userRole, userEmail, userStoreId);
    },
    [orders, userRole, userEmail, userStoreId]
  );

  return { scopedOrders, userRole };
}
