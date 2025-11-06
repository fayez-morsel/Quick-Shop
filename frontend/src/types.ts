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