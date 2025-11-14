import { Store } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../store/useStore";
import type { UserRole } from "../types";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore((s) => s.login);
  const [role, setRole] = useState<UserRole>(
    ((location.state as { role?: UserRole })?.role ?? "buyer") as UserRole
  );

  return (
    <div className="min-h-screen  text-slate-900">
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-4xl bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d4bc9] text-white">
              <Store className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-sm text-slate-500">
              Join ShopUp to track orders, save favorites, and enjoy fast checkout.
            </p>
          </div>

          <form className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-600">First Name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="John"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Last Name</label>
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Doe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-600">Email</label>
              <input
                type="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="you@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-600">Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-600">Confirm Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>
            <div className="md:col-span-2">
            <div className="flex gap-3">
              {(["buyer", "seller"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`flex-1 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                    role === option
                      ? "border-[#0d4bc9] bg-[#0d4bc9] text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {option === "seller" ? "Seller" : "Buyer"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                login(role);
                navigate(role === "seller" ? "/seller" : "/");
              }}
              className="mt-2 w-full rounded-full bg-[#0d4bc9] px-4 py-3 text-sm font-semibold text-white shadow hover:bg-[#0b3ba2]"
            >
              Create {role === "seller" ? "Seller" : "Buyer"} Account
            </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-[#0d4bc9] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
