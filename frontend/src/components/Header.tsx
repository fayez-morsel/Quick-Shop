import { useStore } from "../store/useStore";

export default function Header() {
  const toggleCart = useStore((s) => s.toggleCart);
  const count = useStore((s) => s.cart.reduce((sum, c) => sum + c.qty, 0));

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between px-4 py-3 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white text-blue-700 rounded-md grid place-items-center font-bold text-sm">
            S
          </div>
          <span className="font-semibold text-lg tracking-tight">ShopHub</span>
        </div>
        {/* Search + Nav + Buttons */}
        <div className="flex flex-wrap items-center gap-3 ml-auto">
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
            <button className="hover:text-blue-200">Products</button>
            <button className="hover:text-blue-200">Stores</button>
            <button className="hover:text-blue-200">About</button>
          </nav>

          <button className="bg-white text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-blue-50">
            Login
          </button>

          <button
            onClick={toggleCart}
            className="relative bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-md text-sm font-semibold"
          >
            Cart
            <span className="absolute -top-1 -right-2 bg-white text-blue-700 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
