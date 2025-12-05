import { Heart, ShoppingCart } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { Product } from "../types";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";
import Rating from "./Rating";
import { useNavigate } from "react-router-dom";

type Props = {
  product: Product;
  onSelect?: (product: Product) => void;
};

export default function ProductCard({ product, onSelect }: Props) {
  const addToCart = useStore((s) => s.addToCart);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const tagline =
    product.tagline ?? `High-quality ${(product.category ?? "Product").toLowerCase()} gear crafted for you.`;
  const productId = product.id ?? product._id;
  const isFavorite = favorites.includes(productId);
  const isClickable = Boolean(onSelect);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const blockedCursor =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3E%F0%9F%9A%AB%3C/text%3E%3C/svg%3E\") 12 12, not-allowed";
  const hasDiscount =
    Boolean(product.discounted) &&
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;
  const discountPercent =
    hasDiscount && product.compareAtPrice
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : null;
  const imageSources =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [productId, imageSources.length]);

  useEffect(() => {
    if (imageSources.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % imageSources.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [imageSources.length]);

  const [isPressingFavorite, setIsPressingFavorite] = useState(false);

  const handleClick = () => {
    if (onSelect) onSelect(product);
  };

  const handleToggleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleFavorite(productId);
  };

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addToCart(productId);
  };

  return (
    <article
      className={clsx(
        "group flex h-full min-h-[520px] flex-col overflow-hidden rounded-4xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl",
        isClickable && "cursor-pointer focus-visible:outline focus-visible:outline-blue-300"
      )}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (!isClickable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className="relative w-full overflow-hidden rounded-t-4xl"
        style={{ aspectRatio: "3 / 2" }}
      >
        {imageSources.length > 0 ? (
          <>
            <img
              src={imageSources[activeIndex] ?? imageSources[0]}
              alt={product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {imageSources.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
                {imageSources.map((_, idx) => (
                  <button
                    key={`dot-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className={`h-2 w-2 rounded-full transition ${
                      idx === activeIndex ? "bg-white" : "bg-white/60"
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="grid h-full place-items-center bg-slate-100 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            No image
          </div>
        )}
        <button
          type="button"
          onClick={handleToggleFavorite}
          onMouseEnter={() => setIsPressingFavorite(true)}
          onMouseDown={() => setIsPressingFavorite(true)}
          onMouseUp={() => setIsPressingFavorite(false)}
          onMouseLeave={() => setIsPressingFavorite(false)}
          className={clsx(
            "absolute right-4 top-4 rounded-full border border-white/70 bg-white/90 p-2 shadow transition cursor-pointer",
            isFavorite || isPressingFavorite ? "text-rose-500 shadow-lg" : "text-slate-500"
          )}
          aria-pressed={isFavorite}
          aria-label="Toggle favorite"
        >
          <Heart
            className="h-4 w-4 transition-all duration-200 ease-in-out"
            fill={isFavorite || isPressingFavorite ? "currentColor" : "none"}
            strokeWidth={1.5}
            aria-hidden
          />
        </button>
        {hasDiscount && (
          <span className="absolute left-4 bottom-4 rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg">
            {discountPercent ? `${discountPercent}% OFF` : "Sale"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold text-slate-900">{product.title}</h3>
          <p className="text-sm text-slate-500">{tagline}</p>
        </div>

        {product.rating && (
          <Rating value={product.rating.value} count={product.rating.count} />
        )}

        <div className="space-y-0.5">
          <p className="text-2xl font-bold text-[#0d4bc9]">{money(product.price)}</p>
          <p className="text-sm text-slate-500">{product.storeName}</p>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          style={!product.inStock ? { cursor: blockedCursor } : undefined}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0d47a1] px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#0b3ba2] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart className="h-5 w-5" aria-hidden />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
