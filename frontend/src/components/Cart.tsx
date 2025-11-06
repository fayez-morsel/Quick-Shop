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
    <div
        onClick={toggleCart}
        className="fixed inset-0 bg-black/40 z-40"
    />
  )}
  </>
}
