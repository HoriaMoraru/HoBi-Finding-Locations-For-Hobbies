import React from "react";
import Header from "../organisms/header/Header";

const MainPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main className="container mt-4">
                <p className="text-center fs-4">Welcome to HoBi</p>
            </main>
        </div>
    );
};

export default MainPage;
