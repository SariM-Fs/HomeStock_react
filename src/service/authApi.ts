import { api } from "./api";
import { toast } from "sonner";

export type LoginData  = {
    username: string;
    password: string;
};

type FormData = {
    username: string;
    password: string;
    displayName: string,
    familyName?: string,
    familyCode?: string,
    familyType: "new" | "join"
};

export const loginUserApi = async (data: LoginData ) => {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    return res.data.user
};

export const registerUserApi = async (data: FormData) => {
    const res = await api.post("/auth/register", data)
    localStorage.setItem("token", res.data.token)
    toast.info(`${res.data.family.code} :קוד המשפחה`, { duration: Infinity })
    return res.data.user
};

export const currentUserApi = async () => {
    const res = await api.get("/auth/me");
    return res.data
}
