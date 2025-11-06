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

