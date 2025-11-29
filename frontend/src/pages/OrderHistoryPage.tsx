import { ChevronDown, ChevronUp, Search } from "lucide-react";
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

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderHistoryPage() {
  const { scopedOrders } = useScopedOrders();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const products = useStore((s) => s.products);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
  useEffect(() => {
    if (expandedOrderId && !filteredOrders.find((o) => o.id === expandedOrderId)) {
      setExpandedOrderId(null);
    }
  }, [expandedOrderId, filteredOrders]);

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-slate-900">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Order history
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">My orders</h1>
          </div>
          <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm md:flex-row md:items-center">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order id, store, email..."
              className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none md:px-2"
            />
          </div>
        </section>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <p className="text-center text-sm font-semibold text-slate-500">
              No orders match this search term.
            </p>
          ) : (
            filteredOrders.map((order) => {
              const isOpen = expandedOrderId === order.id;
              const expandedMaxHeight = Math.max(200, order.items.length * 140);
              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition duration-300 ease-in-out"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOrderId(isOpen ? null : order.id)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <div className="flex flex-1 flex-col">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                        {formatOrderId(order.id)}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatDateTime(order.placedAt)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-base font-semibold text-sky-700">
                      {money(order.total)}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </button>

                  <div
                    className={`space-y-3 border-t border-slate-200 bg-slate-50 px-5 transition-all duration-300 ease-in-out ${
                      isOpen ? "opacity-100 py-4" : "opacity-0 py-0"
                    }`}
                    style={{
                      maxHeight: isOpen ? `${expandedMaxHeight}px` : "0px",
                      overflow: "hidden",
                    }}
                  >
                    {order.items.map((item) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      const image =
                        product?.images?.[0] || product?.image || "";
                      return (
                        <div
                          key={`${order.id}-${item.productId}`}
                          className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={product?.title ?? item.productId}
                              className="h-14 w-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                              IMG
                            </div>
                          )}
                          <div className="flex flex-1 flex-col">
                            <p className="text-sm font-semibold text-slate-900">
                              {product?.title ?? item.productId}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product?.category ?? "Item"} - Qty: {item.qty}
                            </p>
                          </div>
                          <div className="text-right text-sm font-semibold text-slate-800">
                            {product ? money(product.price * item.qty) : "--"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}



