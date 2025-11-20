import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import SellerSidebar from "../components/SellerSidebar";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";

const customerProfiles = [
  {
    id: "CST-001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    status: "active",
  },
  {
    id: "CST-002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    status: "active",
  },
  {
    id: "CST-003",
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    status: "active",
  },
  {
    id: "CST-004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 456-7890",
    location: "Houston, TX",
    status: "active",
  },
  {
    id: "CST-005",
    name: "Chris Brown",
    email: "chris.brown@example.com",
    phone: "+1 (555) 567-8901",
    location: "Phoenix, AZ",
    status: "active",
  },
  {
    id: "CST-006",
    name: "Olivia Lee",
    email: "olivia.lee@example.com",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    status: "inactive",
  },
  {
    id: "CST-007",
    name: "Daniel Kim",
    email: "daniel.kim@example.com",
    phone: "+1 (555) 789-0123",
    location: "Denver, CO",
    status: "active",
  },
  {
    id: "CST-008",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+1 (555) 890-1234",
    location: "Miami, FL",
    status: "active",
  },
];

const statusPillStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function SellerCustomersPage() {
  const orders = useStore((state) => state.orders);
  const [query, setQuery] = useState("");

  const ordersByEmail = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    orders.forEach((order) => {
      const existing = map.get(order.buyerEmail) ?? { count: 0, total: 0 };
      map.set(order.buyerEmail, {
        count: existing.count + 1,
        total: existing.total + order.total,
      });
    });
    return map;
  }, [orders]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const customerRows = customerProfiles.map((customer) => {
    const stats = ordersByEmail.get(customer.email);
    return {
      ...customer,
      orders: stats?.count ?? 0,
      totalSpent: stats?.total ?? 0,
    };
  });

  const filteredCustomers = customerRows.filter((customer) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return (
      customer.name.toLowerCase().includes(normalized) ||
      customer.email.toLowerCase().includes(normalized) ||
      customer.location.toLowerCase().includes(normalized)
    );
  });

  const metrics = [
    { label: "Total Customers", value: customerProfiles.length.toString() },
    {
      label: "Active Customers",
      value: customerProfiles.filter((customer) => customer.status === "active").length.toString(),
    },
    { label: "Total Revenue", value: money(totalRevenue) },
    { label: "Avg. Order Value", value: money(avgOrderValue) },
  ];

  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <SellerSidebar activeLink="Customers" />
      <main className="flex-1 px-6 py-8 pl-12 lg:pl-16 ml-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">Customers</h1>
                <p className="text-sm text-slate-500">Manage your customer relationships</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full border-none bg-transparent text-sm text-slate-600 focus:outline-none"
                />
              </div>
            </div>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_25px_40px_rgba(15,23,42,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-6 text-3xl font-semibold text-slate-900">{metric.value}</p>
              </article>
            ))}
          </section>

          <section className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Customer List
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    <th className="px-3 py-3">Customer</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="px-3 py-3">Orders</th>
                    <th className="px-3 py-3">Total Spent</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-sm text-slate-400">
                        No customers match this search
                      </td>
                    </tr>
                  )}
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.email} className="border-t border-slate-100">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-base font-semibold text-white">
                            {getInitials(customer.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{customer.name}</p>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <p className="text-sm font-semibold text-slate-900">{customer.email}</p>
                        <p className="text-xs text-slate-500">{customer.phone}</p>
                      </td>
                      <td className="px-3 py-4 text-slate-600">{customer.location}</td>
                      <td className="px-3 py-4 font-semibold text-slate-900">{customer.orders}</td>
                      <td className="px-3 py-4 font-semibold text-slate-900">
                        {money(customer.totalSpent)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] ${statusPillStyles[customer.status]}`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          type="button"
                          className="rounded-3xl border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                        >
                          View Details
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
