import { Heart, Menu, Search, ShoppingCart, Ticket, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useEffect, useState } from "react";

const iconButtonBase =
  "rounded-full border border-white/30 bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function Header() {
  const navigate = useNavigate();
  const toggleCart = useStore((s) => s.toggleCart);
  const cartCount = useStore((s) =>
    s.cart.reduce((sum, item) => sum + item.qty, 0)
  );
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const userRole = useStore((s) => s.userRole);
  const logout = useStore((s) => s.logout);
  const searchQuery = useStore((s) => s.filters.query);
  const setQuery = useStore((s) => s.setQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1000);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1000);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
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
      <header className="sticky top-0 z-40 w-full bg-[#0b47c7] px-4 py-3 text-white shadow-md shadow-blue-900/30">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full  px-4 py-2 text-xl font-bold tracking-[0.25em]"
          >
            <span className="text-emerald-200">Quick</span>
            <span className="text-yellow-300">Shop</span>
          </button>

          <div className="relative mx-auto w-[300px] bg-white/30 rounded-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-white/40 bg-white/10 px-10 py-2 text-sm text-white placeholder-white/80 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/70"
            />
          </div>

          {isDesktop ? (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className="text-sm font-semibold tracking-wide"
                onClick={() => navigate("/product")}
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => navigate("/favorites")}
                className={iconButtonBase}
                aria-label="View Favorites"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/support")}
                className={iconButtonBase}
                aria-label="Support"
              >
                <Ticket className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleCart()}
                className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden />
                {cartCount}
              </button>
              {userRole === "seller" && (
                <button
                  type="button"
                  onClick={() => navigate("/seller")}
                  className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold"
                >
                  Seller Hub
                </button>
              )}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0b47c7]"
                >
                  Log out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0b47c7]"
                >
                  Log in
                </button>
              )}
            </div>
          ) : (
            <div className="ml-auto">
              <MenuButton />
            </div>
          )}
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 bg-white px-6 py-6 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-white/30 bg-white/10 px-10 py-2 text-sm text-white placeholder-white/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/70"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                toggleCart();
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
              <span className="rounded-full bg-[#fcd34d] px-2 py-0.5 text-xs text-slate-900">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/support");
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            >
              <Ticket className="h-4 w-4" />
              Support
            </button>
            {userRole === "seller" && (
              <button
                type="button"
                onClick={() => {
                  navigate("/seller");
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
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
              className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold"
            >
              <Heart className="h-4 w-4" />
              Favorites
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
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              {isAuthenticated ? "Log out" : "Log in"}
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/register");
                setMenuOpen(false);
              }}
              className="rounded-full bg-[#0d4bc9] px-4 py-2 text-sm font-semibold text-white"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/product");
                setMenuOpen(false);
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Products
            </button>
          </aside>
        </>
      )}
    </>
  );
}
