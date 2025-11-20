import { Eye, Search } from "lucide-react";
import { useMemo, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";
import type { OrderStatus, Product } from "../types";

const statusBadgeStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Processing: "bg-sky-50 text-sky-700 border border-sky-100",
  Dispatched: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Shipped: "bg-purple-50 text-purple-700 border border-purple-100",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "Delivery Unsuccessful": "bg-rose-50 text-rose-600 border border-rose-100",
  Canceled: "bg-rose-50 text-rose-600 border border-rose-100",
};

type StatusCardKey = OrderStatus | "all";

const statusOverview: { label: string; key: StatusCardKey }[] = [
  { label: "All Orders", key: "all" },
  { label: "Pending", key: "Pending" },
  { label: "Processing", key: "Processing" },
  { label: "Shipped", key: "Shipped" },
  { label: "Delivered", key: "Delivered" },
];

const statusFilterOptions: StatusCardKey[] = [
  "all",
  "Pending",
  "Processing",
  "Dispatched",
  "Shipped",
  "Delivered",
  "Delivery Unsuccessful",
  "Canceled",
];

const formatOrderId = (id: string) => {
  const numeric = id.replace(/\D/g, "");
  if (!numeric) return `#ORD-${id.toUpperCase()}`;
  return `#ORD-${numeric.padStart(3, "0")}`;
};

export default function SellerOrdersPage() {
  const orders = useStore((state) => state.orders);
  const products = useStore((state) => state.products);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusCardKey>("all");

  const productLookup = useMemo<Record<string, Product>>(() => {
    return Object.fromEntries(products.map((product) => [product.id, product]));
  }, [products]);

  const orderRows = useMemo(() => {
    return orders.map((order) => {
      const productName =
        productLookup[order.items[0]?.productId ?? ""]?.title ?? "Product";
      const quantity = order.items.reduce((sum, item) => sum + item.qty, 0);
      return {
        ...order,
        quantity,
        productName,
      };
    });
  }, [orders, productLookup]);

  const statusCounts = useMemo<Record<OrderStatus, number>>(() => {
    const initial: Record<OrderStatus, number> = {
      Pending: 0,
      Processing: 0,
      Dispatched: 0,
      Shipped: 0,
      Delivered: 0,
      "Delivery Unsuccessful": 0,
      Canceled: 0,
    };
    orders.forEach((order) => {
      initial[order.status] = (initial[order.status] ?? 0) + 1;
    });
    return initial;
  }, [orders]);

  const filteredOrders = orderRows.filter((order) => {
    const normalized = search.trim().toLowerCase();
    const matchesSearch =
      !normalized ||
      order.id.toLowerCase().includes(normalized) ||
      order.buyerName.toLowerCase().includes(normalized) ||
      order.buyerEmail.toLowerCase().includes(normalized) ||
      order.productName.toLowerCase().includes(normalized);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <SellerSidebar activeLink="Orders" />
      <main className="flex-1 px-6 py-8 pl-12 lg:pl-16 ml-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Orders</h1>
              <p className="text-sm text-slate-500">
                Manage and track all your orders
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-3xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_20px_rgba(15,23,42,0.15)] transition hover:shadow-[0_25px_45px_rgba(15,23,42,0.2)]"
              >
                <Search className="h-4 w-4 text-slate-400" />
                Search orders...
              </button>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statusOverview.map((card) => (
              <article
                key={card.label}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {card.key === "all"
                    ? orders.length
                    : statusCounts[card.key] ?? 0}
                </p>
              </article>
            ))}
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                  Order List
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full border-none bg-transparent text-sm text-slate-600 focus:outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as StatusCardKey)
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="all">All Status</option>
                  {statusFilterOptions
                    .filter((status) => status !== "all")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    <th className="px-3 py-3">Order ID</th>
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Product</th>
                    <th className="px-3 py-3">Quantity</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Amount</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-sm text-slate-400">
                        No orders match this search
                      </td>
                    </tr>
                  )}
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-slate-100">
                      <td className="px-3 py-4 font-mono text-xs font-semibold text-slate-600">
                        {formatOrderId(order.id)}
                      </td>
                      <td className="px-3 py-4">
                        <p className="font-semibold text-slate-900">{order.buyerName}</p>
                        <p className="text-xs text-slate-500">{order.buyerEmail}</p>
                      </td>
                      <td className="px-3 py-4 text-slate-500">{order.productName}</td>
                      <td className="px-3 py-4 font-semibold text-slate-900">
                        {order.quantity}
                      </td>
                      <td className="px-3 py-4 text-slate-500">
                        {new Date(order.placedAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4 font-semibold text-slate-900">
                        {money(order.total)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] ${statusBadgeStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          aria-label="View order"
                          className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
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
