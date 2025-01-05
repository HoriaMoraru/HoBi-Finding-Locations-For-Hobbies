import React from "react";
import LeftPanel from "../../molecules/navbar/LeftPanel";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Spinner from "../../atoms/spinners/Spinner.tsx";

const AuthLayout: React.FC = () => {
    const { loading } = useSelector((state: RootState) => state.auth); // Get loading state from Redux

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="d-flex flex-grow-1">
            <LeftPanel />
            <div className="flex-grow-1 p-3">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
