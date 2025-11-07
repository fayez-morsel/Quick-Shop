import { useStore } from "../store/useStore";

export default function Header() {
  const toggleCart = useStore((s) => s.toggleCart);
  const count = useStore((s) => s.cart.reduce((sum, c) => sum + c.qty, 0));

  return (
    <header className="bg-[--color-primary-dark] text-white shadow">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between px-4 py-3 gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white text-[--color-primary-dark] rounded-md grid place-items-center font-bold text-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight">ShopHub</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="rounded-md px-3 py-1.5 text-sm text-gray-800 focus:outline-none w-40 sm:w-60"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
            <button className="hover:text-[--color-accent]">Products</button>
            <button className="hover:text-[--color-accent]">Stores</button>
            <button className="hover:text-[--color-accent]">About</button>
          </nav>

          <button className="bg-white text-[--color-primary-dark] text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-blue-50">
            Login
          </button>

          <button
            onClick={toggleCart}
            className="relative bg-[--color-primary] hover:bg-[--color-primary-dark] px-3 py-1.5 rounded-md text-sm font-semibold"
          >
            Cart
            <span className="absolute -top-1 -right-2 bg-white text-[--color-primary-dark] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
