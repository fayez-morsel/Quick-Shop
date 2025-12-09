import { Store } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import { useAuthStore } from "../store";
import type { UserRole } from "../types";

const emailPattern = /^\S+@\S+\.\S+$/;

const normalizeStoreId = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const [role, setRole] = useState<UserRole>(
    ((location.state as { role?: UserRole })?.role ?? "buyer") as UserRole
  );
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    storeId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setSellerStoreId = useAuthStore((s) => s.setSellerStoreId);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors: Record<string, string> = {};

    if (!form.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    }
    if (!form.lastName.trim()) {
      validationErrors.lastName = "Last name is required.";
    }
    if (!form.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      validationErrors.email = "Enter a valid email address.";
    }
    if (!form.password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (form.password.trim().length < 8) {
      validationErrors.password = "Password must be at least 8 characters.";
    }
    if (form.password.trim() !== form.confirm.trim()) {
      validationErrors.confirm = "Passwords do not match.";
    }

    const trimmedEmail = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (role === "seller" && !form.storeId.trim()) {
      validationErrors.storeId = "Store ID is required for sellers.";
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    setErrors({});
    const storeIdValue =
      role === "seller" ? normalizeStoreId(form.storeId) : undefined;
    try {
      await register(fullName || trimmedEmail.split("@")[0], trimmedEmail, password, role);
      await login(trimmedEmail, password);
      setSellerStoreId(role === "seller" ? storeIdValue : "");
      navigate(role === "seller" ? "/seller" : "/");
    } catch {
      setErrors({ email: "Registration failed" });
    }
  };

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
              Join QuickShop to track orders, save favorites, and enjoy fast checkout.
            </p>
          </div>

          <form
            className="mt-8 grid gap-5 md:grid-cols-2"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="text-sm font-semibold text-slate-600" htmlFor="register-first-name">
                First Name
              </label>
              <input
                id="register-first-name"
                value={form.firstName}
                onChange={(event) => handleChange("firstName", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="John"
                aria-invalid={Boolean(errors.firstName)}
              />
              <p className="mt-1 min-h-5 text-xs font-semibold text-rose-500">
                {errors.firstName || "\u00A0"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600" htmlFor="register-last-name">
                Last Name
              </label>
              <input
                id="register-last-name"
                value={form.lastName}
                onChange={(event) => handleChange("lastName", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Doe"
                aria-invalid={Boolean(errors.lastName)}
              />
              <p className="mt-1 min-h-5 text-xs font-semibold text-rose-500">
                {errors.lastName || "\u00A0"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-600" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              <p className="mt-1 min-h-5 text-xs font-semibold text-rose-500">
                {errors.email || "\u00A0"}
              </p>
            </div>
            {role === "seller" && (
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-600" htmlFor="register-store-id">
                  Store ID
                </label>
                <input
                  id="register-store-id"
                  value={form.storeId}
                  onChange={(event) => handleChange("storeId", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="tech-hub"
                  aria-invalid={Boolean(errors.storeId)}
                />
                <p className="mt-1 min-h-5 text-xs font-semibold text-rose-500">
                  {errors.storeId || "\u00A0"}
                </p>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-600" htmlFor="register-password">
                Password
              </label>
              <input
                id="register-password"
                type="password"
                value={form.password}
                onChange={(event) => handleChange("password", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Password"
                aria-invalid={Boolean(errors.password)}
              />
              <p className="mt-1 min-h-5 text-xs font-semibold text-rose-500">
                {errors.password || "\u00A0"}
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-600" htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                value={form.confirm}
                onChange={(event) => handleChange("confirm", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Confirm password"
                aria-invalid={Boolean(errors.confirm)}
              />
              <p className="mt-1 min-h-5 text-xs font-semibold text-rose-500">
                {errors.confirm || "\u00A0"}
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="flex gap-3">
                {(["buyer", "seller"] as const).map((option) => {
                  const isActive = role === option;
                  const baseClass =
                    "flex-1 rounded-full border px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-300";
                  const activeClass = "border-slate-900 bg-slate-900 text-white";
                  const inactiveClass = "border-slate-200 bg-slate-50 text-slate-600";
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
                    >
                      {option === "seller" ? "Seller" : "Buyer"}
                    </button>
                  );
                })}
              </div>
              <button
                type="submit"
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

