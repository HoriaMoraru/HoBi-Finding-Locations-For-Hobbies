// src/pages/SavedLocationsPage.tsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SavedLocationsTable from "../components/tables/SavedLocationsTable";
import { auth } from "../config/firebaseConfig";
import { Fade } from "@mui/material";

export interface NamedLocation {
  lat: number;
  lng: number;
  name: string;
}

const SavedLocationsPage: React.FC = () => {
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [selectedHobby, setSelectedHobby] = useState<string | null>(null);
  const [locations, setLocations] = useState<NamedLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // Fetch hobbies
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

  // Fetch saved locations for a hobby
  const fetchSavedLocations = async (hobby: string) => {
    try {
      setIsLoading(true);
      const authToken = await auth.currentUser?.getIdToken();
      const response = await fetch(
        `http://localhost:8080/api/locations/viewSaved/${hobby}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved locations.");
      }

      const data = await response.json();
      setLocations(data);
      setSelectedHobby(hobby);
      setIsModalOpen(true); // Open the modal when locations are loaded
    } catch (error) {
      console.error("Error fetching saved locations:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch saved locations. Please try again later.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // On page load, fetch hobbies
  useEffect(() => {
    fetchHobbies();
  }, []);

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
      <Typography variant="h4" gutterBottom align="center">
        Saved Locations
      </Typography>
      <List>
        {hobbies.map((hobby, index) => (
          <ListItemButton
            key={index}
            onClick={() => fetchSavedLocations(hobby)}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor: "background.paper",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemText
              primary={hobby.toUpperCase()}
              primaryTypographyProps={{ fontWeight: "bold" }}
            />
          </ListItemButton>
        ))}
      </List>

      {/* Modal for displaying saved locations */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fullWidth
        maxWidth="lg"
        TransitionComponent={Fade}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {selectedHobby?.toLocaleUpperCase()}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setIsModalOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <SavedLocationsTable
              locations={locations}
              hobby={selectedHobby!}
              onDelete={() => fetchSavedLocations(selectedHobby!)}
              setSnackbar={setSnackbar}
            />
          )}
        </DialogContent>
      </Dialog>

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

export default SavedLocationsPage;
