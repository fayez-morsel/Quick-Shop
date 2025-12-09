import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useFavoriteStore, useProductStore } from "../store";
import { useMemo } from "react";


export default function FavoritesPage() {
  const navigate = useNavigate();
  const favoritesMap = useFavoriteStore((s) => s.favoritesMap);
  const productsMap = useProductStore((s) => s.productsMap);

  const favoriteProducts = useMemo(
    () =>
      Object.keys(favoritesMap)
        .filter((id) => favoritesMap[id])
        .map((id) => productsMap[id])
        .filter(Boolean),
    [favoritesMap, productsMap]
  );

  const count = favoriteProducts.length;

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
          <p className="text-sm text-slate-600">{count} products saved</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              onSelect={() => navigate(`/product/${product.id ?? product._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  
}
