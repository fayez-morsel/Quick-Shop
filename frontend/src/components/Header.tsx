import { Heart, Menu, ShoppingCart, Ticket, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useEffect, useState } from "react";

const iconButtonBase =
  "cursor-pointer rounded-full border border-white/30 bg-white/10 p-2 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";
const textButtonBase =
  "cursor-pointer text-sm font-semibold tracking-wide text-white/80 transition hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";
const blurButtonBase =
  "cursor-pointer rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#0b47c7] transition duration-200 ease-in-out backdrop-blur hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function Header() {
  const navigate = useNavigate();
  const toggleCart = useStore((s) => s.toggleCart);
  const cartCount = useStore((s) =>
    s.cart.reduce((sum, item) => sum + item.qty, 0)
  );
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const userRole = useStore((s) => s.userRole);
  const logout = useStore((s) => s.logout);
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
            className="rounded-full  px-4 py-2 text-xl font-bold "
          >
            <span className="text-emerald-200">Quick</span>
            <span className="text-yellow-300">Shop</span>
          </button>

          {isDesktop ? (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                className={`${textButtonBase}`}
                onClick={() => navigate("/product")}
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => navigate("/support")}
                className={textButtonBase}
              >
                Support
              </button>
              <button
                type="button"
                onClick={() => navigate("/favorites")}
                className={`${iconButtonBase} shadow-lg shadow-slate-900/40`}
                aria-label="View Favorites"
              >
                <Heart className="h-4 w-4" />
              </button>
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
                  className={blurButtonBase}
                >
                  Log out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className={blurButtonBase}
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
                toggleCart();
                setMenuOpen(false);
              }}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-center"
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
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-center"
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
                className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 text-center"
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
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-center"
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
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 text-center"
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
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 text-center"
            >
              {isAuthenticated ? "Log out" : "Log in"}
            </button>
          </aside>
        </>
      )}
    </>
  );
}
