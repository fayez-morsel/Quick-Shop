import { create } from "zustand";

const initialAuth =
  typeof window !== "undefined"
    ? localStorage.getItem("isAuthenticated") === "true"
    : false;
const initialRole =
  typeof window !== "undefined"
    ? (localStorage.getItem("userRole") as UserRole | null) ?? "buyer"
    : "buyer";
const initialName =
  typeof window !== "undefined" ? localStorage.getItem("userName") ?? "" : "";
const initialEmail =
  typeof window !== "undefined" ? localStorage.getItem("userEmail") ?? "" : "";
import type {
  Product,
  CartItem,
  FilterState,
  UIState,
  Category,
  Brand,
  Order,
  OrderStatus,
  UserRole,
} from "../types";

//types for state and action

type State = {
  products: Product[];
  filters: FilterState;
  cart: CartItem[];
  favorites: string[];
  ui: UIState;
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  orders: Order[];
};

type Actions = {
  //filters
  setQuery: (q: string) => void;
  setSort: (sort: "popular" | "priceLow" | "priceHigh") => void;
  setDiscounted: (v: boolean) => void;
  setCategory: (category: Category | "all" | Category[]) => void; 
  setBrand: (brand: Brand | "all" | Brand[]) => void; 
  clearFilters: () => void;

  toggleFavorite: (id: string) => void;

  // cart
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  //ui
  toggleCart: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProductDetails: (id: string, updates: Partial<Product>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  login: (role: UserRole) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  setUserInfo: (info: { name: string; email: string }) => void;
  placeOrder: (cart: CartItem[], buyerName: string, buyerEmail: string) => void;
};
export const useStore = create<State & Actions>((set, get) => ({
  // --- initial data ---
  products: [
    {
      id: "p1",
      title: "Headphones",
      price: 120,
      compareAtPrice: 150,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      category: "Tech",
      stock: 24,
      discounted: true,
      discountExpires: "2025-12-15",
      image:
        "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800",
      inStock: true,
      rating: { value: 4.7, count: 284 },
    },
    {
      id: "p2",
      title: "Smartwatch",
      price: 199,
      compareAtPrice: 249,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      stock: 40,
      discounted: true,
      discountExpires: "2025-12-20",
      image:
        "https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
      inStock: true,
      rating: { value: 4.4, count: 198 },
    },
    {
      id: "p3",
      title: "Keyboard",
      price: 89,
      compareAtPrice: 109,
      storeId: "keyzone",
      storeName: "KeyZone",
      category: "Tech",
      stock: 32,
      discounted: true,
      discountExpires: "2025-12-10",
      image:
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800",
      inStock: true,
      rating: { value: 4.6, count: 152 },
    },
    {
      id: "p4",
      title: "Mouse Pro",
      price: 59,
      compareAtPrice: 79,
      storeId: "keyzone",
      storeName: "KeyZone",
      stock: 18,
      discounted: true,
      discountExpires: "2025-12-05",
      image:
        "https://images.unsplash.com/photo-1632160872021-7e65d76ad849?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2FtaW5nJTIwbW91c2UlMjBwcm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
      inStock: true,
      rating: { value: 4.3, count: 310 },
    },
    {
      id: "p5",
      title: "Monitor 27”",
      price: 329,
      compareAtPrice: 399,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      stock: 12,
      discounted: true,
      discountExpires: "2025-12-08",
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
      inStock: true,
      rating: { value: 4.8, count: 147 },
    },
    {
      id: "p6",
      title: "Speaker",
      price: 69,
      compareAtPrice: 89,
      storeId: "soundwave",
      storeName: "SoundWave",
      stock: 34,
      category: "Tech",
      image:
        "https://plus.unsplash.com/premium_photo-1729708654598-f0e68d8bd0bf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ymx1dG9vdGglMjBzcGVha2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      inStock: true,
      rating: { value: 4.5, count: 224 },
    },
    {
      id: "p7",
      title: "Earbuds",
      price: 99,
      compareAtPrice: 129,
      storeId: "soundwave",
      storeName: "SoundWave",
      stock: 0,
      image:
        "https://images.unsplash.com/photo-1662348316397-7afeb1045fd7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fE5vaXNlJTIwQ2FuY2VsbGluZyUyMEVhcmJ1ZHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
      inStock: false,
      rating: { value: 4.2, count: 89 },
    },
    {
      id: "p8",
      title: "SSD 1TB",
      price: 159,
      compareAtPrice: 189,
      storeId: "datahub",
      storeName: "DataHub",
      stock: 21,
      image:
        "https://media.istockphoto.com/id/1367788153/photo/small-external-portable-ssd-lies-in-the-pocket-of-your-bag-backpack-or-jacket-next-to-the-usb.webp?a=1&b=1&s=612x612&w=0&k=20&c=UKSigrfhDexi6T08zJZnf_yWazq4whE41Lls5QHmItI=",
      inStock: true,
      rating: { value: 4.9, count: 376 },
    },
    {
      id: "p9",
      title: "Stand",
      price: 39,
      compareAtPrice: 49,
      storeId: "ergoworks",
      storeName: "ErgoWorks",
      stock: 15,
      category: "Home",
      image:
        "https://images.unsplash.com/photo-1623177578400-52c7f7113539?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGFwdG9wJTIwU3RhbmQlMjBBZGp1c3RhYmxlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      inStock: true,
      rating: { value: 4.4, count: 128 },
    },
    {
      id: "p10",
      title: "Bulb",
      price: 49,
      compareAtPrice: 69,
      storeId: "homelight",
      storeName: "HomeLight",
      stock: 28,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800",
      inStock: true,
      rating: { value: 4.3, count: 92 },
    },
    {
      id: "p11",
      title: "Charger",
      price: 29,
      compareAtPrice: 39,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      stock: 22,
      image:
        "https://images.unsplash.com/photo-1589401806207-2381455bce76?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8V2lyZWxlc3MlMjBDaGFyZ2VyJTIwUGFkfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      inStock: true,
      rating: { value: 4.1, count: 75 },
    },
    {
      id: "p12",
      title: "USB-C",
      price: 119,
      compareAtPrice: 149,
      storeId: "datahub",
      storeName: "DataHub",
      stock: 31,
      image:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800",
      inStock: true,
      rating: { value: 4.7, count: 203 },
    },
    {
      id: "p13",
      title: "Trailblazer",
      price: 149,
      compareAtPrice: 179,
      storeId: "keyzone",
      storeName: "KeyZone",
      stock: 27,
      category: "Sport",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60",
      inStock: true,
      rating: { value: 4.6, count: 210 },
    },
    {
      id: "p14",
      title: "Watch",
      price: 189,
      compareAtPrice: 229,
      storeId: "tech-hub",
      storeName: "Tech Hub",
      stock: 14,
      category: "Accessories",
     image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=60",
      inStock: true,
      rating: { value: 4.7, count: 316 },
    },
    {
      id: "p15",
      title: "Boundless",
      price: 29,
      storeId: "datahub",
      storeName: "DataHub",
      stock: 26,
      category: "Books",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=60",
      inStock: true,
      rating: { value: 4.9, count: 412 },
    },
    {
      id: "p16",
      title: "Gift Box",
      price: 79,
      compareAtPrice: 99,
      storeId: "homelight",
      storeName: "HomeLight",
      stock: 20,
      category: "Gifts",
      image:
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=60",
      inStock: true,
      rating: { value: 4.5, count: 184 },
    },
  ],

  orders: [
    {
      id: "o1",
      buyerName: "Maya Benson",
      buyerEmail: "maya.b@example.com",
      storeId: "tech-hub",
      items: [
        { productId: "p1", qty: 1 },
        { productId: "p12", qty: 2 },
      ],
      total: 358,
      status: "Pending",
      placedAt: "2025-10-25T10:12:00.000Z",
      expectedDelivery: "2025-11-01T00:00:00.000Z",
    },
    {
      id: "o2",
      buyerName: "Ravi Patel",
      buyerEmail: "ravi.p@example.com",
      storeId: "soundwave",
      items: [
        { productId: "p6", qty: 1 },
        { productId: "p7", qty: 1 },
      ],
      total: 168,
      status: "Dispatched",
      placedAt: "2025-10-22T17:40:00.000Z",
      expectedDelivery: "2025-10-29T00:00:00.000Z",
    },
    {
      id: "o3",
      buyerName: "Lina Harper",
      buyerEmail: "lina.harper@example.net",
      storeId: "datahub",
      items: [
        { productId: "p8", qty: 1 },
        { productId: "p15", qty: 1 },
      ],
      total: 188,
      status: "Delivered",
      placedAt: "2025-10-08T13:25:00.000Z",
      expectedDelivery: "2025-10-14T00:00:00.000Z",
    },
  ],

  filters: {
    query: "",
    store: "all",
    category: [],
    brand: [],
    minPrice: 0,
    maxPrice: 9999,
    discountedOnly: false,
    sortBy: "popular",
  },
  cart: [],
  favorites: [],
  ui: { cartOpen: false },
  isAuthenticated: initialAuth,
  userRole: initialRole,
  userName: initialName,
  userEmail: initialEmail,

  // Action
  //filters
  setQuery: (q) => set((s) => ({ filters: { ...s.filters, query: q } })),
  setSort: (sort) => set((s) => ({ filters: { ...s.filters, sortBy: sort } })),
  setDiscounted: (v) =>
    set((s) => ({ filters: { ...s.filters, discountedOnly: v } })),
  setCategory: (category: Category | "all" | Category[]) =>
    set((s) => {
      let updated: Category[] = [];
      if (category === "all") {
        updated = [];
      } else if (Array.isArray(category)) {
        updated = category;
      } else {
        const hasCategory = s.filters.category.includes(category);
        updated = hasCategory
          ? s.filters.category.filter((c) => c !== category)
          : [...s.filters.category, category];
      }
      return { filters: { ...s.filters, category: updated } };
    }),
  setBrand: (brand: Brand | "all" | Brand[]) =>
    set((s) => {
      let updated: Brand[] = [];
      if (brand === "all") {
        updated = [];
      } else if (Array.isArray(brand)) {
        updated = brand;
      } else {
        const hasBrand = s.filters.brand.includes(brand);
        updated = hasBrand
          ? s.filters.brand.filter((b) => b !== brand)
          : [...s.filters.brand, brand];
      }
      return { filters: { ...s.filters, brand: updated } };
    }), 

  clearFilters: () =>
    set((_s) => ({
      filters: {
        query: "",
        store: "all",
        category: [],
        brand: [],
        minPrice: 0,
        maxPrice: 9999,
        discountedOnly: false,
        sortBy: "popular",
      },
    })),

  // Cart
  addToCart: (id) =>
    set((s) => {
      const exists = s.cart.find((c) => c.productId === id);
      return {
        cart: exists
          ? s.cart.map((c) =>
              c.productId === id ? { ...c, qty: c.qty + 1 } : c
            )
          : [...s.cart, { productId: id, qty: 1 }],
      };
    }),
  removeFromCart: (id) =>
    set((s) => ({ cart: s.cart.filter((c) => c.productId !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      cart: s.cart.map((c) =>
        c.productId === id ? { ...c, qty: Math.max(1, qty) } : c
      ),
    })),
  clearCart: () => set({ cart: [] }),
  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((fav) => fav !== id)
        : [...s.favorites, id],
    })),
  toggleCart: () => set((s) => ({ ui: { cartOpen: !s.ui.cartOpen } })),
  addProduct: (product) =>
    set((s) => ({
      products: [
        ...s.products,
        {
          ...product,
          inStock: product.stock > 0,
          discounted: Boolean(product.discounted),
        },
      ],
    })),
  removeProduct: (id) =>
    set((s) => ({
      products: s.products.filter((product) => product.id !== id),
    })),
  updateProductDetails: (id, updates) =>
    set((s) => ({
      products: s.products.map((product) => {
        if (product.id !== id) return product;
        const { stock, inStock: explicitInStock, ...rest } = updates;
        const nextStock = typeof stock === "number" ? stock : product.stock;
        return {
          ...product,
          ...rest,
          stock: nextStock,
          inStock:
            explicitInStock ??
            (stock !== undefined ? stock > 0 : product.inStock),
        };
      }),
    })),
  updateOrderStatus: (orderId, status) =>
    set((s) => ({
      orders: s.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),
  login: (role) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", role);
      }
      return { isAuthenticated: true, userRole: role };
    }),
  logout: () =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAuthenticated");
        localStorage.setItem("userRole", "buyer");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
      }
      return { isAuthenticated: false, userRole: "buyer", userName: "", userEmail: "" };
    }),
  setRole: (role) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userRole", role);
      }
      return { userRole: role };
    }),
  setUserInfo: ({ name, email }) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
      }
    return { userName: name, userEmail: email };
  }),
  placeOrder: (cart, buyerName, buyerEmail) =>
    set((s) => {
      if (!cart.length) {
        return {};
      }
      const productLookup = Object.fromEntries(
        s.products.map((product) => [product.id, product])
      );
      const total = cart.reduce((sum, item) => {
        const product = productLookup[item.productId];
        return sum + (product ? product.price * item.qty : 0);
      }, 0);
      if (!orderItems.length) {
        return {};
      }
      const firstProduct = productLookup[cart[0].productId];
      const order: Order = {
        id: `o${Date.now()}`,
        buyerName: buyerName || "Quick Shopper",
        buyerEmail: buyerEmail || "guest@shopup.com",
        storeId: firstProduct?.storeId ?? "quick-shop",
        items: cart.map((item) => ({
          productId: item.productId,
          qty: item.qty,
        })),
        total,
        status: "Pending",
        placedAt: new Date().toISOString(),
        expectedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
      return { orders: [...s.orders, order] };
    }),
}));

export const useFilters = () => useStore((s) => s.filters);
