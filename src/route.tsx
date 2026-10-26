import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import UserProvider from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import ShopList from "./pages/ShopList";
import Permissions from "./pages/Premissions";
import Layout from "./components/Layout";
import AddProduct from "./components/AddProduct";
import ProtectedRoute from "./components/ProtectedRoute";


export const route = createBrowserRouter([
    {
        path: '/',
        element: <UserProvider><App /></UserProvider>,
       children: [
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { path: '/', element: <Home /> },
                    { path: 'inventory', element: <Inventory /> },
                    { path: 'shop-List', element: <ShopList /> },
                    {
                        element: <ProtectedRoute adminOnly />,
                        children: [
                            { path: "inventory/add", element: <AddProduct /> },
                            { path: 'permissions', element: <Permissions /> },
                        ],
                    },
                ],
            },
        ],
    },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
],

    },
]);