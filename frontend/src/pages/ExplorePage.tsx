import React from "react";
import GoogleMapComponent from "../components/google/GoogleMapsComponent";

const ExplorePage: React.FC = () => {
    return (
        <div className="container mt-4">
            <h1>Explore Nearby Locations</h1>
            <GoogleMapComponent />
        </div>
    );
};

export default ExplorePage;
