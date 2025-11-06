//  Product info
export type Product = {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number; // old price for discount display
  storeId: string;
  storeName: string;
  image: string;
  inStock: boolean;
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
  minPrice: number;
  maxPrice: number;
  discountedOnly: boolean;
  sortBy: "popular" | "priceLow" | "priceHigh";
};
