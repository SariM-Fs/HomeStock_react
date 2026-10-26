import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductApi, deleteProductApi } from "../service/productsApi"
import type { Product } from "../types/type";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { userContext } from "../context/UserContext";
import UpdateProduct from "../components/UpdateProduct";
import { errorMessage } from "../service/errorMessage";


const Inventory = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useContext(userContext);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);


    const { data, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: getProductApi
    });
    const deleteProduct = useMutation({
        mutationFn: (id: number) => deleteProductApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err) => {
            errorMessage(err);
        }
    });
    if (isLoading) {
        return <p>טוען מוצרים...</p>;
    }

    if (error) {
        return <p>אירעה שגיאה בטעינת המוצרים</p>;
    }
    const filteredProducts = data?.filter((product) => {
        return product.name.includes(search) && product.category.includes(category);
    });
    return <>
        <h1>מלאי</h1>
        <h4 className="stat">מוצרים בבית {data?.length}</h4>
        <input
            className="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם המוצר"
        />
        <select className="filter" onChange={(e) => setCategory(e.target.value)}
        >
            <option value="">כל הקטגוריות</option>
            {data?.map((item) => (
                <option key={item.id}>{item.category}</option>
            ))}
        </select>
        <br></br>
        {user?.role === "Admin" ? <button className="btn-add" onClick={() => navigate("/inventory/add")}>להוספת מוצר</button> : ""}
        <table className="inventory-table">

            <thead>
                <tr>
                    <th>שם מוצר</th>
                    <th>קטגוריה</th>
                    <th>כמות</th>
                    <th>כמות מינימלית</th>
                    <th>סטטוס</th>
                </tr>
            </thead>
            <tbody>
                {
                    filteredProducts?.map(product => (
                        <tr key={product.id}>
                            <td className="name">{product.name}</td>
                            <td className="category">{product.category}</td>
                            <td className="qty">{product.quantity} {product.unit}</td>
                            <td className="min-qty">{product.minimumQuantity}</td>
                            <td data-status={product.status}>{product.status}</td>
                            {user?.role === "Admin" || user?.canUpdateQuantity ? <td className="action edit" onClick={() => setEditingId(product.id)} title="עריכה">✏️</td> : ""}
                            {user?.role === "Admin" ? <td className="action delete" onClick={() => {
                                if (confirm(`האם למחוק את ${product.name} מהמלאי?`))
                                    deleteProduct.mutate(product.id)
                            }} title="מחיקה">🗑️</td> : ""}

                        </tr>
                    ))
                }
            </tbody>
        </table>
        {(user?.role === "Admin" || user?.canUpdateQuantity) && editingId !== null && (
            <UpdateProduct
                id={editingId}
                onClose={() => setEditingId(null)}
            />
        )}
    </>

}
export default Inventory