import { useForm } from "react-hook-form";
import * as yup from "yup";
import { getProductApi } from "../service/productsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/type";
import { addToListApi } from "../service/shopListApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { errorMessage } from "../service/errorMessage";
import { toast } from "sonner";


const schema = yup.object({
    productId: yup.number().typeError("יש לבחור מוצר").required(),
    quantity: yup.number().typeError("יש להזין מספר").min(1, "כמות מינימלית 1").required(),
});
type AddItem = {
    productId: number;
    quantity: number;
};
const AddToList = () => {
    const { user } = useContext(userContext);
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AddItem>({
        resolver: yupResolver(schema)

    });
    const { data, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: getProductApi
    });
    const addProductToList = useMutation({
        mutationFn: (data: AddItem) => addToListApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        }
    });

    if (isLoading) {
        return <p>טוען מוצרים...</p>;
    }

    if (error) {
        return <p>אירעה שגיאה בטעינת המוצרים</p>;
    }
    const onSubmit = (data: AddItem) => {

        if (user?.role === "Admin" || user?.canAddToShoppingList)
            addProductToList.mutate(data)
        else
            toast.warning("אין לך הרשאה")
    }
    return <form className="form-inline" onSubmit={handleSubmit(onSubmit)}>
        <select {...register("productId", { valueAsNumber: true })}>
            <option value="">בחירת מוצר</option>
            {data?.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
        </select>
        {errors.productId && <p className="error">{errors.productId.message}</p>}
        <label>כמות</label>
        <input  {...register("quantity", { valueAsNumber: true })} type="number" />
        {errors.quantity && <p className="error">{errors.quantity.message}</p>}
        {addProductToList.isError && <p className="error">{errorMessage(addProductToList.error)}</p>}
        <button type="submit">+ הוספה </button>
    </form>
}
export default AddToList