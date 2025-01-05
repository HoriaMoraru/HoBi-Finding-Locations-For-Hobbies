import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";

// Define props including `children`
interface StartExploringButtonProps {
    children: React.ReactNode;
}

const StartExploringButton: React.FC<StartExploringButtonProps> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const handleClick = () => {
        if (isAuthenticated) {
            navigate("/explore"); // Redirect to explore page
        } else {
            navigate("/login"); // Redirect to login page
        }
    };

    return (
        <button className="btn btn-primary btn-lg" onClick={handleClick}>
            {children}
        </button>
    );
};

export default StartExploringButton;
