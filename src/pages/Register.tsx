import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { registerUserApi } from "../service/authApi";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage } from "../service/errorMessage";

type FormData = {
    username: string;
    password: string;
    displayName: string,
    familyName?: string,
    familyCode?: string,
    familyType: "new" | "join"
};
const schema = yup.object({
    username: yup.string().required("שם משתמש חובה").min(3, "מינימום 3 תוים"),
    password: yup.string().required("סיסמה חובה").min(6, "מינימום 6 תוים"),
    displayName: yup.string().required("שם לתצוגה חובה"),
    familyName: yup.string(),
    familyCode: yup.string(),
    familyType: yup.mixed<"new" | "join">()
        .oneOf(["new", "join"])
        .required("יש לבחור סוג משפחה"),

})
const Register = () => {

    const { setUser } = useContext(userContext);
    const navigate = useNavigate();

    const {
        register,
        watch,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        try {
            const loggedInUser = await registerUserApi(data);
            setUser(loggedInUser);
            navigate("/", { replace: true });

        } catch (error) {
            setError("username", {
                type: "server",
                message: errorMessage(error)
            });
        }
    };
    const familyType = watch("familyType");

    return <div className="auth-page">
        <aside className="auth-intro">
            <p className="brand">HomeStock</p>
            <h2>כל המשפחה רואה מה יש בבית, מה חסר ומה צריך לקנות</h2>
            <ul>
                <li className="feature-stock">מלאי משותף</li>
                <li className="feature-cart">רשימת קניות חכמה</li>
                <li className="feature-users">שליטה בהרשאות</li>
            </ul>
        </aside>
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h1>הרשמה</h1>
        <label className="choice">
            <input {...register("familyType")} type="radio" value="new" />
            משפחה חדשה
        </label>
        <br></br>
        <label className="choice">
            <input {...register("familyType")} type="radio" value="join" />
            יש לי קוד
        </label>
        <br></br>
        <label>שם משתמש</label>
        <input {...register("username")} />
        {errors.username && <p className="error">{errors.username.message}</p>}
        <br></br>
        <label>סיסמה</label>
        <input {...register("password")} type="password" />
        {errors.password && <p className="error">{errors.password.message}</p>}
        <br></br>
        <label>שם לתצוגה</label>
        <input {...register("displayName")} />
        {errors.displayName && <p className="error">{errors.displayName.message}</p>}
        <br></br>
        {familyType === "new" && (
            <>
                <label>שם המשפחה</label>
                <input {...register("familyName")} />
                {errors.familyName && <p className="error">{errors.familyName.message}</p>}
            </>
        )}
        {familyType === "join" && (
            <>
                <label>קוד המשפחה</label>
                <input {...register("familyCode")} />
                {errors.familyCode && <p className="error">{errors.familyCode.message}</p>}
            </>
        )}
        <br></br>
        <button type="submit">הרשם כאן</button>
        <p>כבר רשומים? <Link to="/login">כניסה</Link> </p>

        </form >
    </div>

}
export default Register