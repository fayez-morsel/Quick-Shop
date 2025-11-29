import { Trash2, X } from "lucide-react";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { money } from "../utils/format";

type CartProps = {
  onCheckoutComplete?: (orderId?: string) => void;
};

export default function Cart({ onCheckoutComplete }: CartProps) {
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const toggleCart = useStore((s) => s.toggleCart);
  const placeOrder = useStore((s) => s.placeOrder);
  const clearCart = useStore((s) => s.clearCart);
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);
  const cartOpen = useStore((s) => s.ui.cartOpen);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  const handleCheckout = () => {
    if (!cart.length) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleCart();
    const orderId = placeOrder(cart, userName, userEmail);
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
      >
        <div className="flex h-full min-h-screen flex-col border-l border-[#0b3ca9] shadow-2xl">
          <header className="flex items-center justify-between bg-linear-to-r from-[#0b47c7] to-[#0c409f] px-6 py-4 text-lg font-semibold text-white">
            <span>My Cart</span>
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
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
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
                      key={item.productId}
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
                          onClick={() => removeFromCart(item.productId)}
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
                            onClick={() => setQty(item.productId, item.qty - 1)}
                            className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 text-lg"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.qty + 1)}
                            className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 text-lg"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">
                          {money(product.price * item.qty)}
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
                disabled={!cart.length}
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
