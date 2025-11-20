import SellerSidebar from "../components/SellerSidebar";

const settingsOptions = [
  {
    title: "Store profile",
    description: "Update store name, logo, contact info, and payout details.",
  },
  {
    title: "Notifications",
    description: "Control alerts for orders, reviews, and low stock warnings.",
  },
  {
    title: "Shipping settings",
    description: "Adjust carriers, delivery commitments, and pickup rules.",
  },
  {
    title: "Payment & taxes",
    description: "Configure tax rates, payment gateways, and billing contacts.",
  },
  {
    title: "Team access",
    description: "Invite managers, assign roles, and revoke access for others.",
  },
  {
    title: "Security",
    description: "Rotate API keys, set password policies, and enable MFA.",
  },
];

export default function SellerSettingsPage() {
  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      <SellerSidebar activeLink="Settings" />
      <main className="flex-1 px-6 py-8 pl-12 lg:pl-16 ml-72">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <section className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-slate-500">
              Store settings
            </p>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-500">
                Control how your store appears to customers and manage operational
                preferences in one place.
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {settingsOptions.map((option) => (
              <article
                key={option.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_25px_55px_rgba(15,23,42,0.12)]"
              >
                <h2 className="text-lg font-semibold text-slate-900">{option.title}</h2>
                <p className="mt-3 text-sm text-slate-500">{option.description}</p>
                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
                >
                  Manage
                </button>
              </article>
            ))}
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_50px_rgba(15,23,42,0.08)]">
            <h2 className="text-2xl font-semibold text-slate-900">Security snapshot</h2>
            <p className="mt-2 text-sm text-slate-500">
              Last security review: {new Date().toLocaleDateString()}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Multi-factor auth</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Enabled for all users</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">API keys rotated</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">8 days ago</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Staff activity</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">No anomalies detected</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Backup jobs</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Running every 6 hours</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
