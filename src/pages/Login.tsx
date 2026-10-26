import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginUserApi, currentUserApi } from "../service/authApi";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage } from "../service/errorMessage";


type LoginData = {
    username: string;
    password: string;
};

const schema = yup.object({
    username: yup.string().required("שם משתמש חובה"),
    password: yup.string().required("סיסמה חובה")
});

const Login = () => {
    const navigate = useNavigate();

    const { setUser } = useContext(userContext);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<LoginData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: LoginData) => {
        try {
            await loginUserApi(data);
            const user = await currentUserApi();
            setUser(user);
            navigate("/", { replace: true });
        } catch (error) {
            setError("username", {
                type: "server",
                message: errorMessage(error)
            });
        }
    };

    return <form onSubmit={handleSubmit(onSubmit)}>
        <h1>כניסה</h1>
        <h4>התחברו כדי לראות מה יש בבית ומה צריך לקנות</h4>
        <label>שם משתמש</label>
        <input {...register("username")} />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <br></br>
        <label>סיסמה</label>
        <input {...register("password")} type="password" />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <br></br>
        <button type="submit">כניסה</button>
        <p>עוד אין לך חשבון? <Link to="/register">הרשמה כבן בית</Link> </p>
    </form>



}
export default Login