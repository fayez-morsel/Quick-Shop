import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useProductStore, useUIStore } from "../store";

export default function ProductsGrid() {
  const productsMap = useProductStore((s) => s.productsMap);
  const productIds = useProductStore((s) => s.productIds);
  const filters = useUIStore((s) => s.filters);

  const filtered = useMemo(() => {
    const { query, store, minPrice, maxPrice, discountedOnly, sortBy } = filters;
    let list = productIds
      .map((id) => productsMap[id])
      .filter(Boolean);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.storeName ?? "").toLowerCase().includes(q)
      );
    }

    if (store !== "all") list = list.filter((p) => (p.store ?? "") === store || (p as any).storeId === store);
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (discountedOnly) list = list.filter((p) => p.discounted);

    if (sortBy === "priceLow") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [productIds, productsMap, filters]);

  if (filtered.length === 0)
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-300">
        No products found.
      </div>
    );

  return (
    <div
      className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      data-testid="product-list"
    >
      {filtered.map((p) => (
        <ProductCard key={p.id} productId={p.id} />
      ))}
    </div>
  );
}
