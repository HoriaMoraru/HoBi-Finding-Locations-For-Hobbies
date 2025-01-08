// src/components/tables/SavedLocationsTable.tsx

import React from "react";
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
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig";

export interface NamedLocation {
  lat: number;
  lng: number;
  name: string;
}

interface SavedLocationsTableProps {
  locations: NamedLocation[];
  hobby: string; // Current hobby
  onDelete: () => void; // Callback to refresh locations after deletion
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error";
    }>
  >;
}

const SavedLocationsTable: React.FC<SavedLocationsTableProps> = ({
  locations,
  hobby,
  onDelete,
  setSnackbar,
}) => {
  const navigate = useNavigate();

  const handleDelete = async (location: NamedLocation) => {
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
            location: location,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete location. Please try again later.");
      }

      setSnackbar({
        open: true,
        message: "Location deleted successfully!",
        severity: "success",
      });
      onDelete(); // Refresh locations list after deletion
    } catch (error) {
      console.error("Error deleting location:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete location. Please try again later.",
        severity: "error",
      });
    }
  };

  const handleShowOnMap = (location: NamedLocation) => {
    navigate("/explore", { state: { location } });
  };

  if (locations.length === 0) {
    return (
      <Typography variant="body1" align="center">
        No saved locations for {hobby.toUpperCase()}.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table aria-label="saved locations table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell align="center">Map</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((location, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.lat || "N/A"}</TableCell>
              <TableCell>{location.lng || "N/A"}</TableCell>
              <TableCell align="center">
                <Tooltip title="Show on Map">
                  <IconButton
                    color="primary"
                    onClick={() => handleShowOnMap(location)}
                  >
                    <MapIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(location)}
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

export default SavedLocationsTable;
