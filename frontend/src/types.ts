//  Product info
export type Product = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number; // old price for discount display
  storeId: string;
  storeName: Brand;
  category?: Category;
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

// Cart item
export type CartItem = {
  productId: string;
  qty: number;
};

// Filter State(search, store, ...)
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
  | "Pending"
  | "Processing"
  | "Dispatched"
  | "Shipped"
  | "Delivered"
  | "Delivery Unsuccessful"
  | "Canceled";

export type OrderItem = {
  productId: string;
  qty: number;
};

export type Order = {
  id: string;
  buyerName: string;
  buyerEmail: string;
  storeId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  expectedDelivery: string;
};

export type UserRole = "buyer" | "seller";

export type Category =
  | "Tech"
  | "Sound"
  | "Home"
  | "Sport"
  | "Accessories"
  | "Books"
  | "Gifts";

export type Brand =
  | "Tech Hub"
  | "KeyZone"
  | "SoundWave"
  | "DataHub"
  | "ErgoWorks"
  | "HomeLight"
  | "Demo Store";
