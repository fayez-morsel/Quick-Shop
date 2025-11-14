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
}
