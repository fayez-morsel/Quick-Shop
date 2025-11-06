import type { Product } from "../types";
import { money } from "../utils/format";
import { useStore } from "../store/useStore";
import Rating from "./Rating";
import Badge from "./Badge";

type Props = {
  product: Product | null;
  onClose: () => void;
};

/** 🪟 Modal showing full product details */
export default function ProductDetails({ product, onClose }: Props) {
  const addToCart = useStore((s) => s.addToCart);

  if (!product) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex flex-col gap-4">
            <div className="aspect-4/3 bg-gray-100 overflow-hidden rounded-md">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>{product.storeName}</Badge>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <Badge>On Sale</Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  {money(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm line-through text-gray-500">
                    {money(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <Rating value={4.3} count={128} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              This is a sample description for {product.title}. You can replace
              this with real product details, specifications, and customer
              reviews.
            </p>
          </div>

          
        </div>
      </div>
    </>
  );
}
