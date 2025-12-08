import { ClipboardList, Heart, Menu, ShoppingCart, Ticket, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore, useCartStore, useUIStore } from "../store";

const iconButtonBase =
  "cursor-pointer h-10 w-10 inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";
const blurButtonBase =
  "cursor-pointer rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#0b47c7] transition duration-200 ease-in-out backdrop-blur hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function Header() {
  const navigate = useNavigate();
  const toggleCart = useUIStore((s) => s.toggleCart);
  const cartCount = useCartStore(
    (s) => Object.values(s.cart).reduce((sum, qty) => sum + qty, 0)
  );
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.userRole);
  const userName = useAuthStore((s) => s.userName);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isSellerView = userRole === "seller" && location.pathname === "/seller";

  const initials = (() => {
    const trimmed = (userName || "").trim();
    if (!trimmed) return "";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
    return letters.join("");
  })();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const MenuButton = () => (
    <button
      type="button"
      onClick={() => setMenuOpen(true)}
      className={iconButtonBase}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0D47A1] px-4 py-3 text-white shadow-md shadow-blue-900/30">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(isSellerView ? "/seller" : "/")}
              className="cursor-pointer rounded-full px-4 py-2 text-xl font-bold "
            >
              <span className="text-emerald-200">Quick</span>
              <span className="text-yellow-300">Shop</span>
            </button>
            {isSellerView && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                  Seller Hub
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={blurButtonBase}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleCart()}
              className={`${iconButtonBase} relative shadow-lg shadow-white/40`}
              aria-label="View cart"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-[#fcd34d] px-2 py-0.5 text-[10px] font-bold text-[#0b47c7]">
                  {cartCount}
                </span>
              )}
            </button>
            <MenuButton />
            {isAuthenticated && initials && (
              <span
                className="grid h-10 w-10 place-items-center rounded-full bg-[#fcd34d] text-sm font-bold uppercase text-[#0b47c7] shadow-md shadow-blue-900/30"
                aria-label={`Signed in as ${userName}`}
              >
                {initials}
              </span>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col items-center gap-6 bg-white px-6 py-6 text-slate-900 shadow-2xl">
            <div className="flex w-full items-center justify-between gap-4">
              <span className="text-lg font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-slate-200 bg-slate-100 p-2 text-slate-900"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                navigate("/support");
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-center transition hover:bg-slate-100"
            >
              <Ticket className="h-4 w-4" />
              Support
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/orders");
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-center transition hover:bg-slate-100"
            >
              <ClipboardList className="h-4 w-4" />
              Orders
            </button>
            {userRole === "seller" && (
            <button
              type="button"
              onClick={() => {
                navigate("/seller");
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 text-center transition hover:bg-slate-100"
            >
                Seller Hub
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                navigate("/favorites");
                setMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-center transition hover:bg-slate-100"
            >
              <Heart className="h-4 w-4" />
              Favorites
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/product");
                setMenuOpen(false);
              }}
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 text-center transition hover:bg-slate-100"
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => {
                if (isAuthenticated) {
                  handleLogout();
                } else {
                  navigate("/login");
                }
                setMenuOpen(false);
              }}
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 text-center transition hover:bg-slate-100"
            >
              {isAuthenticated ? "Log out" : "Log in"}
            </button>
          </aside>
        </>
      )}
    </>
  );
}
