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

          
        </div>
      </div>
    </>
  );
}
