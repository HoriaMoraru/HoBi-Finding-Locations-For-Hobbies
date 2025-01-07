import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import SavedLocationsTable from "../components/tables/SavedLocationsTable";
import { auth } from "../config/firebaseConfig";
import Spinner from "../atoms/spinners/Spinner";

export interface NamedLocation {
    lat: number;
    lng: number;
    name: string;
}

const SavedLocationsPage: React.FC = () => {
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
    const [locations, setLocations] = useState<NamedLocation[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Fetch hobbies
    const fetchHobbies = async () => {
        try {
            setIsLoading(true);
            const authToken = await auth.currentUser?.getIdToken();
            const response = await fetch("http://localhost:8080/api/hobbies", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch hobbies.");
            }

            const data = await response.json();
            setHobbies(data);
        } catch (error) {
            console.error("Error fetching hobbies:", error);
            alert("Failed to fetch hobbies. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch saved locations for a hobby
    const fetchSavedLocations = async (hobby: string) => {
        try {
            setIsLoading(true);
            const authToken = await auth.currentUser?.getIdToken();
            const response = await fetch(`http://localhost:8080/api/locations/viewSaved/${hobby}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch saved locations.");
            }

            const data = await response.json();
            setLocations(data);
            setSelectedHobby(hobby);
            setIsModalOpen(true); // Open the modal when locations are loaded
        } catch (error) {
            console.error("Error fetching saved locations:", error);
            alert("Failed to fetch saved locations. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // On page load, fetch hobbies
    useEffect(() => {
        fetchHobbies();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="container mt-4">
            <h1>Saved Locations</h1>
            <ul className="list-group">
                {hobbies.map((hobby, index) => (
                    <li
                        key={index}
                        className="list-group-item list-group-item-action"
                        onClick={() => fetchSavedLocations(hobby)}
                        style={{ cursor: "pointer" }}
                    >
                        {hobby.toLocaleUpperCase()}
                    </li>
                ))}
            </ul>

            {/* Modal for displaying saved locations */}
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Saved Locations"
                style={{
                    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        borderRadius: "10px",
                        padding: "20px",
                    },
                }}
            >
                <div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="btn btn-secondary mb-3"
                    >
                        Close
                    </button>
                    <h2>{selectedHobby?.toLocaleUpperCase()}</h2>
                    <SavedLocationsTable
                        locations={locations}
                        hobby={selectedHobby!}
                        onDelete={() => fetchSavedLocations(selectedHobby!)}
                    />
                </div>
            </ReactModal>
        </div>
    );
};

export default SavedLocationsPage;
