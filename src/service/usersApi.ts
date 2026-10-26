import { api } from "./api";

export const getUsersApi = async () => {
    const res = await api.get("/users");
    return res.data
}

export const premmisionApi = async (id: number,
    permissionName: string,
    newValue: boolean) => {
    const res = await api.put(`/users/${id}/permissions`, { [permissionName]: newValue });
    return res.data
}
