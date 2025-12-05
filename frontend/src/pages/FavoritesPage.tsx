import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import ProductCard from "../components/ProductCard";


export default function FavoritesPage() {
  const navigate = useNavigate();
  const favorites = useStore((s) => s.favorites);
  const products = useStore((s) => s.products);

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id ?? product._id)
  );

  if (!favoriteProducts.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#dfeeff] px-4 py-10 text-center">
        <h1 className="text-3xl font-bold">Favorites</h1>
        <p className="mt-3 text-slate-600">You have no favorites yet.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-[#0d4bc9] px-6 py-2 text-sm font-semibold text-white"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dfeeff] px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Favorites</h1>
          <p className="text-sm text-slate-600">{favoriteProducts.length} products saved</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => navigate(`/product/${product.id ?? product._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  
}
