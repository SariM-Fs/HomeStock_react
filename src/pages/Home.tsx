import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { getProductApi } from "../service/productsApi";
import { getShopListApi } from "../service/shopListApi";
import { useQuery } from "@tanstack/react-query";
import type { ItemFromList, Product } from "../types/type";
import { useNavigate } from "react-router-dom";


const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(userContext);
    const { data: products, isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: getProductApi
    });

    const { data: items, isLoading: itemsLoading, error: itemsError } = useQuery<ItemFromList[]>({
        queryKey: ['items'],
        queryFn: getShopListApi
    });
    if (productsLoading || itemsLoading) {
        return <p>טוען מוצרים...</p>;
    }

    if (productsError || itemsError) {
        return <p>אירעה שגיאה בטעינת המוצרים</p>;
    }

    return <>
        <h1> שלום {user?.displayName}</h1>
        <h4 className="family-code">{user?.role === "Admin" ? `קוד משפחה ${user?.family?.code}` : ""}</h4>
        <h4 className="subtitle">כך נראה המלאי של הבית עכשיו</h4>
        <div className="card summary">
            <p className="card-title">מוצרים שחסרים או אוזלים:</p>
            <p className="card-note"><span className="big-number">{products?.filter(p => p.status !== "תקין").length}</span> מתוך {products?.length} מוצרים במלאי</p>
            <button onClick={() => navigate("/shop-List")}>לרשימת הקניות</button>
        </div>
        <div className="card list">
            <p className="card-title">רשימת קניות</p>
            <table>
                <tbody>
                    {
                        items?.map(item => (
                            <tr key={item.id}>
                                <td className="item-name">{item.product.name}</td>
                                <td className="item-qty">{item.quantity}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        <div className="card stock" style={{
            ["--ok" as string]: products?.filter(p => p.status === "תקין").length,
            ["--low" as string]: products?.filter(p => p.status === "נמוך").length,
            ["--missing" as string]: products?.filter(p => p.status === "חסר").length
        }}>
            <p className="card-title">מלאי נוכחי</p>
            <ul>
                <li className="legend-ok">תקין {products?.filter(p => p.status === "תקין").length}</li>
                <li className="legend-low">נמוך {products?.filter(p => p.status === "נמוך").length}</li>
                <li className="legend-out">חסר {products?.filter(p => p.status === "חסר").length}</li>
            </ul>
        </div>
        <div className="card attention">
            <p className="card-title">מוצרים במלאי שדורשים תשומת לב</p>
            <table>
                <tbody>
                    {products?.filter(p => p.status !== "תקין").map(p => (
                        <tr key={p.id}>
                            <td className="item-name">{p.name}</td>
                            <td className="item-status">{p.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </>

}
export default Home
