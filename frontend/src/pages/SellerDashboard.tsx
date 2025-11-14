import { CheckCircle2, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { useStore } from "../store/useStore";
import { money } from "../utils/format";
import type { Category, OrderStatus, Brand } from "../types";

const categoryOptions: Category[] = [
  "Tech",
  "Sound",
  "Home",
  "Sport",
  "Accessories",
  "Books",
  "Gifts",
];

const statusOptions: OrderStatus[] = [
  "Pending",
  "Dispatched",
  "Delivered",
  "Delivery Unsuccessful",
  "Canceled",
];

const brandOptions: Brand[] = [
  "Tech Hub",
  "KeyZone",
  "SoundWave",
  "DataHub",
  "ErgoWorks",
  "HomeLight",
];

type ProductFormState = {
  title: string;
  price: string;
  compareAtPrice: string;
  storeId: string;
  storeName: Brand;
  category: Category;
  stock: string;
  image: string;
};

export default function SellerDahsboard() {
  const products = useStore((s) => s.products);
  const orders = useStore((s) => s.orders);
  const addProduct = useStore((s) => s.addProduct);
  const removeProduct = useStore((s) => s.removeProduct);
  const updateProductDetails = useStore((s) => s.updateProductDetails);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);

  const [form, setForm] = useState<ProductFormState>({
    title: "",
    price: "0",
    compareAtPrice: "0",
    storeId: "tech-hub",
    storeName: "Tech Hub",
    category: "Tech" as Category,
    stock: "10",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60",
  });

  const handleFormChange = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) =>
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) return;

    const price = Number(form.price);
    const compareAtPrice = Number(form.compareAtPrice);
    const stock = Math.max(0, Number(form.stock));
    const newProductId = `p-${Date.now()}`;

    addProduct({
      id: newProductId,
      title: form.title,
      price: Number.isNaN(price) ? 0 : price,
      compareAtPrice:
        Number.isFinite(compareAtPrice) && compareAtPrice > price
          ? compareAtPrice
          : undefined,
      storeId: form.storeId,
      storeName: form.storeName,
      category: form.category,
      image: form.image,
      inStock: stock > 0,
      rating: { value: 0, count: 0 },
      stock,
    });

    setForm((prev) => ({
      ...prev,
      title: "",
      price: "0",
      compareAtPrice: "0",
      stock: "10",
    }));
  };

  return (
    <div className="min-h-screen bg-[#dfeeff]">
      <header className="border-b border-blue-900 bg-[#0c409f] px-4 py-6 text-white">
        <div className="mx-auto max-w-6xl space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.5em] text-blue-200">
            QuickShop Seller Hub
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Product & Order control
          </h1>
          <p className="text-base text-blue-100">
            Manage inventory, discounts, and order fulfillment with live
            controls.
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10">
        {/* Product management */}
        <section className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                Product management
              </p>
              <p className="text-lg font-bold text-slate-900">
                Add or update catalogue items
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Live inventory sync
            </div>
          </div>

          <form
            className="mt-6 grid gap-4 md:grid-cols-3"
            onSubmit={handleAddProduct}
          >
            {/* Product title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Product title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  handleFormChange("title", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="New listing name"
                required
              />
            </div>

            {/* Store name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Store name
              </label>
              <select
                value={form.storeName}
                onChange={(event) =>
                  handleFormChange("storeName", event.target.value as Brand)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Store ID */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Store ID
              </label>
              <input
                type="text"
                value={form.storeId}
                onChange={(event) =>
                  handleFormChange("storeId", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Price ($)
              </label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(event) =>
                  handleFormChange("price", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Compare-at */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Compare-at ($)
              </label>
              <input
                type="number"
                min={0}
                value={form.compareAtPrice}
                onChange={(event) =>
                  handleFormChange("compareAtPrice", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Inventory */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Inventory
              </label>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) =>
                  handleFormChange("stock", event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">
                Category
              </label>
              <select
                value={form.category}
                onChange={(event) =>
                  handleFormChange("category", event.target.value as Category)
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="space-y-2 md:col-span-3">
              <label className="text-xs font-semibold text-slate-600">
                Image URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(event) =>
                  handleFormChange("image", event.target.value)
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full rounded-full bg-[#0d4bc9] px-4 py-3 text-sm font-semibold text-white shadow hover:bg-[#0b3ba2]"
              >
                <Plus className="mr-2 inline-block h-4 w-4" aria-hidden />
                Add product
              </button>
            </div>
          </form>
        </section>

        {/* Inventory feed */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Inventory feed
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              Your product catalog
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sellerProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {product.storeName}
                    </p>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {product.title}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      product.inStock
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {product.inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {product.category ?? "General"}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#0d4bc9]">
                      {money(product.price)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Inventory: {product.stock}
                    </p>
                    {product.discountExpires && (
                      <p className="text-xs text-slate-500">
                        Discount ends{" "}
                        {new Date(product.discountExpires).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 text-xs font-semibold uppercase text-slate-500">
                    <button
                      type="button"
                      onClick={() =>
                        updateProductDetails(product.id, {
                          stock: product.inStock
                            ? 0
                            : Math.max(product.stock, 10),
                          inStock: product.inStock ? false : true,
                        })
                      }
                      className="rounded-full border border-slate-200 px-3 py-1 text-[11px] tracking-[0.5em]"
                    >
                      {product.inStock ? "Mark out" : "Restock"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateProductDetails(product.id, {
                          discounted: true,
                          discountExpires: new Date(
                            Date.now() + 7 * 24 * 60 * 60 * 1000
                          ).toISOString(),
                        })
                      }
                      className="rounded-full border border-slate-200 px-3 py-1 text-[11px] tracking-[0.5em]"
                    >
                      Add 7-day discount
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() =>
                      updateProductDetails(product.id, {
                        price: product.price * 0.95,
                        compareAtPrice: product.compareAtPrice ?? product.price,
                      })
                    }
                    className="rounded-full border border-blue-500 px-3 py-1 text-blue-600"
                  >
                    Deepen price
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    className="rounded-full border border-slate-200 px-3 py-1 text-slate-700"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        {/* Order management */}
        <section className="rounded-[32px] bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-500">
                Order management
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Customer orders
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600">
              <RefreshCw className="h-4 w-4" />
              Live sync
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-slate-200 bg-[#f7f9ff] p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                      {order.buyerName}
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      Order #{order.id}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-slate-600 sm:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Total</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {money(order.total)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">Items</p>
                    <p className="text-base font-semibold text-slate-900">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.4em]">
                      Delivery
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      {new Date(order.expectedDelivery).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-[0.4em] text-slate-500">
                      Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(
                          order.id,
                          event.target.value as OrderStatus
                        )
                      }
                      className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
