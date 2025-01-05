// GoogleMapsComponent.tsx

import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { googleMapsConfig, GOOGLE_MAPS_LIBRARIES } from "../../config/googleMapsConfig";

const mapContainerStyle = {
    width: "100%",
    height: "500px",
};

const defaultLocation = {
    lat: 37.7749, // Default latitude (San Francisco)
    lng: -122.4194, // Default longitude
};

interface MapState {
    center: { lat: number; lng: number };
    zoom: number;
}

const GoogleMapsComponent: React.FC = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
        const storedLocation = localStorage.getItem("userLocation");
        return storedLocation ? JSON.parse(storedLocation) : null;
    });
    const [mapState, setMapState] = useState<MapState>(() => {
        const storedState = localStorage.getItem("mapState");
        return storedState
            ? JSON.parse(storedState)
            : { center: defaultLocation, zoom: 12 };
    });
    const mapRef = useRef<google.maps.Map | null>(null);

    // Fetch user's current location
    useEffect(() => {
        if (!userLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = { lat: latitude, lng: longitude };
                    console.log("Fetched user location:", location);
                    setUserLocation(location);
                    localStorage.setItem("userLocation", JSON.stringify(location));

                    // Center map on user's location only if it's the first fetch
                    if (
                        mapState.center.lat === defaultLocation.lat &&
                        mapState.center.lng === defaultLocation.lng
                    ) {
                        setMapState((prevState) => ({
                            ...prevState,
                            center: location,
                        }));
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error);
                }
            );
        }
    }, [userLocation, mapState.center.lat, mapState.center.lng]);

    // Update map center when userLocation changes
    useEffect(() => {
        if (userLocation) {
            setMapState((prevState) => ({
                ...prevState,
                center: userLocation,
            }));
        }
    }, [userLocation]);

    // Save map state when map becomes idle
    const handleMapIdle = () => {
        const map = mapRef.current;
        if (map) {
            const center = map.getCenter();
            const zoom = map.getZoom();

            if (center && zoom !== undefined) {
                const newState: MapState = {
                    center: { lat: center.lat(), lng: center.lng() },
                    zoom,
                };
                console.log("Saving map state:", newState);
                setMapState(newState);
                localStorage.setItem("mapState", JSON.stringify(newState));
            }
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={googleMapsConfig.apiKey}
            libraries={GOOGLE_MAPS_LIBRARIES}
        >
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapState.center}
                zoom={mapState.zoom}
                onLoad={(map) => {
                    mapRef.current = map; // Save the map instance
                }}
                onIdle={handleMapIdle}
            >
                {userLocation && (
                    <Marker
                        position={userLocation}
                        label="You"
                        title="Your Location"
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapsComponent;
