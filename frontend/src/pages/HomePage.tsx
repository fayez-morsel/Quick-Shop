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
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useProductStore, useUIStore } from "../store";
import type { Category } from "../types";
import { imageVariants, itemVariants, staggerList } from "../animations/variants";
import MotionSection from "../components/MotionSection";

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
  const productIds = useProductStore((s) => s.productIds);
  const navigate = useNavigate();
  const setCategory = useUIStore((s) => s.setCategory);
  const setBrand = useUIStore((s) => s.setBrand);
  const setQuery = useUIStore((s) => s.setQuery);

  const featuredIds = productIds.slice(0, 8);

  const handleCategorySelect = (value: Category) => {
    setCategory([value]);
    setBrand("all");
    setQuery("");
    navigate("/product");
  };

  return (
    <div className="bg-[#dfeeff] pb-10">
      {/* Hero banner*/}
      <MotionSection className="w-full bg-linear-to-r from-[#1E88E5] to-[#0D47A1] px-6 py-16 text-white shadow-lg">
        <div className="mx-auto max-w-5xl space-y-4">
          <motion.h1
            className="mt-4 font-bold leading-snug"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}
            variants={itemVariants}
          >
            Discover Amazing Products from Trusted Stores
          </motion.h1>
          <motion.p
            className="mt-4 max-w-2xl text-base text-blue-100 sm:text-lg"
            style={{ fontSize: "clamp(0.75rem, 2vw, 1.5rem)" }}
            variants={itemVariants}
          >
            Shop the latest products from verified sellers. Quality guaranteed,
            fast shipping, and exceptional customer service.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap gap-4" variants={staggerList}>
            <motion.button
              type="button"
              onClick={() => navigate("/product")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#0a45c5] shadow transition duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/70"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Shop Now
              <ArrowRight className="h-4 w-4" aria-hidden />
            </motion.button>
            <motion.button
              type="button"
              onClick={() =>
                navigate("/login", { state: { role: "seller" } })
              }
              className="rounded-full border border-white/60 px-8 py-3 text-sm font-semibold text-white transition duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white/10 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white/70"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Become a seller
            </motion.button>
          </motion.div>
        </div>
      </MotionSection>

      <div className="flex flex-col gap-12 px-0 pt-10">
        <MotionSection className="w-full space-y-6 px-6 py-10 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          <div className="mx-auto max-w-6xl space-y-6">
            <motion.div className="text-center" variants={itemVariants}>
              <h2 className="text-3xl font-semibold text-slate-900">Shop by Category</h2>
            </motion.div>
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-5 overflow-x-auto pb-4 pr-4 sm:gap-6 sm:pr-6 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pr-0"
                variants={staggerList}
              >
                {categoryOptions.map(({ label, value, Icon, accent, iconColor }) => (
                  <motion.button
                    type="button"
                    key={`${label}-${value}`}
                    onClick={() => handleCategorySelect(value)}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="shrink-0 w-[200px] cursor-pointer rounded-[28px] border border-white bg-white px-5 py-6 text-center shadow-sm transition duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-300 lg:w-auto"
                  >
                    <motion.span
                      className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${accent}`}
                      variants={imageVariants}
                    >
                      <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden />
                    </motion.span>
                    <p className="text-base font-semibold text-slate-900">{label}</p>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </MotionSection>

        <MotionSection className="mx-auto w-full max-w-6xl space-y-6 px-4">
          <motion.div className="flex flex-wrap items-center gap-3" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="cursor-pointer text-sm font-semibold text-[#0a45c5] transition duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:scale-[1.02] hover:underline"
              >
                View all
              </button>
            </div>
          </motion.div>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={staggerList}
          >
            {featuredIds.map((id, index) => (
              <ProductCard
                key={id}
                productId={id}
                animationOrder={index}
                onSelect={(product) => navigate(`/product/${product.id}`)}
              />
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection className="w-full px-6 py-10 text-center">
          <div className="mx-auto max-w-6xl space-y-10">
            <motion.h2 className="text-3xl font-bold text-slate-900" variants={itemVariants}>
              Why Choose QuickShop?
            </motion.h2>
            <motion.div className="mt-10 grid gap-6 sm:grid-cols-3" variants={staggerList}>
              {highlights.map(({ title, description, icon: Icon }) => (
                <motion.div
                  key={title}
                  className="space-y-4 rounded-3xl bg-white/70 px-4 py-6 shadow-sm ring-1 ring-white/50 transition duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-1 hover:shadow-xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e3f0ff] text-[#0a45c5] shadow-inner shadow-white/50">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                  <p className="text-sm text-slate-500">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </MotionSection>
      </div>

    </div>
  );
}
