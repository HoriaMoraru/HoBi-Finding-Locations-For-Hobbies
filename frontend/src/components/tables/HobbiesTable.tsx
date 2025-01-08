// src/components/tables/HobbiesTable.tsx
import React, { useState } from "react";
import { auth } from "../../config/firebaseConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface HobbiesTableProps {
  hobbies: string[];
  onDelete: () => void; // Callback to refresh hobbies after deletion
}

const HobbiesTable: React.FC<HobbiesTableProps> = ({ hobbies, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Handle delete
  const handleDelete = async (hobby: string) => {
    if (!window.confirm(`Are you sure you want to delete "${hobby}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const authToken = await auth.currentUser?.getIdToken();
      const response = await fetch("http://localhost:8080/api/hobbies", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          hobby: hobby,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete hobby.");
      }

      onDelete(); // Refresh hobbies list after deletion
    } catch (error) {
      console.error("Error deleting hobby:", error);
      alert("Failed to delete hobby. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (hobbies.length === 0) {
    return (
      <Typography variant="body1" align="center">
        No hobbies found. Please add a hobby.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="hobbies table">
        <TableHead>
        </TableHead>
        <TableBody>
          {hobbies.map((hobby, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Typography variant="body1" sx={{ textTransform: "uppercase" }}>
                  {hobby}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Delete Hobby">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(hobby)}
                    disabled={isDeleting}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HobbiesTable;
