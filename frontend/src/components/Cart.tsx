import { useStore } from "../store/useStore";
import { money } from "../utils/format";

export default function Cart() {
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const toggleCart = useStore((s) => s.toggleCart);
  const clearCart = useStore((s) => s.clearCart);
  const cartOpen = useStore((s) => s.ui.cartOpen);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);

  const total = cart.reduce((sum, c) => {
    const p = products.find((x) => x.id === c.productId);
    return sum + (p ? p.price * c.qty : 0);
  }, 0);

  return (
    <>
      {cartOpen && (
        <div onClick={toggleCart} className="fixed inset-0 bg-black/40 z-40" />
      )}

      <div
        className={`fixed right-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--bg-cart)",
          color: "var(--text-main)",
          boxShadow: "0 0 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b p-4 border-(--border-color)">
          <h2 className="text-lg font-semibold">My Cart</h2>
          <button
            onClick={toggleCart}
            className="text-(--text-secondary) hover:text-(--color-primary) transition"
          >
            ✕
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-(--text-secondary) text-sm">
              Your cart is empty.
            </p>
          ) : (
            cart.map((c) => {
              const p = products.find((x) => x.id === c.productId);
              if (!p) return null;
              return (
                <div
                  key={c.productId}
                  className="flex items-center justify-between gap-3 border-b pb-2 border-(--border-color)"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-(--text-secondary) text-xs">
                      {money(p.price)} × {c.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQty(c.productId, c.qty - 1)}
                      className="px-2 text-(--text-main) hover:text-(--color-primary) transition"
                    >
                      -
                    </button>
                    <span className="text-sm w-5 text-center">{c.qty}</span>
                    <button
                      onClick={() => setQty(c.productId, c.qty + 1)}
                      className="px-2 text-(--text-main) hover:text-(--color-primary) transition"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(c.productId)}
                    className="text-(--text-secondary) hover:text-red-600 transition"
                  >
                    🗑
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* footer */}
        <div className="border-t border-(--border-color) p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Total</span>
            <span className="font-semibold text-(--color-primary)">
              {money(total)}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 rounded-md border border-(--border-color) py-1.5 text-sm
                         hover:bg-(--color-primary)/10 transition"
            >
              Clear
            </button>
            <button
              disabled={cart.length === 0}
              className="flex-1 rounded-md bg-(--color-primary) py-1.5 text-sm text-white
                         hover:bg-(--color-primary-dark) hover:shadow-[0_0_12px_var(--color-primary)]
                         transition disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
