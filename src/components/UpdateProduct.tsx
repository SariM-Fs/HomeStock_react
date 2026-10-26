import { useForm } from "react-hook-form";
import { updateProductApi } from "../service/productsApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessage } from "../service/errorMessage";

const schema = yup.object({
    quantity: yup.number()
        .typeError("יש להזין מספר")
        .min(0, "לא יכול להיות שלילי")
        .required(),
});

const UpdateProduct = ({ id, onClose }: { id: number; onClose: () => void; }) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ quantity: number }>({ resolver: yupResolver(schema) })

    const updateProduct = useMutation({
        mutationFn: (quantity: number) => updateProductApi(id, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            onClose()
        }
    });
    const onSubmit = (data: { quantity: number }) => {
        updateProduct.mutate(data.quantity);
    };
    return <form className="dialog" onSubmit={handleSubmit(onSubmit)}>
        <h1>עדכון כמות</h1>
        <label>כמות חדשה</label>
        <input type="number" {...register("quantity", { valueAsNumber: true })} />
        {errors.quantity && <p className="error">{errors.quantity.message}</p>}
        {updateProduct.isError && <p className="error">{errorMessage(updateProduct.error)}</p>}
        <button type="submit" >שמירת שינויים</button>
        <button className="btn-secondary" type="button" onClick={onClose}>ביטול</button>

    </form>


}
export default UpdateProduct