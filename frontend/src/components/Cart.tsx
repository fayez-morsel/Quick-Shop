import { useStore } from "../store/useStore";
import { money } from "../utils/format";

type CartProps = {
  onCheckoutComplete?: () => void;
};

export default function Cart({ onCheckoutComplete }: CartProps) {
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const toggleCart = useStore((s) => s.toggleCart);
  const clearCart = useStore((s) => s.clearCart);
  const cartOpen = useStore((s) => s.ui.cartOpen);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const handleCheckout = () => {
    if (!cart.length) return;
    toggleCart();
    clearCart();
    onCheckoutComplete?.();
  };

  return (
    <>
      {cartOpen && (
        <div onClick={toggleCart} className="fixed inset-0 z-40 bg-black/40" />
      )}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform border-l border-slate-100 bg-white text-slate-900 shadow-2xl transition-transform duration-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4 text-lg font-semibold dark:border-slate-700">
          <span>My Cart</span>
          <button
            type="button"
            onClick={toggleCart}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <li
                    key={item.productId}
                    className="rounded-2xl border border-slate-100 p-3 text-sm dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {product.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">
                          {money(product.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-xs text-slate-400 hover:text-rose-500"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-600">
                        <button
                          type="button"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                          className="px-3 py-1 text-lg"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.productId, item.qty + 1)}
                          className="px-3 py-1 text-lg"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {money(product.price * item.qty)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-slate-100 px-6 py-5 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-300">Total</span>
            <span className="text-lg font-bold text-[#0d4bc9] dark:text-blue-200">
              {money(total)}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={clearCart}
              className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!cart.length}
              className="flex-1 rounded-full bg-[#0d4bc9] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0b3ba2] disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Checkout
            </button>
          </div>
        </footer>
      </div>
    </>
  );
}
