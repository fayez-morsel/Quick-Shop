import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SellerSidebarLink = {
  label: string;
  icon: LucideIcon;
  path: string;
};

export const sellerSidebarLinks: SellerSidebarLink[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/seller" },
  { label: "Products", icon: Package, path: "/seller/products" },
  { label: "Orders", icon: ShoppingBag, path: "/seller/orders" },
];
