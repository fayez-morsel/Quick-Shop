import React from "react";
import type { Product } from "../types";
import Badge from "./Badge";
import Rating from "./Rating";
import { money } from "../utils/format";
import { useStore } from "../store/useStore";

export default function ProductCard({ p }: { p: Product }) {
  const addToCart = useStore((s) => s.addToCart);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 hover:shadow-md transition">
      {/* image */}
      <div className="aspect-4/3 overflow-hidden rounded-md bg-gray-100">
        <img
          src={p.image}
          alt={p.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Store + title */}
      <div className="flex flex-wrap gap-2 items-center">
        <Badge>{p.storeName}</Badge>
        {!p.inStock && <Badge>OUt of stock</Badge>}
      </div>
      <h3 className="text-base font-semibold line-clamp-1">{p.title}</h3>

      {/* prices */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{money(p.price)}</span>
        {p.compareAtPrice && p.compareAtPrice > p.price && (
          <span className="text-sm text-gray-500 line-through">
            {money(p.compareAtPrice)}
          </span>
        )}
      </div>
    </div>
  );
}
