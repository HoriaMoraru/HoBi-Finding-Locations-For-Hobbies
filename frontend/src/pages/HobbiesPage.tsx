// src/pages/HobbiesPage.tsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HobbiesTable from "../components/tables/HobbiesTable";
import AddHobbyModal from "../molecules/modals/AddHobbyModal"; // Assuming the path
import { auth } from "../config/firebaseConfig";

const HobbiesPage: React.FC = () => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Fetch hobbies from the backend
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
      setSnackbar({
        open: true,
        message: "Failed to fetch hobbies. Please try again later.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new hobby
  const handleAdd = async (newHobby: string) => {
    try {
      setIsLoading(true);
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
        throw new Error("Failed to add hobby.");
      }

      setIsAdding(false);
      setSnackbar({
        open: true,
        message: "Hobby added successfully!",
        severity: "success",
      });
      await fetchHobbies(); // Refresh hobbies after adding
    } catch (error) {
      console.error("Error adding hobby:", error);
      setSnackbar({
        open: true,
        message: "Failed to add hobby. Please try again later.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a hobby
  const handleDelete = async () => {
    // This function will be passed to HobbiesTable
    await fetchHobbies();
  };

  // On component mount, fetch hobbies
  useEffect(() => {
    fetchHobbies();
  }, []); // Empty dependency array ensures it runs once

  // Handle closing the Snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Hobbies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAdding(true)}
        >
          Add Hobby
        </Button>
      </Box>

      <HobbiesTable hobbies={hobbies} onDelete={handleDelete} />

      {/* Add Hobby Modal */}
      <AddHobbyModal
        open={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAdd}
      />

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HobbiesPage;
