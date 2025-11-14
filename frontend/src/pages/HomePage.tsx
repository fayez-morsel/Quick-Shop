import { ArrowRight, CheckCircle2, Dumbbell, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";
import { useStore } from "../store/useStore";
import type { Product } from "../types";

const categories = Array.from({ length: 6 }, () => ({
  label: "sport",
  icon: Dumbbell,
}));

const highlights = [
  {
    title: "Verified Sellers",
    description:
      "All sellers are vetted so you only shop authentic, high-quality products.",
    icon: CheckCircle2,
  },
  {
    title: "Fast Shipping",
    description: "Lightning-fast delivery with reliable, tracked logistics.",
    icon: Zap,
  },
  {
    title: "Secure Payments",
    description: "Industry-standard encryption keeps every transaction safe.",
    icon: Shield,
  },
];

export default function HomePage() {
  const products = useStore((s) => s.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const featured = products.slice(0, 8);

  return (
    <div className="bg-[#dfeeff] pb-10">
      {/* Hero banner full width */}
      <section className="w-full bg-linear-to-r from-[#0b4fd3] via-[#0d6ef6] to-[#0b39a2] px-6 py-16 text-white shadow-lg">
          <div className="mx-auto max-w-5xl">
            <h1
              className="mt-4 font-extrabold leading-snug"
              style={{ fontSize: "clamp(2.75rem, 5vw, 4.5rem)" }}
            >
              Discover Amazing Products from Trusted Stores
            </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            Shop the latest products from verified sellers. Quality guaranteed,
            fast shipping, and exceptional customer service.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#0a45c5] shadow hover:bg-blue-50"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pt-10">
        {/* Categories */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 pb-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6">
            {categories.map(({ label, icon: Icon }, index) => (
              <div
                key={`${label}-${index}`}
                className="rounded-4xl bg-white p-6 text-center shadow-sm ring-1 ring-blue-50 transition hover:-translate-y-1 hover:shadow-md"
              >
                <span
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f1ff] text-[#0a45c5]"
                >
                  <Icon className="h-8 w-8" aria-hidden />
                </span>
                <p className="text-base font-semibold capitalize text-slate-900">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="text-sm font-semibold text-[#0a45c5] hover:underline"
              >
                View all
              </button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </div>
        </section>

        {/* Why choose */}
        <section className="rounded-4xl bg-white/80 px-6 py-10 text-center shadow">
          <h2 className="text-3xl font-bold text-slate-900">Why Choose ShopHub?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {highlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="space-y-4 px-4">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f0ff] text-[#0a45c5]">
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
