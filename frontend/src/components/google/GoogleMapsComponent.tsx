import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { googleMapsConfig } from "../../config/googleMapsConfig.ts";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

interface LatLng {
    lat: number | null;
    lng: number | null;
}

interface GoogleMapsComponentProps {
    center: LatLng;
    markerLocation: LatLng;
    setMarkerLocation: (location: LatLng) => void; // Custom handler type
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
    center,
    markerLocation,
    setMarkerLocation,
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsConfig.apiKey, // Replace with your API key
        libraries: ["places"],
    });

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const newMarkerLocation = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            };

            setMarkerLocation(newMarkerLocation); // Update marker location
        }
    };

    if (loadError) {
        console.error("Error loading Google Maps API:", loadError);
        return <div>Error loading Google Maps API</div>;
    }

    if (!isLoaded || center.lat === null || center.lng === null) {
        return <div>Loading map...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={{ lat: center.lat, lng: center.lng }}
            onClick={handleMapClick}
        >
            {markerLocation.lat !== null && markerLocation.lng !== null && (
                <Marker position={{ lat: markerLocation.lat, lng: markerLocation.lng }} />
            )}
        </GoogleMap>
    );
};

export default GoogleMapsComponent;
