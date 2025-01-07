
import { RouteObject, Navigate } from "react-router-dom";
import Layout from "../organisms/layouts/Layout";
import PrivateRoute from "./PrivateRoute";

import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ExplorePage from "../pages/ExplorePage";
import AuthLayout from "../organisms/layouts/AuthLayout.tsx";
import HobbiesPage from "../pages/HobbiesPage.tsx";
import SavedLocationsPage from "../pages/SavedLocationsPage.tsx";

const routes: RouteObject[] = [
    {

        path: "/",
        element: <Layout />, // Layout includes Navbar
        children: [
            {
                path: "", // Main Page (Public)
                element: <MainPage />,
            },
            {
                element: <PrivateRoute />, // Wrap with PrivateRoute
                children: [
                    {
                        element: <AuthLayout />,
                        children: [
                            {
                                path: "explore",
                                element: <ExplorePage/>
                            },
                            {
                                path: "explore/hobbies",
                                element: <HobbiesPage/>
                            },
                            {
                                path: "explore/saved-locations",
                                element: <SavedLocationsPage/>
                            }
                        ]
                    },
                ],
            },
            // Add more routes here as needed
        ],
    },
    {
        path: "*", // Fallback for undefined routes
        element: <Navigate to="/" replace />,
    },
    {
        path: "login", // Login Page (Public)
        element: <LoginPage />,
    },
    {
        path: "register", // Register Page (Public)
        element: <RegisterPage />,
    },
];

export default routes;
