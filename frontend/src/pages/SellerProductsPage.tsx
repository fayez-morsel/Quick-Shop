import { Plus, Search, Trash2, Pencil, X } from "lucide-react";
import { useMemo, useState } from "react";
import SellerLayout from "../components/SellerLayout";
import { useScopedOrders } from "../hooks/useScopedOrders";
import { money } from "../utils/format";
import { useStore } from "../store/useStore";
import type { Category } from "../types";

type TableProduct = {
  rawId: string;
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: "active" | "inactive";
};

type ProductFormState = {
  name: string;
  category: Category | "";
  price: string;
  stock: string;
  imageUrls: string[];
};

const statusStyles: Record<TableProduct["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
};

const categoryOptions: Category[] = [
  "Tech",
  "Sound",
  "Home",
  "Sport",
  "Accessories",
  "Books",
  "Gifts",
];

const formatProductId = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  const padded = numeric.padStart(3, "0");
  return `PRD-${padded}`;
};

const initialFormState: ProductFormState = {
  name: "",
  category: "Tech",
  price: "",
  stock: "",
  imageUrls: [""],
};

export default function SellerProductsPage() {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const removeProduct = useStore((state) => state.removeProduct);
  const updateProductDetails = useStore((state) => state.updateProductDetails);
  const { scopedOrders: sellerOrders } = useScopedOrders();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formState, setFormState] = useState<ProductFormState>(initialFormState);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const tableProducts = useMemo(() => {
    const salesByProduct = sellerOrders.reduce<Record<string, number>>((acc, order) => {
      order.items.forEach((item) => {
        acc[item.productId] = (acc[item.productId] ?? 0) + item.qty;
      });
      return acc;
    }, {});

    return products.map<TableProduct>((product) => ({
      rawId: product.id,
      id: formatProductId(product.id),
      name: product.title,
      category: product.category ?? "General",
      price: product.price,
      stock: product.stock,
      sales: salesByProduct[product.id] ?? 0,
      status: product.stock > 0 ? "active" : "inactive",
    }));
  }, [sellerOrders, products]);

  const filteredProducts = tableProducts.filter((product) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    return (
      product.name.toLowerCase().includes(normalized) ||
      product.category.toLowerCase().includes(normalized) ||
      product.id.toLowerCase().includes(normalized)
    );
  });

  const emptyFormState = (): ProductFormState => ({
    ...initialFormState,
    imageUrls: [""],
  });

  const handleFormClose = () => {
    setFormOpen(false);
    setFormState(emptyFormState());
    setEditingProductId(null);
    setFormMode("add");
  };

  const handleEditProduct = (productId: string) => {
    const target = products.find((product) => product.id === productId);
    if (!target) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormMode("edit");
    setEditingProductId(target.id);
    setFormState({
      name: target.title,
      category: target.category ?? initialFormState.category,
      price: target.price.toString(),
      stock: target.stock.toString(),
      imageUrls:
        target.images && target.images.length
          ? [...target.images]
          : target.image
          ? [target.image]
          : [""],
    });
    setFormOpen(true);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setFormState((prev) => {
      const updated = [...prev.imageUrls];
      updated[index] = value;
      return { ...prev, imageUrls: updated };
    });
  };

  const handleAddImageField = () => {
    setFormState((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const handleRemoveImageField = (index: number) => {
    setFormState((prev) => {
      if (prev.imageUrls.length === 1) return prev;
      return {
        ...prev,
        imageUrls: prev.imageUrls.filter((_, idx) => idx !== index),
      };
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
              resolve(result);
            } else {
              reject(new Error("Failed to read file"));
            }
          };
          reader.onerror = () =>
            reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((urls) => {
        setFormState((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...urls],
        }));
      })
      .catch(() => {
        // ignore individual failures
      });
  };

  const handleFormSubmit = () => {
    const price = Number(formState.price);
    const stock = Number(formState.stock);
    if (!formState.name || Number.isNaN(price) || Number.isNaN(stock)) {
      return;
    }
    const normalizedCategory: Category | undefined = categoryOptions.includes(
      formState.category as Category
    )
      ? (formState.category as Category)
      : undefined;
    const imageUrls = formState.imageUrls.map((url) => url.trim()).filter(Boolean);
    const fallbackImageUrl = products[0]?.images?.[0] ?? products[0]?.image ?? "";
    const normalizedImages = imageUrls.length
      ? imageUrls
      : fallbackImageUrl
      ? [fallbackImageUrl]
      : [];

    if (formMode === "edit" && editingProductId) {
      updateProductDetails(editingProductId, {
        title: formState.name,
        category: normalizedCategory,
        price,
        stock,
        images: normalizedImages,
      });
    } else {
      const fallbackStore = {
        storeId: "tech-hub",
        storeName: "Tech Hub",
      } as const;
      const defaultStore = products[0] ?? fallbackStore;
      addProduct({
        id: `new-${Date.now()}`,
        title: formState.name,
        price,
        storeId: defaultStore.storeId,
        storeName: defaultStore.storeName,
        category: normalizedCategory,
        stock,
        inStock: stock > 0,
        image: normalizedImages[0] ?? fallbackImageUrl,
        images: normalizedImages,
      });
    }

    handleFormClose();
  };

  const handleDeleteProduct = (productId: string) => {
    removeProduct(productId);
    if (editingProductId === productId) {
      handleFormClose();
    }
  };

  return (
    <SellerLayout activeLink="Products">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
            <p className="text-sm text-slate-500">Manage your product inventory</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormMode("add");
              setEditingProductId(null);
              setFormState(emptyFormState());
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-3xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-[0_20px_35px_rgba(37,99,235,0.35)] transition hover:bg-[#1d4ed8]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </header>

        {formOpen && (
          <section className="rounded-4xl bg-[#f8fafc] p-6 shadow-inner shadow-slate-200/40">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                  {formMode === "add" ? "Add a product" : "Edit product"}
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {formMode === "add" ? "Create new inventory item" : "Update product"}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleFormClose}
                aria-label="Close form"
                className="rounded-full border border-transparent bg-slate-100/60 p-2 text-slate-500 transition hover:bg-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Product name
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Category
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      category: event.target.value as Category | "",
                    }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">General</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Price
                <input
                  type="number"
                  min={0}
                  value={formState.price}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-slate-600">
                Stock
                <input
                  type="number"
                  min={0}
                  value={formState.stock}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                />
              </label>
            </div>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Images
                </p>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="seller-image-upload"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-[#2563eb] transition hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" />
                    Upload photos
                  </label>
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-[#2563eb] transition hover:bg-slate-50"
                  >
                    <Plus className="h-3 w-3" />
                    Add field
                  </button>
                </div>
              </div>
              <input
                id="seller-image-upload"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  handleFileUpload(event.target.files);
                  event.target.value = "";
                }}
              />
              <div className="mt-4 space-y-3">
                {formState.imageUrls.map((url, index) => (
                  <div
                    key={`image-${index}`}
                    className="flex flex-col gap-2 sm:flex-row sm:items-start"
                  >
                    <input
                      type="url"
                      placeholder="https://example.com/product.jpg"
                      value={url}
                      onChange={(event) => handleImageUrlChange(index, event.target.value)}
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                    />
                    {formState.imageUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(index)}
                        className="rounded-2xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formState.imageUrls.some(Boolean) && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {formState.imageUrls.map((url, index) => (
                    <div key={`preview-${index}`} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                      {url ? (
                        <img src={url} alt={`Preview ${index + 1}`} className="h-20 w-full object-cover" />
                      ) : (
                        <div className="flex h-20 items-center justify-center text-xs uppercase tracking-[0.4em] text-slate-400">
                          Empty
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(index)}
                        className="absolute right-1 top-1 rounded-full border border-white bg-white/80 p-1 text-xs text-slate-500 transition hover:bg-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleFormClose}
                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="rounded-2xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1d4ed8]"
              >
                {formMode === "edit" ? "Save changes" : "Create product"}
              </button>
            </div>
          </section>
        )}

        <section className="rounded-4xl bg-white p-6 shadow-[0_35px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">
                Product List
              </p>
            </div>
            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="flex-1 min-w-0 border-none bg-transparent text-sm text-slate-600 focus:outline-none"
              />
            </div>
          </div>
        <div className="seller-product-cards mt-6 grid gap-4 lg:hidden">
          {filteredProducts.map((product) => (
            <article
                key={product.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs font-semibold text-slate-600">
                    {product.id}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] ${statusStyles[product.status]}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-slate-500">Category: {product.category}</p>
                  <p className="text-slate-500">Price: {money(product.price)}</p>
                  <p className={`text-slate-500 ${product.stock === 0 ? "text-rose-500" : ""}`}>
                    Stock: {product.stock}
                  </p>
                  <p className="text-slate-500">Sales: {product.sales}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(product.rawId)}
                    className="rounded-2xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(product.rawId)}
                    className="rounded-2xl border border-rose-200 px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:border-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
            <div className="seller-product-table hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  <th className="px-3 py-3">Product ID</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Stock</th>
                  <th className="px-3 py-3">Sales</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-sm text-slate-400">
                      No products found
                    </td>
                  </tr>
                )}
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-slate-100">
                    <td className="px-3 py-4 font-mono text-xs font-semibold text-slate-600">
                      {product.id}
                    </td>
                    <td className="px-3 py-4 font-semibold text-slate-900">{product.name}</td>
                    <td className="px-3 py-4 text-slate-500">{product.category}</td>
                    <td className="px-3 py-4 font-semibold text-slate-900">
                      {money(product.price)}
                    </td>
                    <td
                      className={`px-3 py-4 font-semibold ${
                        product.stock === 0 ? "text-rose-500" : "text-slate-700"
                      }`}
                    >
                      {product.stock}
                    </td>
                    <td className="px-3 py-4 font-semibold text-slate-900">
                      {product.sales}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] ${statusStyles[product.status]}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Edit product"
                          onClick={() => handleEditProduct(product.rawId)}
                          className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete product"
                          onClick={() => handleDeleteProduct(product.rawId)}
                          className="rounded-full border border-slate-200 p-2 text-rose-500 transition hover:border-rose-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </SellerLayout>
  );
}
