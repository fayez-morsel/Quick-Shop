//  Product info (backend-driven)
export type Product = {
  _id: string;
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number; 
  store?: string;
  storeId?: string;
  storeName: Brand | string;
  brand?: Brand | string;
  category?: Category | string;
  discounted?: boolean;
  tagline?: string;
  image: string;
  images?: string[];
  inStock: boolean;
  rating?: {
    value: number;
    count: number;
  };
  stock: number;
  discountExpires?: string;
};


export type CartItem = {
  product: Product;
  quantity: number;
  productId?: string;
  qty?: number;
  _id?: string;
};


export type FilterState = {
  query: string;
  store: string | "all";
  category: Category[];
  brand: Brand[];
  minPrice: number;
  maxPrice: number;
  discountedOnly: boolean;
  sortBy: "popular" | "priceLow" | "priceHigh";
};

// UI state
export type UIState = {
    cartOpen: boolean;
}

export type OrderStatus =
  | "unconfirmed"
  | "pending"
  | "canceled"
  | "delivered"
  | "Pending"
  | "Processing"
  | "Dispatched"
  | "Shipped"
  | "Delivered"
  | "Delivery Unsuccessful"
  | "Canceled";

export type OrderItem = {
  product: Product | string;
  productId?: string;
  qty?: number;
  quantity?: number;
  title?: string;
  price?: number;
  image?: string;
};

export type Order = {
  _id: string;
  id: string;
  buyer?: string;
  buyerEmail?: string;
  buyerName?: string;
  store: string;
  storeId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  expectedDelivery?: string;
};

export type UserRole = "buyer" | "seller";

export type Category =
  | "Tech"
  | "Sound"
  | "Home"
  | "Sport"
  | "Accessories"
  | "Books"
  | "Gifts"
  | string;

export type Brand =
  | "Tech Hub"
  | "KeyZone"
  | "SoundWave"
  | "DataHub"
  | "ErgoWorks"
  | "HomeLight"
  | "Demo Store"
  | string;
