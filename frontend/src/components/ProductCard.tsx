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
    </div>
  );
}
