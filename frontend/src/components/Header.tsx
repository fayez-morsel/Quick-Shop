import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useState } from "react";

const iconButtonBase =
  "rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function Header() {
  const navigate = useNavigate();
  const toggleCart = useStore((s) => s.toggleCart);
  const cartCount = useStore((s) =>
    s.cart.reduce((sum, item) => sum + item.qty, 0)
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const Actions = ({ stacked = false }: { stacked?: boolean }) => (
    <div className={`flex gap-3 ${stacked ? "flex-col" : "items-center"}`}>
      <button
        type="button"
        className={`${iconButtonBase} ${stacked ? "w-full justify-center" : ""}`}
        aria-label="Favorites"
      >
        <Heart className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={toggleCart}
        className={`${iconButtonBase} ${stacked ? "w-full justify-center" : ""} relative`}
        aria-label="Cart"
      >
        <ShoppingCart className="h-5 w-5" aria-hidden />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#fcd34d] text-[10px] font-bold text-slate-900">
          {cartCount}
        </span>
      </button>
    </div>
  );

  const compactButtonBase =
    "flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

  const LoginButton = ({
    className = "",
    stacked = false,
  }: {
    className?: string;
    stacked?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => navigate("/login")}
      className={`${compactButtonBase} bg-[#dcdcdc] text-slate-900 shadow hover:bg-white ${
        stacked ? "w-full text-center min-w-0" : "min-w-[120px]"
      } ${className}`}
    >
      Log in
    </button>
  );

  const MenuButton = ({
    className = "",
    stacked = false,
  }: {
    className?: string;
    stacked?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => setMenuOpen(true)}
      className={`${compactButtonBase} border border-white/40 bg-white/10 text-white hover:bg-white/20 ${
        stacked ? "w-full text-center min-w-0" : "min-w-[120px]"
      } ${className}`}
      aria-label="Open filters"
    >
      <Menu className="h-5 w-5" aria-hidden />
      <span className="sr-only">Open filters</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b47c7] px-6 shadow-md shadow-blue-900/30">
      <div className="flex w-full max-w-screen-2xl flex-wrap items-center gap-3 px-4 py-3 text-white lg:mx-auto lg:flex-nowrap lg:px-6 lg:py-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-2xl font-bold leading-none cursor-pointer"
          aria-label="Go to homepage"
        >
          <span className="text-emerald-200">Quick</span>
          <span className="text-amber-300">shop</span>
        </button>
        <div className="hidden items-center gap-3 lg:flex">
          <Actions />
          <LoginButton />
        </div>
        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <MenuButton className="text-xs" />
          <LoginButton className="text-xs" />
        </div>
      </div>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} />
          <aside className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-5 bg-[#0b47c7] px-5 py-6 text-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Filters</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className={iconButtonBase}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                navigate("/product");
                setMenuOpen(false);
              }}
              className="text-left text-sm font-semibold hover:text-white/80"
            >
              Products
            </button>
            <Actions stacked />
          </aside>
        </>
      )}
    </header>
  );
}
