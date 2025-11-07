import { useState } from "react";
import type { Product } from "../types";
import { useStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";
import ProductDetails from "../components/ProductDetails";

export default function HomePage() {
  const products = useStore((s) => s.products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => setSelectedProduct(product);
  const handleCloseDetails = () => setSelectedProduct(null);

  return (
    <div className="flex flex-col gap-12">
      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-lg
        bg-linear-to-r
        from-(--color-primary-dark)
        via-(--color-primary)
        to-indigo-600
        text-white text-center py-20 px-6 shadow-lg"
      >
        <div className="absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-30" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Discover Amazing Products from{" "}
            <span className="text-(--color-accent)">Trusted Stores</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Shop the latest items from verified sellers — enjoy quality, fast shipping,
            and secure payments, all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-(--color-primary) px-6 py-2.5 rounded-md font-semibold text-sm sm:text-base hover:bg-blue-50 transition">
              🛍️ Shop Now
            </button>
            <button className="border border-white px-6 py-2.5 rounded-md font-semibold text-sm sm:text-base hover:bg-white/10 transition">
              Become a Seller
            </button>
          </div>
        </div>
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-(--color-primary)/20 blur-3xl rounded-full animate-float" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full animate-float" />
      </section>

      {/* CATEGORY CHIPS */}
      <section className="text-center">
        <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Tech", "Fashion", "Home", "Sport", "Beauty", "Toys"].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 bg-(--color-primary)/10 text-(--color-primary-dark) rounded-full text-sm font-medium hover:bg-(--color-primary)/20 transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
      

      {/* FEATURED PRODUCTS */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <button className="text-(--color-primary) text-sm hover:underline">
            View all
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} p={p} onSelect={handleSelectProduct} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-(--color-primary)/5 rounded-lg p-8 text-center grid sm:grid-cols-3 gap-6">
        <div>
          <div className="text-(--color-primary) text-4xl mb-2">🛍</div>
          <h3 className="font-semibold">Verified Sellers</h3>
          <p className="text-gray-600 text-sm">
            Buy only from verified and trusted stores.
          </p>
        </div>
        <div>
          <div className="text-(--color-primary) text-4xl mb-2">🚚</div>
          <h3 className="font-semibold">Fast Shipping</h3>
          <p className="text-gray-600 text-sm">
            Get your products quickly and safely.
          </p>
        </div>
        <div>
          <div className="text-(--color-primary) text-4xl mb-2">💳</div>
          <h3 className="font-semibold">Secure Payments</h3>
          <p className="text-gray-600 text-sm">
            Your information is encrypted and protected.
          </p>
        </div>
      </section>
      <ProductDetails product={selectedProduct} onClose={handleCloseDetails} />
    </div>
  );
}
