import { api } from "./api";

type AddItem = {
    productId: number;
    quantity: number;
};

export const getShopListApi = async () => {
    const res = await api.get("/shopping-list");
    return res.data
}

export const addToListApi = async (data: AddItem) => {
    const res = await api.post("/shopping-list", data);
    return res.data
}

export const deleteItemApi = async (id: number) => {
    const res = await api.delete(`/shopping-list/${id}`);
    return res.data
}

export const markPurchasedApi = async (id: number) => {
    const res = await api.put(`/shopping-list/${id}`, { purchased: true });
    return res.data
}
