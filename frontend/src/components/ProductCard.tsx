import { useStore } from "../store/useStore";
import type { Product } from "../types";
import { money } from "../utils/format";
import Rating from "./Rating";

type Props = {
  p: Product;
  onSelect?: (product: Product) => void;
};

export default function ProductCard({ p, onSelect }: Props) {
  const addToCart = useStore((s) => s.addToCart);
  const isInteractive = Boolean(onSelect);

  const handleCardClick = () => {
    if (!onSelect) return;
    onSelect(p);
  };

  return (
    <div
      className={`rounded-lg shadow-sm transition-all duration-300 p-4 flex flex-col gap-3
                 hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] hover:-translate-y-1 relative group ${
                   isInteractive ? "cursor-pointer focus-visible:outline focus-visible:outline-(--color-primary)" : ""
                 }`}
      onClick={handleCardClick}
      onKeyDown={
        isInteractive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(p);
              }
            }
          : undefined
      }
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      style={{
        backgroundColor: "var(--bg-card)",
        color: "var(--text-main)",
      }}
    >
      {/* image */}
      <div className="aspect-4/3 overflow-hidden rounded-md">
        <img
          src={p.image}
          alt={p.title}
          className="h-full w-full object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* store + stock badges */}
      <div className="flex flex-wrap gap-2 items-center mt-2">
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-(--color-primary)/10 text-(--color-primary-dark)">
          {p.storeName}
        </span>
        {!p.inStock && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
            Out of stock
          </span>
        )}
      </div>

      {/* title */}
      <h3
        className="text-base font-semibold line-clamp-1 group-hover:text-(--color-primary)
                   transition-colors duration-300"
      >
        {p.title}
      </h3>

      {/* prices */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg font-bold text-(--color-primary)">
          {money(p.price)}
        </span>
        {p.compareAtPrice && p.compareAtPrice > p.price && (
          <span className="text-sm text-(--text-secondary) line-through">
            {money(p.compareAtPrice)}
          </span>
        )}
      </div>

      {/* rating */}
      {p.rating && (
        <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_6px_var(--color-accent)]">
          <Rating value={p.rating.value} count={p.rating.count} />
        </div>
      )}

      {/* button */}
      <button
        onClick={(event) => {
          event.stopPropagation();
          addToCart(p.id);
        }}
        disabled={!p.inStock}
        className={`mt-auto rounded-md py-1.5 font-medium text-sm text-white transition-all duration-300 ${
          p.inStock
            ? "bg-linear-to-r from-(--color-primary) to-(--color-primary-dark) hover:shadow-[0_0_12px_var(--color-primary)]"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {p.inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}
