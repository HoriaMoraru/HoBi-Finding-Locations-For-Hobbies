import React, { useState } from "react";

interface AddHobbyModalProps {
    onClose: () => void;
    onAdd: (newHobby: string) => void;
}

const AddHobbyModal: React.FC<AddHobbyModalProps> = ({ onClose, onAdd }) => {
    const [newHobby, setNewHobby] = useState("");

    const handleAdd = () => {
        if (newHobby.trim() !== "") {
            onAdd(newHobby.trim());
        }
    };

    return (
        <div className="modal d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Hobby</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter hobby"
                            value={newHobby}
                            onChange={(e) => setNewHobby(e.target.value)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button className="btn btn-success" onClick={handleAdd}>
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHobbyModal;
