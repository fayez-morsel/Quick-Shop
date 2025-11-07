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
      </div>
    </header>
  );
}
