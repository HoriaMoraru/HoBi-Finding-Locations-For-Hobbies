import React from "react";
import Navbar from "../../molecules/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Spinner from "../../atoms/spinners/Spinner.tsx";

const Layout: React.FC = () => {
    const { loading } = useSelector((state: RootState) => state.auth);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="app-container d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-fill">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
