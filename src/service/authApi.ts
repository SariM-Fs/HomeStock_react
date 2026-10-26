import axios from "axios";

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

    const res = await axios.post(
        "http://localhost:3001/auth/login",
        data
    );
    localStorage.setItem("token", res.data.token);
    return res.data.user

};

export const registerUserApi = async (data: FormData) => {

    const res = await axios.post(
        "http://localhost:3001/auth/register",
        data
    )
    localStorage.setItem("token", res.data.token)
    alert(`${res.data.family.code} :קוד המשפחה`)
    return res.data.user

};

export const currentUserApi = async () => {

        const res = await axios.get("http://localhost:3001/auth/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return res.data

}
