import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const issueTypes = [
  "Order issue",
  "Product inquiry",
  "Technical support",
  "Billing question",
  "Other",
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: issueTypes[0],
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/");
    }, 1400);
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
              />
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
              />
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
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#0d4bc9] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0b3ba2]"
            >
              Submit ticket
            </button>
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
