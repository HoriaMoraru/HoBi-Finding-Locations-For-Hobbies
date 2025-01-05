import { RouteObject } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import PrivateRoute from "./PrivateRoute.tsx";
import ExplorePage from "../pages/ExplorePage";

const routes: RouteObject[] = [
    {
        path: "/register",
        element: <RegisterPage/>,
    },
    {
        path:"/login",
        element: <LoginPage/>
    },
    {
        path: "/",
        element: <MainPage/>,
    },
    {
        path: "/explore",
        element: <PrivateRoute/>,
        children: [
            {
                path: "", element: <ExplorePage/>
            }
        ]
    }
];

export default routes;