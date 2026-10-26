import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getShopListApi, deleteItemApi, markPurchasedApi } from "../service/shopListApi";
import AddToList from "../components/AddToList";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { errorMessage } from "../service/errorMessage";
import { toast } from "sonner";


type ItemFromList = {

    id: number;
    productId: number;
    quantity: number;
    purchased: boolean;
    addedAutomatically: boolean;
    product: {
        id: number;
        name: string;
        category: string;
        quantity: number;
        minimumQuantity: number;
        unit: string;

    };

}

const ShopList = () => {
    const queryClient = useQueryClient();
    const { user } = useContext(userContext);
    const { data, isLoading, error } = useQuery<ItemFromList[]>({
        queryKey: ['items'],
        queryFn: getShopListApi
    });
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteItemApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
        onError: (err) => {
            toast.error(errorMessage(err));
        }
    });
    const markMutation = useMutation({
        mutationFn: (id: number) => markPurchasedApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
        onError: (err) => {
            toast.error(errorMessage(err));
        }
    });
    if (isLoading) {
        return <p>טוען מוצרים...</p>;
    }

    if (error) {
        return <p>אירעה שגיאה בטעינת המוצרים</p>;
    }

    return <>
        <h1>רשימת קניות</h1>
        <h4 className="stat">פריטים לקנות {data?.length}</h4>
        <AddToList />
        {user?.canMarkPurchased ? <p className="hint">סמן וי בעת רכישת המוצר</p> : ""}
        <table className="shop-table">
            <tbody>
                {
                    data?.map(item => (
                        <tr key={item.id}>
                            {user?.role === "Admin" || user?.canMarkPurchased ? <td className="action check" onClick={() => markMutation.mutate(item.id)}>✅</td> : ""}
                            <td className="name">{item.product.name}</td>
                            <td>{item.addedAutomatically ? "נוסף אוטומטית" : "נוסף ידנית"}</td>
                            <td className="qty">{item.quantity}</td>
                            {user?.role === "Admin" ? <td className="action delete" onClick={() => {
                                if (confirm(`האם למחוק את ${item.product.name} מהרשימה?`)) {
                                    deleteMutation.mutate(item.id);
                                }
                            }} title="מחיקה">🗑️</td> : ""}
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </>
}
export default ShopList