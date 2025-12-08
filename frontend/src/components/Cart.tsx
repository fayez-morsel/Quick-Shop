import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { money } from "../utils/format";
import {
  useAuthStore,
  useCartStore,
  useOrderStore,
  useProductStore,
  useUIStore,
} from "../store";

type CartProps = {
  onCheckoutComplete?: (orderId?: string) => void;
};

export default function Cart({ onCheckoutComplete }: CartProps) {
  const cart = useCartStore((s) => s.cart);
  const productsMap = useProductStore((s) => s.productsMap);
  const cartOpen = useUIStore((s) => s.cartOpen);
  const toggleCart = useUIStore((s) => s.toggleCart);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const clearCart = useCartStore((s) => s.clearCart);
  const setQty = useCartStore((s) => s.setQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const cartEntries = Object.entries(cart);

  const total = cartEntries.reduce((sum, [productId, qty]) => {
    const product = productsMap[productId];
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const handleCheckout = async () => {
    if (!cartEntries.length) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleCart();
    const orderId = await placeOrder();
    if (orderId) {
      onCheckoutComplete?.(orderId);
    }
  };

  return (
    <>
      {cartOpen && (
        <div
          onClick={toggleCart}
          className="fixed inset-0 z-40 h-screen bg-black/40"
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 h-full min-h-screen w-90 transform transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="cart-drawer"
      >
        <div className="flex h-full min-h-screen flex-col border-l border-[#0b3ca9] shadow-2xl">
          <header className="flex items-center justify-between bg-linear-to-r from-[#0b47c7] to-[#0c409f] px-6 py-4 text-lg font-semibold text-white">
            <h2 className="text-lg font-semibold" aria-label="My Cart">
              My Cart
            </h2>
            <button
              type="button"
              onClick={toggleCart}
              className="cursor-pointer text-white/70 transition duration-200 ease-in-out hover:text-white"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-white px-6 py-4 text-slate-900">
            {cartEntries.length === 0 ? (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartEntries.map(([productId, qty]) => {
                  const product = productsMap[productId];
                  if (!product) return null;
                  const imageSources =
                    product.images && product.images.length
                      ? product.images
                      : product.image
                      ? [product.image]
                      : [];
                  const cartImage = imageSources[0] ?? product.image;
                  return (
                    <li
                      key={productId}
                      className="rounded-2xl border border-slate-100 p-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cartImage}
                          alt={product.title}
                          className="h-16 w-16 rounded-2xl object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {product.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {money(product.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(productId)}
                          className="cursor-pointer text-rose-500 transition duration-200 ease-in-out hover:text-rose-600"
                          aria-label={`Remove ${product.title} from cart`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          <span className="sr-only">Remove product</span>
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setQty(productId, qty - 1)}
                            className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 text-lg"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm font-semibold">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(productId, qty + 1)}
                            className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 text-lg"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {money(product.price * qty)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <footer className="border-t border-transparent bg-[#0c409f] px-6 py-5 text-white">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Total</span>
              <span className="text-lg font-bold text-white">
                {money(total)}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="cursor-pointer flex-1 rounded-full border border-white/40 px-3 py-2 text-sm font-semibold text-white/90 transition duration-200 ease-in-out hover:bg-white/10"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!cartEntries.length}
                className="cursor-pointer flex-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#0c409f] transition duration-200 ease-in-out hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white/40"
              >
                Checkout
              </button>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
