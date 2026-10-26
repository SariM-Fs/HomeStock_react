import axios from "axios";

export const getUsersApi = async () => {

    const res = await axios.get("http://localhost:3001/users", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return res.data

}

export const premmisionApi = async (id: number,
    permissionName: string,
    newValue: boolean) => {
    try {
        const res = await axios.put(
            `http://localhost:3001/users/${id}/permissions`,
            { [permissionName]: newValue },
            {
                headers:
                    { Authorization: `Bearer ${localStorage.getItem("token")}` }
            }

        );
        return res.data
    }
    catch (error) {
        console.error("error", error);
        throw error;

    }
}
