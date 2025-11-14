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
          </form>
        </section>
      </main>
    </div>
  );
}
