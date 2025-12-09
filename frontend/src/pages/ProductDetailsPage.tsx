import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore, useCartStore, useOrderStore, useProductStore } from "../store";
import { money } from "../utils/format";
import Rating from "../components/Rating";
import { apiAddReview, apiGetReviews } from "../api/reviews";

type Review = {
  id: string;
  rating: number;
  content?: string;
  authorName: string;
  authorEmail?: string;
  createdAt?: string;
  orderId?: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProductStore((s) => (id ? s.productsMap[id] : undefined));
  const productId = product?.id ?? id ?? "";
  const addToCart = useCartStore((s) => s.addToCart);
  const userName = useAuthStore((s) => s.userName);
  const userEmail = useAuthStore((s) => s.userEmail);
  const orders = useOrderStore((s) => s.orders);
  const fetchBuyerOrders = useOrderStore((s) => s.fetchBuyerOrders);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [quantity, setQuantity] = useState(1);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reviewedOrderIds, setReviewedOrderIds] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const productImages = product
    ? product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : []
    : [];
  useEffect(() => {
    setActiveImageIndex(0);
  }, [productId, productImages.length]);
  const showCarouselControls = productImages.length > 1;
  const goToPreviousImage = () => {
    if (!productImages.length) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };
  const goToNextImage = () => {
    if (!productImages.length) return;
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };
  useEffect(() => {
    if (productImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [productImages.length]);

  const currentImage = productImages[activeImageIndex] ?? product?.image ?? "";
  const isOutOfStock = !product?.inStock || (product?.stock ?? 0) <= 0;
  const maxQuantity = Math.max(product?.stock ?? 0, 0);
  const blockedCursor =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18'%3E%F0%9F%9A%AB%3C/text%3E%3C/svg%3E\") 12 12, not-allowed";

  useEffect(() => {
    // Reset quantity when product changes or goes out of stock
    if (isOutOfStock) {
      setQuantity(0);
    } else {
      setQuantity(1);
    }
  }, [productId, isOutOfStock]);

  const normalizedEmail = (userEmail ?? "").trim().toLowerCase();
  const eligibleOrders =
    normalizedEmail.length > 0
      ? orders.filter(
          (order) =>
            order.status === "Delivered" &&
            ((order.buyerEmail ?? userEmail ?? "") as string)
              .toLowerCase() === normalizedEmail &&
            order.items.some((item) => item.productId === productId)
        )
      : [];
  const availableOrders = eligibleOrders.filter(
    (order) => !reviewedOrderIds.includes(order.id)
  );

  const reviewFormLocked = availableOrders.length === 0;
  const reviewLockMessage = !normalizedEmail
    ? "Sign in and purchase this product to leave a review."
    : eligibleOrders.length === 0
    ? "You can review after the order is delivered."
    : "You already reviewed all delivered orders for this product.";

  useEffect(() => {
    if (!reviewFormLocked) {
      setReviewError("");
    }
  }, [reviewFormLocked]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchBuyerOrders();
    }
  }, [fetchBuyerOrders, isAuthenticated]);

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const res = await apiGetReviews(productId);
      const normalized =
        (res.data ?? []).map((rev: any) => ({
          id: rev._id ?? `${rev.user?._id ?? ""}-${rev.createdAt}`,
          rating: rev.rating ?? 0,
          content: rev.comment ?? "",
          authorName: rev.user?.name ?? "Verified buyer",
          authorEmail: rev.user?.email ?? "hidden",
          orderId:
            rev.order?._id ??
            (typeof rev.order === "string" ? rev.order : undefined),
          createdAt: rev.createdAt,
        })) ?? [];
      setReviewList(normalized);
      const reviewedForUser =
        normalizedEmail.length > 0
          ? normalized
              .filter(
                (rev: Review) =>
                  (rev.authorEmail ?? "").toLowerCase() === normalizedEmail &&
                  rev.orderId
              )
              .map((rev: Review) => rev.orderId as string)
          : [];
      setReviewedOrderIds(reviewedForUser);
      setReviewError("");
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        "Unable to load reviews right now.";
      setReviewError(message);
    } finally {
      setReviewsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (reviewFormLocked) {
      setSelectedOrderId(null);
      return;
    }
    if (
      selectedOrderId &&
      availableOrders.some((order) => order.id === selectedOrderId)
    ) {
      return;
    }
    setSelectedOrderId(availableOrders[0]?.id ?? null);
  }, [availableOrders, reviewFormLocked, selectedOrderId]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eaf4ff] text-slate-900">
        <p className="text-xl font-semibold">Product not found.</p>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (reviewFormLocked) {
      setReviewError(reviewLockMessage);
      return;
    }
    if (!reviewContent.trim()) {
      setReviewError("Please share your experience before submitting.");
      return;
    }
    if (!selectedOrderId) {
      setReviewError("Select an order to submit your review.");
      return;
    }
    if (reviewedOrderIds.includes(selectedOrderId)) {
      setReviewError("You've already reviewed this order for this product.");
      return;
    }
    setReviewError("");

    void (async () => {
      try {
        await apiAddReview(
          productId,
          selectedOrderId,
          reviewRating,
          reviewContent.trim()
        );
        setReviewContent("");
        setReviewedOrderIds((prev) => [...prev, selectedOrderId]);
        await loadReviews();
        await fetchProducts();
      } catch (error: any) {
        const message =
          error?.response?.data?.error ??
          "We couldn't submit your review. Please try again.";
        setReviewError(message);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-[#d9ebff]">
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
        <section className="grid gap-8 rounded-4xl bg-white p-6 shadow-xl md:grid-cols-[1fr_1fr]">
          <div className="h-[60vh] overflow-hidden rounded-3xl bg-slate-50">
            <div className="relative h-full">
              <img
                src={currentImage}
                alt={product.title}
                className="h-full w-full object-cover transition duration-500"
              />
              {showCarouselControls && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {productImages.map((_, index) => (
                      <span
                        key={`indicator-${index}`}
                        className={`h-2 w-8 rounded-full transition ${
                          index === activeImageIndex
                            ? "bg-white"
                            : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
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
              {isOutOfStock && (
                <p className="text-sm font-semibold text-rose-600">
                  Currently out of stock
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
                onClick={() => setQuantity((q) => Math.max(isOutOfStock ? 0 : 1, q - 1))}
                disabled={isOutOfStock}
                style={isOutOfStock ? { cursor: blockedCursor } : undefined}
                className="h-10 w-10 rounded-full border border-slate-300 text-xl font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={isOutOfStock || quantity >= maxQuantity}
                style={isOutOfStock ? { cursor: blockedCursor } : undefined}
                className="h-10 w-10 rounded-full border border-slate-300 text-xl font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  addToCart(product.id, quantity || 1);
                }}
                disabled={isOutOfStock}
                style={isOutOfStock ? { cursor: blockedCursor } : undefined}
                className="cursor-pointer rounded-full bg-[#0d4bc9] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isOutOfStock ? "Out of stock" : "Add to cart"}
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
            {reviewFormLocked ? (
              <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Reviews unlock after delivery.
                </p>
                <p className="text-xs text-slate-600">{reviewLockMessage}</p>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="inline-flex items-center justify-center rounded-full bg-slate-800 px-5 py-2 text-xs font-semibold text-white"
                >
                  Submit review
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-600">
                    Delivered order
                  </label>
                  <select
                    value={selectedOrderId ?? ""}
                    onChange={(event) =>
                      setSelectedOrderId(
                        event.target.value ? event.target.value : null
                      )
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    {availableOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id} -{" "}
                        {new Date(order.placedAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-500">
                    One review per delivered order for this product.
                  </p>
                </div>
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
                  className="inline-flex items-center justify-center rounded-full bg-[#0d4bc9] px-6 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
                  disabled={!selectedOrderId}
                >
                  Submit Review
                </button>
              </>
            )}
            {reviewError && (
              <p className="text-xs text-rose-500">{reviewError}</p>
            )}
          </div>
          {reviewsLoading && (
            <p className="text-sm text-slate-500">Loading reviews...</p>
          )}
          {!reviewsLoading && reviewList.length > 0 && (
            <div className="mt-6 space-y-4">
              {reviewList.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Rating value={rev.rating} count={0} />
                    <span className="text-xs text-slate-500">
                      {rev.authorName}
                      {rev.authorEmail ? ` - ${rev.authorEmail}` : ""}
                      {rev.createdAt
                        ? ` • ${new Date(rev.createdAt).toLocaleDateString()}`
                        : ""}
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


