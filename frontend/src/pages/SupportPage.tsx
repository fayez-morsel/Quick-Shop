import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle } from "lucide-react";
import { useStore } from "../store/useStore";

const issueTypes = [
  "Order issue",
  "Product inquiry",
  "Technical support",
  "Billing question",
  "Other",
];

export default function SupportPage() {
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);
  const setUserInfo = useStore((s) => s.setUserInfo);
  const [formData, setFormData] = useState({
    name: userName,
    email: userEmail,
    issue: issueTypes[0],
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cooldownError, setCooldownError] = useState("");
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const cooldownMs = 5 * 60_000;
  const formatCooldown = (remaining: number) => {
    const seconds = Math.ceil(remaining / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const cooldownActive = cooldownRemaining > 0;

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const stored = Number(localStorage.getItem("supportLastSubmittedAt") ?? 0);
    if (stored) {
      setLastSubmittedAt(stored);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (lastSubmittedAt) {
      localStorage.setItem("supportLastSubmittedAt", String(lastSubmittedAt));
    }
  }, [lastSubmittedAt]);

  useEffect(() => {
    if (!lastSubmittedAt) {
      setCooldownRemaining(0);
      return;
    }

    const update = () => {
      const now = Date.now();
      const remaining = Math.max(0, cooldownMs - (now - lastSubmittedAt));
      setCooldownRemaining(remaining);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [lastSubmittedAt]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const description = formData.description.trim();
    const now = Date.now();
    const validationErrors: Record<string, string> = {};

    if (!name) {
      validationErrors.name = "Please let us know who you are.";
    }
    if (!email) {
      validationErrors.email = "We need an email to follow up.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Provide a valid email address.";
    }
    if (!description || description.length < 10) {
      validationErrors.description = "Tell us a bit more about the issue.";
    }

    if (cooldownActive) {
      setCooldownError(
        `You can submit one ticket every five minutes. Please wait ${formatCooldown(
          cooldownRemaining
        )} before submitting again.`
      );
      return;
    }

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }

    setCooldownError("");

    setErrors({});
    if (userName !== name || userEmail !== email) {
      setUserInfo({ name, email });
    }
    setSubmitted(true);
    setLastSubmittedAt(now);
  };

  return (
    <div className="min-h-screen bg-[#dfeeff]">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#0c409f]">
            Support
          </p>
          <h1 className="text-4xl font-bold text-slate-900">
            Submit a support ticket
          </h1>
          <p className="text-base text-slate-600">
            Let us know how we can help and our team will respond via email
            within one business day.
          </p>
        </section>

        <section className="rounded-4xl bg-white p-6 shadow-[0_32px_60px_rgba(15,23,42,0.12)]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Full name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => handleChange("name", event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="John Doe"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-semibold text-rose-500">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => handleChange("email", event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-rose-500">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Issue type
              </label>
              <select
                value={formData.issue}
                onChange={(event) => handleChange("issue", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {issueTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Describe the issue
              </label>
              <textarea
                value={formData.description}
                onChange={(event) =>
                  handleChange("description", event.target.value)
                }
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Add as much detail as you can..."
                aria-invalid={Boolean(errors.description)}
              />
              {errors.description && (
                <p className="mt-1 text-xs font-semibold text-rose-500">
                  {errors.description}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={cooldownActive}
              className="w-full rounded-full bg-[#0d4bc9] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0b3ba2] disabled:cursor-not-allowed disabled:bg-[#0b3ba2] disabled:opacity-60"
            >
              Submit ticket
            </button>
            {cooldownActive && (
              <p className="mt-3 text-xs font-semibold text-slate-500">
                Next submission available in {formatCooldown(cooldownRemaining)}.
              </p>
            )}
            {cooldownError && (
              <p className="mt-3 text-xs font-semibold text-rose-500">{cooldownError}</p>
            )}
          </form>
          {submitted && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle className="h-5 w-5" aria-hidden />
              Ticket submitted! We'll email you shortly with next steps.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
