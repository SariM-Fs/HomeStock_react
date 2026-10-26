import { createContext, useEffect, useState, type ReactNode } from "react";
import { currentUserApi } from "../service/authApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export interface user {
    id: number;
    familyId: number;
    username: string;
    displayName: string;
    role: string;
    canUpdateQuantity: boolean;
    canAddToShoppingList: boolean;
    canMarkPurchased: boolean;
    family: {
        id: number;
        name: string;
        code: string
    }
}
interface UserContextType {
    user: user | null
    setUser: (u: user | null) => void
    logout: () => void;
    loading: boolean;
}
export const userContext = createContext<UserContextType>({ setUser: () => { }, user: null, logout: () => { }, loading: false });
const UserProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<user | null>(null)
    const [loading, setLoading] = useState(
        !!localStorage.getItem("token")
    );
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {

        const token = localStorage.getItem('token')
        if (token) {

            const getData = async () => {
                try {
                    const res = await currentUserApi()
                    setUser(res)
                }

                catch (error) {
                    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                        localStorage.removeItem("token")
                    }
                }
                finally {
                    setLoading(false);
                }

            }
            getData()
        }
    }, [])
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null)
        navigate("/login");
        queryClient.clear();
    }
    return <userContext.Provider value={{ user, setUser, logout, loading }}>{children}</userContext.Provider>


}
export default UserProvider