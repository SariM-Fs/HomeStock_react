import axios from "axios";
import type { NewProduct } from "../types/type";

export const getProductApi = async () => {

    const res = await axios.get("http://localhost:3001/products", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return res.data

}

export const addProductApi = async (data: NewProduct) => {

    const res = await axios.post(
        "http://localhost:3001/products",
        data,
        {
            headers:
                { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }

    );
    return res.data
};

export const updateProductApi = async (id: number, quantity: number) => {
    try {
        const res = await axios.patch(
            `http://localhost:3001/products/${id}/quantity`,
            { quantity: quantity },
            {
                headers:
                    { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }

        );
        return res.data
    }
    catch (error) {
        console.error("Faild", error)
        throw error
    }
}

export const deleteProductApi = async (id: number) => {
    try {
        const res = await axios.delete(
            `http://localhost:3001/products/${id}`,
            {
                headers:
                    { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }

        );
        return res.data
    }
    catch (error) {
        console.error("Failed to delete product", error);
        throw error;

    }
}
