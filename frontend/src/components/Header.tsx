import { useStore } from "../store/useStore";

export default function Header() {
  const toggleCart = useStore((s) => s.toggleCart);
  const count = useStore((s) => s.cart.reduce((sum, c) => sum + c.qty, 0));

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-blue-600 text-white grid place-items-center text-sm font-bold">
            QS
          </div>
          <span className="text-lg font-bold">QuickShop</span>
        </div>

        <div className="ml-auto" />

        {/* Cart button */}
        <button
          onClick={toggleCart}
          className="relative rounded-md bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
        >
          Cart
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/90 text-blue-700 text-xs font-semibold px-1.5 py-0.5">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
