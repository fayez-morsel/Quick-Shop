import { http } from "./http";

export const apiGetProducts = () => http.get("/products");
export const apiGetProduct = (id: string) => http.get(`/products/${id}`);
export const apiCreateProduct = (data: any) => http.post("/products", data);
export const apiDeleteProduct = (id: string) => http.delete(`/products/${id}`);
