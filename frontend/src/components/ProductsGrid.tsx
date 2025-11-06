import React from "react";
import ProductCard from "./ProductCard";
import { useFilteredProducts } from "../store/useStore";

export default function ProductsGrid() {
    const products = useFilteredProducts();

    if(products.length === 0)
        return (
            <div className="text-center text-gray-500 py-20">
                No products found
            </div>
        )
    
    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
                <ProductCard key={p.id} p={p} />
            ))}
        </div>
    );
}