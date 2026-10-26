import axios from "axios";

type AddItem = {
    productId: number;
    quantity: number;
};

export const getShopListApi = async () => {

    const res = await axios.get("http://localhost:3001/shopping-list", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return res.data

}

export const addToListApi = async (data: AddItem) => {
    const res = await axios.post(
        "http://localhost:3001/shopping-List",
        data,
        {
            headers:
                { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }

    );
    return res.data
}

export const deleteItemApi = async (id: number) => {
    try {
        const res = await axios.delete(
            `http://localhost:3001/shopping-list/${id}`,
            {
                headers:
                    { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }

        );
        return res.data
    }
    catch (error) {
        console.error("Failed to delete item", error);
        throw error;

    }
}

export const markPurchasedApi = async (id: number) => {
    try {
        const res = await axios.put(
            `http://localhost:3001/shopping-list/${id}`,
            { purchased: true },
            {
                headers:
                    { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }

        );
        return res.data
    }
    catch (error) {
        console.error("Failed to mark as purchased", error);
        throw error;

    }
}
