// src/components/InfoWindowContent.tsx
import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";

interface LatLng {
    lat: number;
    lng: number;
}

interface InfoWindowContentProps {
    name: string;
    position: LatLng;
    onSave: (name: string, position: LatLng, hobby: string) => void;
}

const InfoWindowContent: React.FC<InfoWindowContentProps> = ({ name, position, onSave }) => {
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [selectedHobby, setSelectedHobby] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Fetch user's hobbies from the backend
    const fetchHobbies = async () => {
        setLoading(true);
        setError("");
        try {
            const authToken = await auth.currentUser?.getIdToken();
            if (!authToken) {
                throw new Error("User not authenticated. Please log in again.");
            }

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
            setHobbies(data.hobbies); // Adjust based on your backend response structure
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHobbies();
    }, []);

    const handleSave = () => {
        if (selectedHobby) {
            onSave(name, position, selectedHobby);
        } else {
            setError("Please select a hobby to associate with this location.");
        }
    };

    return (
        <div style={{ padding: "10px", textAlign: "center", width: "250px" }}>
            <h3 style={{ margin: "5px 0" }}>{name}</h3>
            {loading ? (
                <p>Loading hobbies...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : hobbies.length > 0 ? (
                <div>
                    <label htmlFor="hobby-select">Select Hobby:</label>
                    <br />
                    <select
                        id="hobby-select"
                        value={selectedHobby}
                        onChange={(e) => setSelectedHobby(e.target.value)}
                        style={{ marginTop: "5px", padding: "5px", width: "100%" }}
                    >
                        <option value="">--Choose a hobby--</option>
                        {hobbies.map((hobby, index) => (
                            <option key={index} value={hobby}>
                                {hobby}
                            </option>
                        ))}
                    </select>
                    <br />
                    <button
                        onClick={handleSave}
                        style={{
                            marginTop: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        Confirm Save
                    </button>
                </div>
            ) : (
                <p>No hobbies found.</p>
            )}
        </div>
    );
};

export default InfoWindowContent;
