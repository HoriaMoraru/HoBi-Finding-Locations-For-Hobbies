import React, { useState, useEffect } from "react";
import HobbiesTable from "../components/tables/HobbiesTable";
import AddHobbyModal from "../molecules/modals/AddHobbyModal";
import { auth } from "../config/firebaseConfig";
import Spinner from "../atoms/spinners/Spinner.tsx";

const HobbiesPage: React.FC = () => {
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch hobbies from the backend
    const fetchHobbies = async () => {
        try {
            const authToken = await auth.currentUser?.getIdToken();
            const response = await fetch("http://localhost:8080/api/hobbies", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch hobbies. Please try again later.");
            }

            const data = await response.json();
            setHobbies(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching hobbies:", error);
            alert("Failed to fetch hobbies. Please try again later.");
        }
    };

    // Add a new hobby
    const handleAdd = async (newHobby: string) => {
        try {
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
                throw new Error("Failed to add hobby. Please try again later.");
            }

            setIsAdding(false);
            await fetchHobbies(); // Refresh hobbies after adding
        } catch (error) {
            console.error("Error during hobby addition:", error);
            alert("Failed to add hobby. Please try again later.");
        }
    };

    useEffect(() => {
        fetchHobbies();
    }, [hobbies.length]); // Fetch hobbies when the component mounts

    if (isLoading) {
        return (<Spinner />);
    }

    return (
        <div className="container mt-4">
            <h1>Hobbies</h1>
            <button
                className="btn btn-success mb-3"
                onClick={() => setIsAdding(true)}
            >
                + Add Hobby
            </button>
            <HobbiesTable hobbies={hobbies} onDelete={() => fetchHobbies()} />
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
