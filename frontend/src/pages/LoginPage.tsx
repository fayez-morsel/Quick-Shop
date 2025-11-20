import { Store } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormEvent } from "react";
import { useStore } from "../store/useStore";
import type { UserRole } from "../types";
import { getAccountByEmail, getAccountByEmailAndRole } from "../utils/auth";

const emailPattern = /^\S+@\S+\.\S+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore((s) => s.login);
  const setUserInfo = useStore((s) => s.setUserInfo);
  const setSellerStoreId = useStore((s) => s.setSellerStoreId);
  const [role, setRole] = useState<UserRole>(
    ((location.state as { role?: UserRole })?.role ?? "buyer") as UserRole
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors: typeof errors = {};

    if (!form.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      validationErrors.email = "Enter a valid email address.";
    }

    if (!form.password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (form.password.trim().length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const normalizedEmail = form.email.trim().toLowerCase();
    const normalizedPassword = form.password.trim();
    const account = getAccountByEmailAndRole(normalizedEmail, role);

    if (!account) {
      const registeredAccount = getAccountByEmail(normalizedEmail);
      validationErrors.email = registeredAccount
        ? `This email is registered as a ${registeredAccount.role} account.`
        : "No account found with this email. Please register.";
      setErrors(validationErrors);
      return;
    }

    if (account.password !== normalizedPassword) {
      setErrors({ password: "Incorrect password for this account." });
      return;
    }

    setErrors({});
    login(role);
    setUserInfo({ name: account.name, email: normalizedEmail });
    setSellerStoreId(role === "seller" ? account.storeId ?? "" : "");
    navigate(role === "seller" ? "/seller" : "/");
  };

  return (
    <div className="min-h-screen text-slate-900">
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-4xl bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d4bc9] text-white">
              <Store className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-sm text-slate-500">
              Sign in to continue shopping on ShopUp.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-600">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="john@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              <p className="mt-1 min-h-5 text-xs font-medium text-rose-500">
                {errors.email || "\u00A0"}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => handleChange("password", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
              />
              <p className="mt-1 min-h-5 text-xs font-medium text-rose-500">
                {errors.password || "\u00A0"}
              </p>
            </div>
            <div className="flex gap-3">
              {(["buyer", "seller"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRole(option)}
                  className={`flex-1 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                    role === option
                      ? "border-white bg-white text-[#0b47c7]"
                      : "border-white/40 bg-white/20 text-white/80"
                  }`}
                >
                  {option === "seller" ? "Seller" : "Buyer"}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-[#0d4bc9] px-4 py-3 text-sm font-semibold text-white shadow hover:bg-[#0b3ba2]"
            >
              Sign In as {role === "seller" ? "Seller" : "Buyer"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-semibold text-[#0d4bc9] hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
