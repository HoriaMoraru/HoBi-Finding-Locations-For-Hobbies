// src/components/LeftPanel.tsx

import React from "react";
import { Link, useLocation } from "react-router-dom";

const LeftPanel: React.FC = () => {
    const location = useLocation();

    return (
        <div className="left-panel">
            <Link
                to="/explore/saved-locations"
                className={`btn w-100 mb-3 ${
                    location.pathname === "/explore/saved-locations"
                        ? "btn-primary"
                        : "btn-outline-primary"
                }`}
                aria-label="Navigate to Saved Locations"
            >
                Saved Locations
            </Link>
            <Link
                to="/explore/hobbies"
                className={`btn w-100 ${
                    location.pathname === "/explore/hobbies"
                        ? "btn-secondary"
                        : "btn-outline-secondary"
                }`}
                aria-label="Navigate to Hobbies"
            >
                Hobbies
            </Link>
        </div>
    );
};

export default LeftPanel;
