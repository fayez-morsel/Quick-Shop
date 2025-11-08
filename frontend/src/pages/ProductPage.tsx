import { useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { useStore } from "../store/useStore";
import type { Category, Brand } from "../types";

export default function ProductPage() {
  const products = useStore((s) => s.products);
  const filters = useStore((s) => s.filters);
  const setQuery = useStore((s) => s.setQuery);
  const setSort = useStore((s) => s.setSort);
  const setDiscounted = useStore((s) => s.setDiscounted);
  const setCategory = useStore((s) => s.setCategory);
  const setBrand = useStore((s) => s.setBrand);
  const clearFilters = useStore((s) => s.clearFilters);

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.query)
      list = list.filter((p) =>
        p.title.toLowerCase().includes(filters.query.toLowerCase())
      );

    if (filters.category !== "all")
      list = list.filter((p) => p.category === filters.category);

    if (filters.brand !== "all")
      list = list.filter((p) => p.storeName === filters.brand);

    if (filters.discountedOnly)
      list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);

    if (filters.sortBy === "priceLow") list.sort((a, b) => a.price - b.price);
    if (filters.sortBy === "priceHigh") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, filters]);
}
