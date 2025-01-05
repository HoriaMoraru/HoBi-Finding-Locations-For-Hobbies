import React from "react";
import { useNavigate } from "react-router-dom";

const LeftPanel: React.FC = () => {
    const navigate = useNavigate();

    const handleSavedLocationsClick = () => {
        navigate("/saved-locations"); // Navigate to saved locations page
    };

    const handleHobbiesClick = () => {
        navigate("/hobbies"); // Navigate to hobbies page
    };

    return (
        <div className="left-panel">
            <button className="btn btn-primary w-100 mb-3" onClick={handleSavedLocationsClick}>
                Saved Locations
            </button>
            <button className="btn btn-secondary w-100" onClick={handleHobbiesClick}>
                Hobbies
            </button>
        </div>
    );
};

export default LeftPanel;
