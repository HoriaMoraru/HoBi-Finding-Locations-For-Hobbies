import { RouteObject } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";


const routes: RouteObject[] = [
    {
        path: "/register",
        element: <RegisterPage/>,
    },
    {
        path: "/",
        element: <div>Welcome to the Home Page</div>,
    },
];

export default routes;