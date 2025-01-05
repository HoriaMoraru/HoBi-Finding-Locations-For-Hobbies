import React from "react";
import Navbar from "../../molecules/navbar/Navbar";

const Header: React.FC = () => {
    return (
        <header className="bg-light border-bottom shadow-sm">
            <Navbar />
        </header>
    );
};

export default Header;
