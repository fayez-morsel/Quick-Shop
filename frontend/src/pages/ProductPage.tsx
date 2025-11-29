import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../store/useStore";
import type { Category, Brand, FilterState } from "../types";

const iconButtonBase =
  "rounded-full border border-white/30 bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

const brandOptions: Brand[] = [
  "Tech Hub",
  "KeyZone",
  "SoundWave",
  "DataHub",
  "ErgoWorks",
  "HomeLight",
];

export default function ProductPage() {
  const products = useStore((s) => s.products);
  const filters = useStore((s) => s.filters);
  const setCategory = useStore((s) => s.setCategory);
  const setBrand = useStore((s) => s.setBrand);
  const setSort = useStore((s) => s.setSort);
  const setDiscounted = useStore((s) => s.setDiscounted);
  const setQuery = useStore((s) => s.setQuery);
  const clearFilters = useStore((s) => s.clearFilters);
  const favorites = useStore((s) => s.favorites);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1100);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const setMaxPrice = (v: number) =>
    useStore.setState((s) => ({
      filters: { ...s.filters, maxPrice: v },
    }));

  const navigate = useNavigate();

  const categories = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.category).filter(Boolean))
      ) as Category[],
    [products]
  );

  const filtered = useMemo(() => {
    let list = [...products];

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (filters.category.length) {
      list = list.filter(
        (p) => p.category && filters.category.includes(p.category)
      );
    }

    if (filters.brand.length) {
      list = list.filter((p) => filters.brand.includes(p.storeName));
    }

    list = list.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    if (filters.discountedOnly) {
      list = list.filter((p) => p.discounted);
    }

    if (favoritesOnly) {
      list = list.filter((p) => favorites.includes(p.id));
    }

    if (filters.sortBy === "priceLow") {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "priceHigh") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, filters, favorites, favoritesOnly]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1100);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-base font-semibold text-slate-700">Category</p>
        <div className="space-y-2 text-sm text-slate-800">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.category.includes(category)}
                onChange={() => setCategory(category)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300"
              />
              <span className="capitalize">{category.toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-base font-semibold text-slate-700">Brand</p>
        <div className="space-y-2 text-sm text-slate-800">
          {brandOptions.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={() => setBrand(brand)}
                className="h-4 w-4 cursor-pointer rounded border-slate-300"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-base font-semibold text-slate-700">Price range</p>
        <input
          type="range"
          min={0}
          max={500}
          value={filters.maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="mt-3 flex justify-between text-xs font-semibold text-slate-500">
          <span>${filters.minPrice}</span>
          <span>${filters.maxPrice}</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={filters.discountedOnly}
            onChange={(e) => setDiscounted(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Discount only
        </label>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Favorites only
        </label>
      </div>

      <div>
        <p className="mb-2 text-base font-semibold text-slate-700">Sort By</p>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setSort(e.target.value as FilterState["sortBy"])
            }
            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
          <option value="popular">Most Popular</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600"
        >
          Clear filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white px-4 pb-6 pt-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="sticky top-16 z-30 -mx-4 flex flex-col gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:rounded-none sm:px-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
            <p className="text-sm text-slate-500">{filtered.length} items found</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:w-[250px]"
            />
            {!isDesktop && (
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition shadow-sm"
              >
                Filters
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {isDesktop && (
            <aside className="self-start w-full max-w-xs shrink-0 rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
              {FiltersPanel}
            </aside>
          )}
          <div className="flex-1">
          <div className="grid gap-6 auto-rows-fr sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filtered.map((product) => (
              <div key={product.id} className="flex h-full">
                <ProductCard
                  product={product}
                  onSelect={() => navigate(`/product/${product.id}`)}
                />
              </div>
            ))}
          </div>
          </div>
        </div>

        {!isDesktop && menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            <aside className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 rounded-l-4xl bg-white px-6 py-8 text-slate-900 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className={iconButtonBase}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto pr-1 pb-3">
                {FiltersPanel}
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
