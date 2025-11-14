import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Dumbbell,
  Gift,
  Home as HomeIcon,
  Laptop,
  Shirt,
  Shield,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../store/useStore";
import type { Category } from "../types";

const categoryOptions: {
  label: string;
  value: Category;
  Icon: LucideIcon;
  accent: string;
  iconColor: string;
}[] = [
  {
    label: "Electronics",
    value: "Tech",
    Icon: Laptop,
    accent: "bg-[#dce7ff]",
    iconColor: "text-[#1d4ed8]",
  },
  {
    label: "Sports",
    value: "Sport",
    Icon: Dumbbell,
    accent: "bg-[#e3f8ef]",
    iconColor: "text-[#059669]",
  },
  {
    label: "Home",
    value: "Home",
    Icon: HomeIcon,
    accent: "bg-[#fff8dc]",
    iconColor: "text-[#ca8a04]",
  },
  {
    label: "Fashion",
    value: "Accessories",
    Icon: Shirt,
    accent: "bg-[#ffe9f2]",
    iconColor: "text-[#be185d]",
  },
  {
    label: "Books",
    value: "Books",
    Icon: BookOpen,
    accent: "bg-[#ede9fe]",
    iconColor: "text-[#6d28d9]",
  },
  {
    label: "Gifts",
    value: "Gifts",
    Icon: Gift,
    accent: "bg-[#ffe5e0]",
    iconColor: "text-[#dc2626]",
  },
];

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
  const navigate = useNavigate();
  const setCategory = useStore((s) => s.setCategory);
  const setBrand = useStore((s) => s.setBrand);
  const setQuery = useStore((s) => s.setQuery);

  const featured = products.slice(0, 8);

  const handleCategorySelect = (value: Category) => {
    setCategory([value]);
    setBrand("all");
    setQuery("");
    navigate("/product");
  };

  return (
    <div className="bg-[#dfeeff] pb-10">
      {/* Hero banner*/}
      <section className="w-full bg-linear-to-r from-[#0b4fd3] via-[#0d6ef6] to-[#0b39a2] px-6 py-16 text-white shadow-lg">
        <div className="mx-auto max-w-5xl">
          <h1
            className="mt-4 font-bold leading-snug"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}
          >
            Discover Amazing Products from Trusted Stores
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg"
          style={{ fontSize: "clamp(0.75rem, 2vw, 1.5rem)" }}>
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
              onClick={() =>
                navigate("/login", { state: { role: "seller" } })
              }
              className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Become a seller
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-12 px-0 pt-10">
        <section className="w-full space-y-6   px-6 py-10 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-slate-900">Shop by Category</h2>
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-5 overflow-x-auto pb-4 pr-4 sm:gap-6 sm:pr-6 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pr-0">
                {categoryOptions.map(({ label, value, Icon, accent, iconColor }) => (
                  <button
                    type="button"
                    key={`${label}-${value}`}
                    onClick={() => handleCategorySelect(value)}
                    className="shrink-0 w-[200px] rounded-[28px] border border-white bg-white px-5 py-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-300 lg:w-auto"
                  >
                    <span
                      className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${accent}`}
                    >
                      <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden />
                    </span>
                    <p className="text-base font-semibold text-slate-900">{label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl space-y-6 px-4">
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
                onSelect={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </section>

        <section className="w-full px-6 py-10 text-center">
          <div className="mx-auto max-w-6xl space-y-10">
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
          </div>
        </section>
      </div>

    </div>
  );
}
