import { useStore } from "../store/useStore";
import { money } from "../utils/format";

export default function HomePage() {
  const products = useStore((s) => s.products);

  return (
    <div className="flex flex-col gap-12">
      {/* HERO SECCTION */}
      <section className="bg=blue-600 text-white text-center rounded-xl py-16 px-6">
        <h1 className="text-3xl font-bold mb-3">
          Discover Amazing Products from Trusted Stores
        </h1>
        <p className="max-w-2xl mx-auto text-blue-100 mb-6">
          Shop the latest products from verified sellers. Quality guaranteed,
          fast shipping, and exceptional customer service.
        </p>
        <div className="flex justify-center gap-3">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50">
            Shop Now
          </button>
          <button className="border border-white px-4 py-2 rounded-md font-medium hover:bg-white/10">
            Become a Seller
          </button>
        </div>
      </section>
    </div>
  );
}
