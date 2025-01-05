import React, { useState } from "react";
import HobbiesTable from "../components/tables/HobbiesTable";
import AddHobbyModal from "../molecules/modals/AddHobbyModal";


const HobbiesPage: React.FC = () => {
    const [hobbies, setHobbies] = useState<string[]>([
        "Reading",
        "Traveling",
        "Cooking",
        "Gardening",
    ]);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    // Delete a hobby
    const handleDelete = (index: number) => {
        setHobbies(hobbies.filter((_, i) => i !== index));
    };

    // Add a new hobby
    const handleAdd = (newHobby: string) => {
        setHobbies([...hobbies, newHobby]);
        setIsAdding(false);
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
