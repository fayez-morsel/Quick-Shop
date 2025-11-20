import { Search } from "lucide-react";
import { useMemo } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";

const chartPeriods = (() => {
  const today = new Date();
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (11 - index), 1);
    const label = date.toLocaleDateString("en-US", { month: "short" });
    return {
      label,
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
    };
  });
})();

const chartGridLines = [0.25, 0.5, 0.75];

const categoryColors = ["#2563eb", "#38bdf8", "#f59e0b", "#93c5fd", "#f472b6"];

export default function SellerAnalyticsPage() {
  const orders = useStore((state) => state.orders);
  const products = useStore((state) => state.products);

  const productLookup = useMemo(() => {
    return Object.fromEntries(products.map((product) => [product.id, product]));
  }, [products]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map((order) => order.buyerEmail)).size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueByCategory = useMemo(() => {
    const totals: Record<string, number> = {};
    orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = productLookup[item.productId];
      const category = product?.category ?? "General";
      const price = product?.price ?? 0;
      totals[category] = (totals[category] ?? 0) + price * item.qty;
    });
    });
    const entries = Object.entries(totals).map(([category, revenue]) => ({
      category,
      revenue,
    }));
    const overall = entries.reduce((sum, entry) => sum + entry.revenue, 0);
    return entries
      .sort((a, b) => b.revenue - a.revenue)
      .map((entry) => ({
        category: entry.category,
        revenue: entry.revenue,
        percent: overall ? (entry.revenue / overall) * 100 : 0,
      }));
  }, [orders, productLookup]);

  const monthlyRevenue = chartPeriods.map(({ label, monthIndex, year }) => {
    const value = orders.reduce((sum, order) => {
      const date = new Date(order.placedAt);
      return date.getFullYear() === year && date.getMonth() === monthIndex
        ? sum + order.total
        : sum;
    }, 0);
    return { label, value };
  });

  const monthlyOrders = chartPeriods.map(({ label, monthIndex, year }) => {
    const value = orders.reduce((sum, order) => {
      const date = new Date(order.placedAt);
      return date.getFullYear() === year && date.getMonth() === monthIndex
        ? sum + 1
        : sum;
    }, 0);
    return { label, value };
  });

  const customerGrowth = chartPeriods.map(({ label, monthIndex, year }) => {
    const emails = new Set<string>();
    orders.forEach((order) => {
      const date = new Date(order.placedAt);
      if (date.getFullYear() === year && date.getMonth() === monthIndex) {
        emails.add(order.buyerEmail);
      }
    });
    return { label, value: emails.size };
  });

  const chartWidth = 360;
  const chartHeight = 180;

  const linePath = (data: { value: number }[]) => {
    const max = Math.max(...data.map((item) => item.value), 1);
    return data
      .map(({ value }, index) => {
        const step = data.length === 1 ? 0 : index / (data.length - 1);
        const x = chartWidth * step;
        const y = chartHeight - (value / max) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const revenuePath = linePath(monthlyRevenue);
  const customerPath = linePath(customerGrowth);
  const barMax = Math.max(...monthlyOrders.map((entry) => entry.value), 1);

  const metricCards = [
    {
      label: "Total Revenue",
      value: money(totalRevenue),
      change: "+24.5% vs last month",
      icon: "$",
      iconClass: "text-[#1d4ed8]",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-US"),
      change: "+18.2% vs last month",
      icon: "🛒",
    },
    {
      label: "Total Customers",
      value: uniqueCustomers.toLocaleString("en-US"),
      change: "+15.8% vs last month",
      icon: "👥",
    },
    {
      label: "Avg. Order Value",
      value: money(avgOrderValue),
      change: "-3.2% vs last month",
      icon: "📦",
    },
  ];

  const pieGradient = revenueByCategory
    .map((entry, index) => {
      const angle = entry.percent;
      const start = revenueByCategory
        .slice(0, index)
        .reduce((sum, prev) => sum + prev.percent, 0);
      const end = start + angle;
      const color = categoryColors[index % categoryColors.length];
      return `${color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <SellerSidebar activeLink="Analytics" />
      <main className="flex-1 px-6 py-8 pl-12 lg:pl-16 ml-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">Analytics</h1>
                <p className="text-sm text-slate-500">
                  Comprehensive insights into your business performance
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  disabled
                  placeholder="Search products, orders, customers..."
                  className="w-full border-none bg-transparent text-sm text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((card) => (
              <article
                key={card.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {card.label}
                  </p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                    <span className="text-lg">{card.icon}</span>
                  </div>
                </div>
                <p className="mt-6 text-3xl font-semibold text-slate-900">{card.value}</p>
                <p className="text-xs font-semibold text-emerald-600">{card.change}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                    Revenue Trend
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">Monthly revenue</h2>
                </div>
                <div className="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
                  2025
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f9ff] p-4">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-52 w-full">
                  {chartGridLines.map((line) => (
                    <line
                      key={line}
                      x1={0}
                      x2={chartWidth}
                      y1={chartHeight - line * chartHeight}
                      y2={chartHeight - line * chartHeight}
                      className="stroke-slate-200"
                    />
                  ))}
                  <polyline
                    points={revenuePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {monthlyRevenue.map((point, index) => {
                    const step = monthlyRevenue.length === 1 ? 0 : index / (monthlyRevenue.length - 1);
                    const x = chartWidth * step;
                    const y = chartHeight - (point.value / Math.max(...monthlyRevenue.map((entry) => entry.value), 1)) * chartHeight;
                    return (
                      <circle
                        key={point.label}
                        cx={x}
                        cy={y}
                        r={4}
                        className="fill-white stroke-[#2563eb]"
                        strokeWidth={2}
                      />
                    );
                  })}
                </svg>
              </div>
            </article>

            <article className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                  Orders Trend
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">Monthly orders</h2>
              </div>
              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f9ff] p-4">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-52 w-full">
                  {chartGridLines.map((line) => (
                    <line
                      key={line}
                      x1={0}
                      x2={chartWidth}
                      y1={chartHeight - line * chartHeight}
                      y2={chartHeight - line * chartHeight}
                      className="stroke-slate-200"
                    />
                  ))}
                  {monthlyOrders.map((point, index) => {
                    const barWidth = chartWidth / monthlyOrders.length;
                    const value = point.value;
                    const barHeight = (value / barMax) * chartHeight;
                    return (
                      <rect
                        key={point.label}
                        x={index * barWidth + 4}
                        y={chartHeight - barHeight}
                        width={barWidth - 8}
                        height={barHeight}
                        fill="#60a5fa"
                        rx={4}
                      />
                    );
                  })}
                </svg>
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Sales by Category
              </p>
              <div className="mt-6 flex flex-col gap-6 md:flex-row">
                <div
                  className="h-64 w-64 rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6"
                  style={{
                    background: `conic-gradient(${pieGradient})`,
                  }}
                ></div>
                <div className="flex flex-1 flex-col gap-4">
                  {revenueByCategory.map((entry, index) => (
                    <div key={entry.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                        />
                        <p className="text-sm font-semibold text-slate-900">{entry.category}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-semibold text-slate-900">
                          {money(entry.revenue)}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                          {entry.percent.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Customer Growth
              </p>
              <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f9ff] p-4">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-52 w-full">
                  {chartGridLines.map((line) => (
                    <line
                      key={line}
                      x1={0}
                      x2={chartWidth}
                      y1={chartHeight - line * chartHeight}
                      y2={chartHeight - line * chartHeight}
                      className="stroke-slate-200"
                    />
                  ))}
                  <polyline
                    points={customerPath}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {customerGrowth.map((point, index) => {
                    const step = customerGrowth.length === 1 ? 0 : index / (customerGrowth.length - 1);
                    const x = chartWidth * step;
                    const max = Math.max(...customerGrowth.map((entry) => entry.value), 1);
                    const y = chartHeight - (point.value / max) * chartHeight;
                    return (
                      <circle
                        key={point.label}
                        cx={x}
                        cy={y}
                        r={4}
                        className="fill-white stroke-[#38bdf8]"
                        strokeWidth={2}
                      />
                    );
                  })}
                </svg>
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
