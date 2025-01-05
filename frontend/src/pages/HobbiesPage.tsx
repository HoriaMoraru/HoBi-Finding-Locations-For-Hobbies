import React, { useState } from "react";
import HobbiesTable from "../components/tables/HobbiesTable";
import AddHobbyModal from "../molecules/modals/AddHobbyModal";
import { auth } from "../config/firebaseConfig";


const HobbiesPage: React.FC = () => {
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // Delete a hobby
    const handleDelete = async (index: number) => {
        try {
            // Make a POST request to the backend
            const authToken = await auth.currentUser?.getIdToken();
            const response = await fetch("http://localhost:8080/api/hobbies", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    hobby: hobbies[index],
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to delete hobby. Please try again later.`);
            }

            setHobbies(hobbies.filter((_, i) => i !== index));

        } catch (error) {
            console.error("Error during hobby delete:", error);
            alert("Failed to delete hobby. Please try again later.");
        }
    };

    // Add a new hobby
    const handleAdd = async (newHobby: string) => {
        try {
            // Make a POST request to the backend
            const authToken = await auth.currentUser?.getIdToken();
            const response = await fetch("http://localhost:8080/api/hobbies", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    hobby: newHobby,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to add hobby. Please try again later.`);
            }
            setHobbies([...hobbies, newHobby]);
            setIsAdding(false);

        } catch (error) {
            console.error("Error during hobby adding:", error);
            alert("Failed to add hobby. Please try again later.");
        }
    };

    return (
        <div className="container mt-4">
            <h1>Hobbies</h1>
            <button
                className="btn btn-success mb-3"
                onClick={() => setIsAdding(true)}
            >
                + Add Hobby
            </button>
            <HobbiesTable hobbies={hobbies} onDelete={handleDelete} />
            {isAdding && (
                <AddHobbyModal
                    onClose={() => setIsAdding(false)}
                    onAdd={handleAdd}
                />
            )}
        </div>
    );
};

export default HobbiesPage;
