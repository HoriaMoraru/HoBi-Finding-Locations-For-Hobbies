import { RouteObject } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";


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
];

export default routes;