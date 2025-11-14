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

}
