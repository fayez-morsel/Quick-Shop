import { ChartLine, Package, Search, ShoppingBag, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SellerLayout from "../components/SellerLayout";
import { useScopedOrders } from "../hooks/useScopedOrders";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";
import type { Order, OrderStatus, Product } from "../types";
import { useEffect } from "react";

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-sky-100 text-sky-700",
  Dispatched: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  "Delivery Unsuccessful": "bg-rose-100 text-rose-600",
  Canceled: "bg-rose-100 text-rose-600",
};

const fallbackMonthlySales = [
  18200, 19540, 21120, 19880, 22310, 23760, 25100, 24090, 22840, 21260, 19510, 18970,
];

const fallbackLineTrend = [10, 12, 14, 13, 15, 17, 19, 18, 17, 16, 14, 13];

const fallbackProducts: Product[] = [
  {
    _id: "demo-headphones",
    id: "demo-headphones",
    title: "Demo Headphones",
    price: 200,
    store: "demo",
    storeId: "demo",
    storeName: "Demo Store",
    category: "Tech",
    stock: 10,
    inStock: true,
    image: "/assets/products/headphones.png",
  },
  {
    _id: "demo-smartwatch",
    id: "demo-smartwatch",
    title: "Demo Smartwatch",
    price: 240,
    store: "demo",
    storeId: "demo",
    storeName: "Demo Store",
    category: "Tech",
    stock: 8,
    inStock: true,
    image: "/assets/products/smartwatch.png",
  },
  {
    _id: "demo-keyboard",
    id: "demo-keyboard",
    title: "Demo Keyboard",
    price: 99,
    store: "demo",
    storeId: "demo",
    storeName: "Demo Store",
    category: "Tech",
    stock: 12,
    inStock: true,
    image: "/assets/products/keyboard.png",
  },
  {
    _id: "demo-mouse",
    id: "demo-mouse",
    title: "Demo Mouse",
    price: 65,
    store: "demo",
    storeId: "demo",
    storeName: "Demo Store",
    category: "Tech",
    stock: 20,
    inStock: true,
    image: "/assets/products/mouse.png",
  },
];

const bestSellerFallbacks = [
  {
    product: fallbackProducts[0],
    sales: 182,
    revenue: 36400,
  },
  {
    product: fallbackProducts[1],
    sales: 127,
    revenue: 30480,
  },
  {
    product: fallbackProducts[2],
    sales: 98,
    revenue: 9702,
  },
  {
    product: fallbackProducts[3],
    sales: 75,
    revenue: 4875,
  },
];

const fallbackOrders: Order[] = [
  {
    _id: "demo-o1",
    id: "demo-o1",
    buyerName: "Avery Lane",
    buyerEmail: "avery@example.com",
    store: "demo",
    storeId: "demo",
    items: [{ productId: "demo-headphones", product: fallbackProducts[0], qty: 100, quantity: 100, price: fallbackProducts[0].price }],
    total: 20000,
    status: "Delivered",
    placedAt: "2025-11-01T09:24:00.000Z",
    expectedDelivery: "2025-11-05T12:00:00.000Z",
  },
  {
    _id: "demo-o2",
    id: "demo-o2",
    buyerName: "Benny Cole",
    buyerEmail: "benny@example.com",
    store: "demo",
    storeId: "demo",
    items: [
      { productId: "demo-smartwatch", product: fallbackProducts[1], qty: 1, quantity: 1, price: fallbackProducts[1].price },
      { productId: "demo-mouse", product: fallbackProducts[3], qty: 1, quantity: 1, price: fallbackProducts[3].price },
    ],
    total: 305,
    status: "Shipped",
    placedAt: "2025-11-08T14:05:00.000Z",
    expectedDelivery: "2025-11-14T15:00:00.000Z",
  },
  {
    _id: "demo-o3",
    id: "demo-o3",
    buyerName: "Lena Brooks",
    buyerEmail: "lena@example.com",
    store: "demo",
    storeId: "demo",
    items: [{ productId: "demo-keyboard", product: fallbackProducts[2], qty: 3, quantity: 3, price: fallbackProducts[2].price }],
    total: 297,
    status: "Processing",
    placedAt: "2025-11-12T10:30:00.000Z",
    expectedDelivery: "2025-11-18T08:00:00.000Z",
  },
];

const chartPeriods = (() => {
  const today = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (11 - index), 1);
    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
    };
  });
})();

type EnhancedOrder = Order & {
  productNames: string;
};

