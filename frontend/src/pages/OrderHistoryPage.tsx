import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { money } from "../utils/format";
import { useScopedOrders } from "../hooks/useScopedOrders";
import type { OrderStatus } from "../types";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Processing: "bg-sky-50 text-sky-700 border border-sky-100",
  Dispatched: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Shipped: "bg-purple-50 text-purple-700 border border-purple-100",
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  "Delivery Unsuccessful": "bg-rose-50 text-rose-600 border border-rose-100",
  Canceled: "bg-rose-50 text-rose-600 border border-rose-100",
};

const formatOrderId = (id: string) => {
  const numeric = id.replace(/\D/g, "");
  return numeric ? `#ORD-${numeric.padStart(4, "0")}` : `#${id.toUpperCase()}`;
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();

export default function OrderHistoryPage() {
  const { scopedOrders } = useScopedOrders();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const orderSummary = useMemo(() => {
    const totalSpent = scopedOrders.reduce((sum, order) => sum + order.total, 0);
    const uniqueStores = new Set(scopedOrders.map((order) => order.storeId)).size;
    const avgOrder = scopedOrders.length ? totalSpent / scopedOrders.length : 0;
    return {
      totalSpent,
      uniqueStores,
      avgOrder,
    };
  }, [scopedOrders]);

  const filteredOrders = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return scopedOrders
      .slice()
      .sort(
        (a, b) =>
          new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
      )
      .filter((order) => {
        if (!normalized) return true;
        return (
          order.id.toLowerCase().includes(normalized) ||
          order.buyerEmail.toLowerCase().includes(normalized) ||
          order.storeId.toLowerCase().includes(normalized)
        );
      });
  }, [scopedOrders, search]);

  const metrics = [
    { label: "Total Orders", value: scopedOrders.length.toString() },
    {
      label: "Total Spent",
      value: money(orderSummary.totalSpent),
    },
    {
      label: "Avg. Order Value",
      value: money(orderSummary.avgOrder),
    },
    { label: "Stores Shopped", value: orderSummary.uniqueStores.toString() },
  ];

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
      <section className="space-y-3">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Order history
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">My orders</h1>
          <p className="text-sm text-slate-500">
            Track every purchase, delivery status, and spend without leaving
            the dashboard.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm md:flex-row md:items-center">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order id, store, email..."
            className="w-full border-none bg-transparent text-sm text-slate-600 focus:outline-none md:px-2"
          />
        </div>
      </section>

    </div>
  );
}
