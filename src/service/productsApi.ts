import { api } from "./api";
import type { NewProduct } from "../types/type";

export const getProductApi = async () => {
    const res = await api.get("/products");
    return res.data
}

export const addProductApi = async (data: NewProduct) => {
    const res = await api.post("/products", data);
    return res.data
};

export const updateProductApi = async (id: number, quantity: number) => {
    const res = await api.patch(`/products/${id}/quantity`, { quantity });
    return res.data
}

export const deleteProductApi = async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data
}
