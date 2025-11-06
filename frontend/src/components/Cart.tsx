import React from "react";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";

/** 🛒 Floating cart panel */
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
      {/* Overlay */}
      {cartOpen && (
        <div
          onClick={toggleCart}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-semibold">My Cart</h2>
          <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            cart.map((c) => {
              const p = products.find((x) => x.id === c.productId);
              if (!p) return null;
              return (
                <div
                  key={c.productId}
                  className="flex items-center justify-between gap-3 border-b pb-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-gray-500 text-xs">
                      {money(p.price)} x {c.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setQty(c.productId, c.qty - 1)}
                      className="px-2 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="text-sm w-5 text-center">{c.qty}</span>
                    <button
                      onClick={() => setQty(c.productId, c.qty + 1)}
                      className="px-2 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(c.productId)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    🗑
                  </button>
                </div>
              );
            })
          )}
        </div>

        
      </div>
    </>
  );
}
