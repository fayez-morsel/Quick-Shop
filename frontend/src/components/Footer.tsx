import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { useLocation } from "react-router-dom";

const quickLinks = ["All Products", "My Orders", "Favorites", "Shopping Cart"];
const customerLinks = ["Help Center", "Shipping Info", "Returns", "Contact Us"];

export default function Footer() {
  const location = useLocation();
  const isSellerPath = location.pathname.startsWith("/seller");

  return (
    <footer className={`bg-[#0d2c88] text-white ${isSellerPath ? "pl-72 md:pl-0" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cursor-pointer rounded-full px-4 py-2 text-xl font-bold"
            >
              <span className="text-emerald-200">Quick</span>
              <span className="text-yellow-300">Shop</span>
            </button>
            <p className="text-sm text-white/70">
              Your trusted e-commerce platform for quality products from verified stores.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
              Customer Service
            </p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {customerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
              Connect With Us
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full border border-white/30 bg-white/10 p-2 text-white transition hover:border-white hover:bg-white/20"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              ))}
            </div>
            <p className="text-sm text-white/70">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-4 text-center text-sm text-white/60">
          {"\u00A9"} {new Date().getFullYear()} ShopUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
