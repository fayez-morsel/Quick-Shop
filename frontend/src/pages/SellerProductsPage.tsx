import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SellerSidebar from "../components/SellerSidebar";
import { money } from "../utils/format";
import { useStore } from "../store/useStore";

type TableProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: "active" | "inactive";
};

const statusStyles: Record<TableProduct["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
};

const formatProductId = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  const padded = numeric.padStart(3, "0");
  return `PRD-${padded}`;
};

export default function SellerProductsPage() {
  const navigate = useNavigate();
  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);
  const [query, setQuery] = useState("");

  const tableProducts = useMemo(() => {
    const salesByProduct = orders.reduce<Record<string, number>>((acc, order) => {
      order.items.forEach((item) => {
        acc[item.productId] = (acc[item.productId] ?? 0) + item.qty;
      });
      return acc;
    }, {});

    return products.map<TableProduct>((product) => ({
      id: formatProductId(product.id),
      name: product.title,
      category: product.category ?? "General",
      price: product.price,
      stock: product.stock,
      sales: salesByProduct[product.id] ?? 0,
      status: product.stock > 0 ? "active" : "inactive",
    }));
  }, [orders, products]);

  const filteredProducts = tableProducts.filter((product) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return (
      product.name.toLowerCase().includes(normalized) ||
      product.category.toLowerCase().includes(normalized) ||
      product.id.toLowerCase().includes(normalized)
    );
  });

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <SellerSidebar activeLink="Products" />
      <main className="flex-1 px-6 py-8 pl-12 lg:pl-16 ml-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
              <p className="text-sm text-slate-500">Manage your product inventory</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/seller")}
              className="inline-flex items-center gap-2 rounded-3xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-[0_20px_35px_rgba(37,99,235,0.35)] transition hover:bg-[#1d4ed8]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </header>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                  Product List
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full border-none bg-transparent text-sm text-slate-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    <th className="px-3 py-3">Product ID</th>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Stock</th>
                    <th className="px-3 py-3">Sales</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-sm text-slate-400">
                        No products found
                      </td>
                    </tr>
                  )}
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t border-slate-100">
                      <td className="px-3 py-4 font-mono text-xs font-semibold text-slate-600">
                        {product.id}
                      </td>
                      <td className="px-3 py-4 font-semibold text-slate-900">{product.name}</td>
                      <td className="px-3 py-4 text-slate-500">{product.category}</td>
                      <td className="px-3 py-4 font-semibold text-slate-900">
                        {money(product.price)}
                      </td>
                      <td
                        className={`px-3 py-4 font-semibold ${
                          product.stock === 0 ? "text-rose-500" : "text-slate-700"
                        }`}
                      >
                        {product.stock}
                      </td>
                      <td className="px-3 py-4 font-semibold text-slate-900">
                        {product.sales}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] ${statusStyles[product.status]}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label="Edit product"
                            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete product"
                            className="rounded-full border border-slate-200 p-2 text-rose-500 transition hover:border-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
