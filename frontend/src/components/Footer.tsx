import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

const quickLinks = [
  { label: "All Products", to: "/product" },
  { label: "My Orders", to: "/orders" },
  { label: "Favorites", to: "/favorites" },
  { label: "Shopping Cart", to: "cart" },
];
const customerLinks = [
  { label: "Help Center", to: "/support" },
  { label: "Shipping Info", to: "/support" },
  { label: "Returns", to: "/support" },
  { label: "Contact Us", to: "/support" },
];

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const toggleCart = useStore((s) => s.toggleCart);
  const isSellerPath = location.pathname.startsWith("/seller");

  const handleNav = (to: string) => {
    if (to === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (to === "cart") {
      toggleCart();
      return;
    }
    navigate(to);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`bg-[#0d47a1] text-white ${isSellerPath ? "pl-72 md:pl-0" : ""}`}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleNav("/")}
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
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.to)}
                    className="hover:text-white"
                  >
                    {link.label}
                  </button>
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
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.to)}
                    className="hover:text-white"
                  >
                    {link.label}
                  </button>
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
          {"\u00A9"} {new Date().getFullYear()} QuickShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
