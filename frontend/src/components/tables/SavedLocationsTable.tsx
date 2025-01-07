import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";

interface NamedLocation {
    lat: number;
    lng: number;
    name: string;
}

interface SavedLocationsTableProps {
    locations: NamedLocation[];
    hobby: string; // Add the current hobby as a prop
    onDelete: () => void; // Callback to refresh locations after deletion
}

const SavedLocationsTable: React.FC<SavedLocationsTableProps> = ({ locations, hobby, onDelete }) => {
    const navigate = useNavigate();

    const handleDelete = async (index: number) => {
        try {
            const authToken = await auth.currentUser?.getIdToken();

            const response = await fetch(
                `http://localhost:8080/api/locations/remove/${hobby}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        location: locations[index],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete location. Please try again later.");
            }

            onDelete(); // Refresh locations list after deletion
        } catch (error) {
            console.error("Error deleting location:", error);
            alert("Failed to delete location. Please try again later.");
        }
    };

    const handleShowOnMap = (location: NamedLocation) => {
        navigate("/explore", { state: { location } });
    };

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {locations.map((location, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{location.name}</td>
                            <td>{location.lat || "N/A"}</td>
                            <td>{location.lng || "N/A"}</td>
                            <td>
                                <button
                                    className="show-map-button"
                                    onClick={() => handleShowOnMap(location)}
                                    style={{
                                        backgroundColor: "#007bff",
                                        border: "none",
                                        color: "#fff",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    title="Show on Map"
                                >
                                    Show on Map
                                </button>
                            </td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(index)}
                                    style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "red",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                    }}
                                    title="Remove Location"
                                >
                                    &#x2716;
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SavedLocationsTable;
