import React from "react";
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

  <>
    {/* Overlay */}
    {cartOpen && (
      <div onClick={toggleCart} className="fixed inset-0 bg-black/40 z-40" />
    )}

    {/* Panel */}
    <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl x-50 transform transition-transform duration-300 ${
        cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold">My Cart</h2>
            <button
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700"
            >
                X
            </button>
        </div>
    </div>
  </>;
}
