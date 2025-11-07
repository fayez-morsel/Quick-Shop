import type { Product } from "../types";
import { money } from "../utils/format";
import { useStore } from "../store/useStore";
import Rating from "./Rating";
import Badge from "./Badge";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductDetails({ product, onClose }: Props) {
  const addToCart = useStore((s) => s.addToCart);

  if (!product) return null;

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="rounded-lg shadow-xl w-full max-w-lg overflow-hidden border border-(--border-color)"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-main)",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-(--border-color) px-4 py-3">
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <button
              onClick={onClose}
              className="text-(--text-secondary) hover:text-(--color-primary) transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-4">
            <div
              className="aspect-4/3 overflow-hidden rounded-md"
              style={{ backgroundColor: "var(--bg-main)" }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>{product.storeName}</Badge>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <Badge>On Sale</Badge>
                )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {money(product.price)}
                </span>
                {product.compareAtPrice &&
                  product.compareAtPrice > product.price && (
                    <span
                      className="text-sm line-through"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {money(product.compareAtPrice)}
                    </span>
                  )}
              </div>
              {product.rating ? (
                <Rating
                  value={product.rating.value}
                  count={product.rating.count}
                />
              ) : (
                <span
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No ratings yet
                </span>
              )}
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              This is a sample description for {product.title}. You can replace
              this with real product details, specifications, and customer
              reviews.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-(--border-color) p-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md border border-(--border-color) text-sm transition-colors hover:bg-(--bg-main)"
            >
              Close
            </button>
            <button
              onClick={() => addToCart(product.id)}
              className="px-4 py-1.5 rounded-md text-white text-sm transition-all bg-linear-to-r from-(--color-primary) to-(--color-primary-dark) hover:shadow-[0_0_12px_var(--color-primary)]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
