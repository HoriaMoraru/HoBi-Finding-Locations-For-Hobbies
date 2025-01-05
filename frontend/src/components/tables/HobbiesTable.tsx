import React from "react";
import "./HobbiesTable.css"; // Import custom CSS for styling

interface HobbiesTableProps {
    hobbies: string[];
    onDelete: (index: number) => void;
}

const HobbiesTable: React.FC<HobbiesTableProps> = ({ hobbies, onDelete }) => {
    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Hobby</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {hobbies.map((hobby, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{hobby}</td>
                        <td>
                            <button
                                className="delete-button"
                                onClick={() => onDelete(index)}
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
