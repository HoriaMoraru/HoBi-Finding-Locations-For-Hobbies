import React, { useState, useEffect } from "react";
import GoogleMapComponent from "../components/google/GoogleMapsComponent";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Spinner from "../atoms/spinners/Spinner.tsx";

const ExplorePage: React.FC = () => {
    const { user, loading: authLoading } = useSelector((state: RootState) => state.auth); // Authentication state
    const [ready, setReady] = useState(false); // Local state for readiness

    useEffect(() => {

        if (!authLoading && user) {
            setReady(true);
        }
    }, [authLoading, user]);

    if (authLoading || !ready) {
        // Show a spinner while waiting for auth or other dependencies
        return <Spinner />;
    }

    return (
        <div className="container mt-4">
            <h1>Explore Nearby Locations</h1>
            <GoogleMapComponent />
        </div>
    );
};

export default ExplorePage;
