import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useStore } from "../store/useStore";

export default function ProductsGrid() {
  const products = useStore((s) => s.products);
  const filters = useStore((s) => s.filters);

  const filtered = useMemo(() => {
    const { query, store, minPrice, maxPrice, discountedOnly, sortBy } = filters;
    let list = products;

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
  }, [products, filters]);

  if (filtered.length === 0)
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-300">
        No products found.
      </div>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
