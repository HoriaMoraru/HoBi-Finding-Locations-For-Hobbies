import { RouteObject } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";


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
        element: <div>Welcome to the Home Page</div>,
    },
];

export default routes;