export default function SellerDashboard() {
  const products = useStore((state) => state.products);
  const fetchSellerOrders = useStore((s) => s.fetchSellerOrders);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const userRole = useStore((s) => s.userRole);

  useEffect(() => {
    if (isAuthenticated && userRole === "seller") {
      fetchSellerOrders();
    }
  }, [fetchSellerOrders, isAuthenticated, userRole]);
  const { scopedOrders } = useScopedOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const effectiveProducts = products.length ? products : fallbackProducts;
  const effectiveOrders = scopedOrders.length ? scopedOrders : fallbackOrders;

  const productLookup = useMemo(
    () => Object.fromEntries(effectiveProducts.map((product) => [product.id, product])),
    [effectiveProducts]
  );

  const enhancedOrders = useMemo(
    () =>
      effectiveOrders.map((order) => ({
        ...order,
        productNames: order.items
          .map((item) => {
            const pid = item.productId ?? (typeof item.product === "object" ? item.product.id : "");
            return productLookup[pid]?.title ?? pid;
          })
          .join(", "),
      })),
    [effectiveOrders, productLookup]
  );

  const dashboardData = useMemo(() => {
    const map = new Map<string, { product: Product; revenue: number; sales: number }>();
    effectiveProducts.forEach((product) => {
      map.set(product.id, { product, revenue: 0, sales: 0 });
    });

    let totalRevenue = 0;
    const customerEmails = new Set<string>();

    effectiveOrders.forEach((order) => {
      customerEmails.add((order.buyerEmail ?? "").toLowerCase());
      totalRevenue += order.total;
      order.items.forEach((item) => {
        const pid = item.productId ?? (typeof item.product === "object" ? item.product.id : "");
        const entry = map.get(pid);
        if (!entry) return;
        const qty = item.qty ?? item.quantity ?? 0;
        entry.sales += qty;
        entry.revenue += entry.product.price * qty;
      });
    });

    const monthlyPerformance = chartPeriods.map(({ label, monthIndex, year }, index) => {
      const monthlyTotal = effectiveOrders.reduce((sum, order) => {
        const orderDate = new Date(order.placedAt);
        return orderDate.getFullYear() === year && orderDate.getMonth() === monthIndex
          ? sum + order.total
          : sum;
      }, 0);
      const monthlyOrders = effectiveOrders.reduce((count, order) => {
        const orderDate = new Date(order.placedAt);
        return orderDate.getFullYear() === year && orderDate.getMonth() === monthIndex
          ? count + 1
          : count;
      }, 0);
      const fallbackValue = fallbackMonthlySales[index % fallbackMonthlySales.length];
      const fallbackTrend = fallbackLineTrend[index % fallbackLineTrend.length];
      return {
        month: label,
        bar: Math.max(monthlyTotal, fallbackValue),
        line: Math.max(monthlyOrders, fallbackTrend),
      };
    });

    const sortedTopProducts = Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
    const hasRevenue = sortedTopProducts.some((entry) => entry.revenue > 0);

    return {
      totalRevenue,
      totalOrders: effectiveOrders.length,
      uniqueCustomers: customerEmails.size,
      topProducts: hasRevenue ? sortedTopProducts : bestSellerFallbacks,
      monthlyPerformance,
    };
  }, [effectiveOrders, effectiveProducts]);

  const { totalRevenue, totalOrders, uniqueCustomers, topProducts, monthlyPerformance } = dashboardData;
  const totalProducts = effectiveProducts.length;

  const customerProfiles = useMemo(() => {
    const map = new Map<string, { name: string; email: string; orders: number; lifetimeValue: number }>();
    effectiveOrders.forEach((order) => {
      const key = (order.buyerEmail ?? "").toLowerCase();
      const current =
        map.get(key) ?? {
          name: order.buyerName ?? "",
          email: order.buyerEmail ?? "",
          orders: 0,
          lifetimeValue: 0,
        };
      current.orders += 1;
      current.lifetimeValue += order.total;
      map.set(key, current);
    });
    return Array.from(map.values());
  }, [effectiveOrders]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return { products: [], orders: [], customers: [] };
    }

    const matchesProduct = (product: Product) =>
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.category?.toLowerCase().includes(normalizedQuery) ||
      (product.storeName ?? "").toLowerCase().includes(normalizedQuery);

    const matchesOrder = (order: EnhancedOrder) =>
      order.id.toLowerCase().includes(normalizedQuery) ||
      (order.buyerName ?? "").toLowerCase().includes(normalizedQuery) ||
      order.productNames.toLowerCase().includes(normalizedQuery) ||
      order.status.toLowerCase().includes(normalizedQuery);

    const matchesCustomer = (customer: (typeof customerProfiles)[number]) =>
      (customer.name ?? "").toLowerCase().includes(normalizedQuery) ||
      (customer.email ?? "").toLowerCase().includes(normalizedQuery);

    return {
      products: effectiveProducts.filter(matchesProduct).slice(0, 4),
      orders: enhancedOrders.filter(matchesOrder).slice(0, 4),
      customers: customerProfiles.filter(matchesCustomer).slice(0, 4),
    };
  }, [normalizedQuery, effectiveProducts, enhancedOrders, customerProfiles]);

  const showSearchResults = normalizedQuery.length > 0;
  const totalMatches =
    searchResults.products.length +
    searchResults.orders.length +
    searchResults.customers.length;
  const referenceRevenue = Math.max(topProducts[0]?.revenue ?? 1, 1);

  const formatNumber = (value: number) =>
    value.toLocaleString("en-US", { maximumFractionDigits: 0 });

  const metricCards = [
    {
      label: "Total Revenue",
      value: money(totalRevenue),
      change: "+20.1% vs last month",
      icon: ChartLine,
      iconClass: "text-[#1d4ed8]",
    },
    {
      label: "Total Orders",
      value: formatNumber(totalOrders),
      change: "+12.5% vs last month",
      icon: ShoppingBag,
      iconClass: "text-[#0ea5e9]",
    },
    {
      label: "Total Products",
      value: formatNumber(totalProducts),
      change: "+8.2% vs last month",
      icon: Package,
      iconClass: "text-[#f59e0b]",
    },
    {
      label: "Total Customers",
      value: formatNumber(uniqueCustomers),
      change: "+15.3% vs last month",
      icon: Users,
      iconClass: "text-[#0ea5e9]",
    },
  ];

  const displayQuery = searchQuery.trim();

  return (
    <SellerLayout activeLink="Dashboard">
      <header>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            className="ml-3 flex-1 border-none bg-transparent text-sm text-slate-600 focus:outline-none"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </header>

      <section className="mt-8 space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Welcome back, John! Here's what's happening with your store today.
        </p>
      </section>

      {showSearchResults && (
        <section className="mt-6 rounded-4xl bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Search results
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">"{displayQuery}"</h2>
            </div>
            <p className="text-sm text-slate-500">
              {totalMatches} match{totalMatches === 1 ? "" : "es"} found
            </p>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Products ({searchResults.products.length})
              </p>
              <div className="mt-4 space-y-3">
                {searchResults.products.length === 0 ? (
                  <p className="text-sm text-slate-400">No products match that query.</p>
                ) : (
                  searchResults.products.map((product) => (
                    <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="font-semibold text-slate-900">{product.title}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {product.category ?? "General"}
                      </p>
                      <p className="text-sm text-slate-500">{product.storeName}</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {money(product.price)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Orders ({searchResults.orders.length})
              </p>
              <div className="mt-4 space-y-3">
                {searchResults.orders.length === 0 ? (
                  <p className="text-sm text-slate-400">No orders match that query.</p>
                ) : (
                  searchResults.orders.map((order) => (
                  <div key={`${order.id}-card`} className="rounded-2xl border border-slate-200 bg-white p-3">
                      <p className="font-semibold text-slate-900">#{order.id.toUpperCase()}</p>
                      <p className="text-sm text-slate-500">{order.buyerName}</p>
                      <p className="text-sm text-slate-500">{order.productNames}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{money(order.total)}</p>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                            statusStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Customers ({searchResults.customers.length})
              </p>
              <div className="mt-4 space-y-3">
                {searchResults.customers.length === 0 ? (
                  <p className="text-sm text-slate-400">No customers match that query.</p>
                ) : (
                  searchResults.customers.map((customer) => (
                    <div key={customer.email} className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
                      <p className="font-semibold text-slate-900">{customer.name}</p>
                      <p className="text-sm text-slate-500">{customer.email}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {customer.orders} orders · {money(customer.lifetimeValue)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className="rounded-3xl bg-white p-5 shadow-[0_25px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                  <Icon className={`h-5 w-5 ${metric.iconClass}`} />
                </div>
              </div>
              <p className="mt-6 text-3xl font-semibold text-slate-900">{metric.value}</p>
              <p className="text-xs font-semibold text-emerald-600">{metric.change}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
        <article className="rounded-4xl bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">Sales overview</p>
              <h2 className="text-2xl font-semibold text-slate-900">Monthly performance</h2>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              2025
            </div>
          </div>
          <div className="mt-6 overflow-x-auto -mx-4 sm:mx-0">
            <div className="w-full min-w-[320px] sm:min-w-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f9ff] px-3 py-4 sm:p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyPerformance}
                  margin={{ top: 10, right: 16, left: 8, bottom: 0 }}
                  barCategoryGap={20}
                  style={{ cursor: "pointer" }}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4fa3f5" />
                      <stop offset="100%" stopColor="#1b75d0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(value: number) =>
                      value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`
                    }
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(value: number) => `${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(79, 163, 245, 0.08)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 18px 35px rgba(15,23,42,0.12)",
                      padding: "10px 12px",
                    }}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString("en-US"),
                      name === "bar" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="bar"
                    radius={[12, 12, 8, 8]}
                    fill="url(#barGradient)"
                    maxBarSize={36}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="line"
                    stroke="#0f172a"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    dot={{ r: 4, strokeWidth: 2, stroke: "#f7f9ff", fill: "#0f172a" }}
                    activeDot={{ r: 6, strokeWidth: 0, cursor: "pointer" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="rounded-4xl bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">Top products</p>
              <h2 className="text-2xl font-semibold text-slate-900">Best sellers</h2>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto -mx-4 sm:mx-0">
            <div className="w-full min-w-[320px] sm:min-w-[420px] space-y-5 px-3 sm:px-0">
              {topProducts.map((entry) => {
                const progress = Math.min(Math.round((entry.revenue / referenceRevenue) * 100), 100);
                return (
                  <div key={entry.product.id}>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{entry.product.title}</p>
                        <p className="text-xs text-slate-500">{entry.sales} sales</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">{money(entry.revenue)}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-blue-600 to-sky-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </article>
      </section>

    </SellerLayout>
  );
}
