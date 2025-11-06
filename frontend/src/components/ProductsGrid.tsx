import { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useProducts, useFilters } from "../store/useStore";

export default function ProductsGrid() {
  const products = useProducts();
  const filters = useFilters();

  const filtered = useMemo(() => {
    const { query, store, minPrice, maxPrice, discountedOnly, sortBy } = filters;
    let list = products;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q)
      );
    }

    if (store !== "all") list = list.filter((p) => p.storeId === store);
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (discountedOnly)
      list = list.filter(
        (p) => p.compareAtPrice && p.compareAtPrice > p.price
      );

    if (sortBy === "priceLow") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [products, filters]);

  if (filtered.length === 0)
    return (
      <div className="text-center text-gray-500 py-20">
        No products found.
      </div>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
