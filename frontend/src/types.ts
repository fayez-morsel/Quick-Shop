//  Product info
export type Product = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number; // old price for discount display
  storeId: string;
  storeName: Brand;
  category?: Category;
  image: string;
  inStock: boolean;
  rating?: {
    value: number;
    count: number;
  };
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
  category: Category | "all";
  brand: Brand | "all";
  minPrice: number;
  maxPrice: number;
  discountedOnly: boolean;
  sortBy: "popular" | "priceLow" | "priceHigh";
};

// UI state
export type UIState = {
    cartOpen: boolean;
}

export type Category =
  | "Tech"
  | "Sound"
  | "Home"
  | "Sport"
  | "Accessories";

  export type Brand =
  | "Tech Hub"
  | "KeyZone"
  | "SoundWave"
  | "DataHub"
  | "ErgoWorks"
  | "HomeLight";