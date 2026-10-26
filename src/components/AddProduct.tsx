import { useForm } from "react-hook-form";
import { addProductApi } from "../service/productsApi";
import { Category, Unit, type CategoryType, type NewProduct, type UnitType } from "../types/type";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../service/errorMessage";


const schema = yup.object({
    name: yup.string().required("שם מוצר חובה"),
    category: yup.mixed<CategoryType>().oneOf([...Category], "יש לבחור קטגוריה").required("יש לבחור קטגוריה"),
    unit: yup.mixed<UnitType>().oneOf([...Unit], "יש לבחור יחידת מידה").required("יש לבחור יחידת מידה"),
    quantity: yup.number().typeError("יש להזין מספר").min(0, "לא יכול להיות שלילי").required(),
    minimumQuantity: yup.number().typeError("יש להזין מספר").min(0, "לא יכול להיות שלילי").required(),
});


const AddProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const addProduct = useMutation({
        mutationFn: (data: NewProduct) => addProductApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            navigate('/inventory');

        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<NewProduct>({
        resolver: yupResolver(schema)

    });

    return <form onSubmit={handleSubmit((data) => addProduct.mutate(data))}>
        <label>שם המוצר</label>
        <input {...register("name")} placeholder="לדוגמה שמן זית" />
        {errors.name && <p className="error">{errors.name.message}</p>}
        <br></br>
        <select {...register("category")}>
            <option value="">קטגוריה</option>
            {Category.map((c) => (
                <option key={c} value={c}>{c}</option>
            ))}
        </select>
        {errors.category && <p className="error">{errors.category.message}</p>}
        <br></br>
        <select {...register("unit")}>
            <option value="">יחידת מידה</option>
            {Unit.map((u) => (
                <option key={u} value={u}>{u}</option>
            ))}
        </select>
        {errors.unit && <p className="error">{errors.unit.message}</p>}
        <br></br>
        <label>כמות נוכחית</label>
        <input type="number" {...register("quantity", { valueAsNumber: true })} />
        {errors.quantity && <p className="error">{errors.quantity.message}</p>}
        <br></br>
        <label>כמות מינימלית</label>
        <input type="number" {...register("minimumQuantity", { valueAsNumber: true })} />
        {errors.minimumQuantity && <p className="error">{errors.minimumQuantity.message}</p>}
        {addProduct.isError && <p className="error">{errorMessage(addProduct.error)}</p>}
        <button type="submit">שמירת מוצר</button>

    </form>


}
export default AddProduct
