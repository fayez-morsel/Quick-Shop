import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
const quickLinks = ["All Products", "My Orders", "Favorites", "Shopping Cart"];
const customerLinks = ["Help Center", "Shipping Info", "Returns", "Contact Us"];

export default function Footer() {
  return (
    <footer className="mt-16 bg-linear-to-b from-[#0b3ca9] to-[#062b75] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-sm uppercase tracking-[0.4em] text-blue-200">
                <span className="text-emerald-200">Quick</span>
                <span className="text-yellow-300">Shop</span>
              </p>
            </div>
            <p className="text-sm text-blue-100">
              Your trusted e-commerce platform for quality products from
              verified stores.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
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
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <ul className="mt-4 space-y-2 text-sm text-blue-100">
              {customerLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect With Us</h4>
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
                  className="rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              ))}
            </div>
            <p className="text-sm text-blue-100">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-blue-100">
          {"\u00A9"} {new Date().getFullYear()} QuickShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
