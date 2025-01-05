import { useEffect, useRef, useState } from "react";
import GoogleMapsComponent from "../components/google/GoogleMapsComponent";
import SearchBox from "../components/google/SearchBox";

interface LatLng {
    lat: number | null;
    lng: number | null;
}

const ExplorePage = () => {
    const [center, setCenter] = useState<LatLng>(() => {
        const storedLocation = localStorage.getItem("userLocation");
        return storedLocation ? JSON.parse(storedLocation) : { lat: null, lng: null };
    });

    const [markerLocation, setMarkerLocation] = useState<LatLng>(() => {
        const storedMarker = localStorage.getItem("markerLocation");
        return storedMarker ? JSON.parse(storedMarker) : { lat: null, lng: null };
    });

    const [selected, setSelected] = useState<LatLng | null>(null);
    const locationFetched = useRef(false); // Prevent duplicate geolocation fetches

    useEffect(() => {
        console.log("ExplorePage mounted");

        if (!locationFetched.current && (center.lat === null || center.lng === null)) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation = { lat: latitude, lng: longitude };
                    console.log("User location fetched:", userLocation);

                    setCenter(userLocation);
                    setMarkerLocation(userLocation);
                    localStorage.setItem("userLocation", JSON.stringify(userLocation));
                    localStorage.setItem("markerLocation", JSON.stringify(userLocation));
                },
                (error) => {
                    console.error("Error fetching geolocation:", error);
                    const fallbackLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
                    console.log("Using fallback location:", fallbackLocation);

                    setCenter(fallbackLocation);
                    setMarkerLocation(fallbackLocation);
                    localStorage.setItem("userLocation", JSON.stringify(fallbackLocation));
                    localStorage.setItem("markerLocation", JSON.stringify(fallbackLocation));
                }
            );

            locationFetched.current = true; // Mark location as fetched
        }

        return () => {
            console.log("ExplorePage unmounted");
        };
    }, [center.lat, center.lng]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "82vh" }}>
            <div style={{ padding: "10px" }}>
                <SearchBox setSelected={setSelected} />
            </div>
            <div style={{ flex: 1 }}>
                <GoogleMapsComponent
                    center={selected || center}
                    markerLocation={markerLocation}
                    setMarkerLocation={(location) => {
                        setMarkerLocation(location);
                        localStorage.setItem("markerLocation", JSON.stringify(location));
                    }}
                />
            </div>
        </div>
    );
};

export default ExplorePage;
