import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";
import Rating from "../components/Rating";

type Review = {
  rating: number;
  content: string;
  authorName: string;
  authorEmail: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useStore((s) => s.products.find((p) => p.id === id));
  const addToCart = useStore((s) => s.addToCart);
  const userName = useStore((s) => s.userName);
  const userEmail = useStore((s) => s.userEmail);

  const [quantity, setQuantity] = useState(1);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf4ff] text-slate-900">
        <p className="text-xl font-semibold">Product not found.</p>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!reviewContent.trim()) return;
    const authorName = userName || "Quick Shopper";
    const authorEmail = userEmail || "feedback@shopup.com";
    setReviewList((prev) => [
      ...prev,
      {
        rating: reviewRating,
        content: reviewContent.trim(),
        authorName,
        authorEmail,
      },
    ]);
    setReviewContent("");
  };

  return (
    <div className="min-h-screen bg-[#d9ebff]">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
        <section className="grid gap-8 rounded-4xl bg-white p-6 shadow-xl md:grid-cols-[1fr_1fr]">
          <div className="h-[60vh] overflow-hidden rounded-3xl bg-slate-50">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                {product.storeName}
              </p>
              <h1 className="text-4xl font-semibold text-slate-900">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <Rating
                  value={product.rating?.value ?? 0}
                  count={product.rating?.count ?? 0}
                />
              </div>
              <p className="text-3xl font-bold text-[#0d4bc9]">
                {money(product.price)}
              </p>
              {product.discounted && (
                <p className="text-sm text-emerald-600">
                  Discounted Price Available
                </p>
              )}
            </div>

            <div className="space-y-3 rounded-[20px] bg-[#f0f4ff] p-4">
              <p className="text-sm text-slate-500">Description</p>
              <p className="text-base text-slate-700">
                {product.tagline ?? "High quality product crafted for you."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {product.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Seller</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {product.storeName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-10 w-10 rounded-full border border-slate-300 text-xl font-semibold"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-10 w-10 rounded-full border border-slate-300 text-xl font-semibold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  addToCart(product.id);
                  navigate("/product");
                }}
                className="rounded-full bg-[#0d4bc9] px-6 py-3 text-sm font-semibold text-white"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="rounded-full border border-slate-400 px-6 py-3 text-sm font-semibold text-slate-700"
              >
                Go to products
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-4xl bg-white p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900">
            Customer Reviews
          </h2>
          <p className="text-sm text-slate-500">Write a review</p>
          <p className="text-xs text-slate-400">
            Signed in as {userName || "guest"} ({userEmail || "private"})
          </p>
          <div className="mt-4 space-y-3 rounded-3xl bg-[#f0f5ff] p-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600">
                Rating
              </label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600">
                Your review
              </label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="mt-1 h-24 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
                placeholder="Share your thoughts..."
              />
            </div>
            <button
              type="button"
              onClick={handleSubmitReview}
              className="inline-flex items-center justify-center rounded-full bg-[#0d4bc9] px-6 py-2 text-sm font-semibold text-white"
            >
              Submit Review
            </button>
          </div>
          {reviewList.length > 0 && (
            <div className="mt-6 space-y-4">
              {reviewList.map((rev, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Rating value={rev.rating} count={0} />
                    <span className="text-xs text-slate-500">
                      {rev.authorName} - {rev.authorEmail}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{rev.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
