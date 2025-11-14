import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";
import Rating from "../components/Rating";

type Review = {
  rating: number;
  content: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const product = useStore((s) => s.products.find((p) => p.id === id));


  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf4ff] text-slate-900">
        <p className="text-xl font-semibold">Product not found.</p>
      </div>
    );
  }

 

  return (
    <div className="min-h-screen bg-[#d9ebff]">
      <header className="border-b border-blue-900 bg-[#0c409f] px-4 py-4 text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 text-lg font-semibold">
          <span className="text-emerald-200">Shop</span>
          <span className="text-yellow-300">Up</span>
        </div>
      </header>

    
    </div>
  );
}
