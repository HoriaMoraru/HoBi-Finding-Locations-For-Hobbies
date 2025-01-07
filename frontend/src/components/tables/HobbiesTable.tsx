import React, { useEffect } from "react";
import "./HobbiesTable.css";
import { auth } from "../../config/firebaseConfig";

interface HobbiesTableProps {
    hobbies: string[];
    onDelete: () => void; // Callback to refresh hobbies after deletion
}

const HobbiesTable: React.FC<HobbiesTableProps> = ({ hobbies, onDelete }) => {
    // Handle delete
    const handleDelete = async (index: number) => {
        try {
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
                throw new Error("Failed to delete hobby. Please try again later.");
            }

            onDelete(); // Refresh hobbies list after deletion
        } catch (error) {
            console.error("Error deleting hobby:", error);
            alert("Failed to delete hobby. Please try again later.");
        }
    };

    useEffect(() => {
        // Effect runs when the length of hobbies changes
    }, [hobbies.length]);

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Hobby</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {hobbies.map((hobby, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{hobby.toUpperCase()}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(index)}
                                >
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HobbiesTable;
