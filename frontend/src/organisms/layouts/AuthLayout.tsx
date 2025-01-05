import React from "react";
import LeftPanel from "../../molecules/navbar/LeftPanel";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Spinner from "../../atoms/spinners/Spinner.tsx";

const AuthLayout: React.FC = React.memo(() => {
    const { loading } = useSelector((state: RootState) => state.auth);

    return (
        <div className="d-flex flex-grow-1">
            <LeftPanel />
            <div className="flex-grow-1 p-3">
                {loading && <Spinner />}
                <Outlet />
            </div>
        </div>
    );
});



export default AuthLayout;
