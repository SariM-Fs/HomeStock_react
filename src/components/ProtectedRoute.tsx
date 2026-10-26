import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { userContext } from "../context/UserContext";

const ProtectedRoute = ({ adminOnly = false }: { adminOnly?: boolean }) => {
    const { user } = useContext(userContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user.role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
export default ProtectedRoute
