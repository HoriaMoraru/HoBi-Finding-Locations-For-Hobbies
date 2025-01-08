// src/pages/ExplorePage/locationService.ts

import { auth } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
import { LatLng, MyCustomRouteData } from "./types";

/**
 * Fetch all hobbies for the current user (requires Firebase auth token).
 */
export const fetchHobbies = async (): Promise<string[]> => {
  try {
    const authToken = await auth.currentUser?.getIdToken();
    if (!authToken) {
      toast.error("User not authenticated. Please log in again.");
      return [];
    }

    const response = await fetch("http://localhost:8080/api/hobbies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch hobbies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    toast.error("Error fetching hobbies");
    return [];
  }
};

/**
 * Save a location to the backend for the current user (requires Firebase auth token).
 */
export const saveLocation = async (
  name: string,
  position: LatLng,
  hobby: string
): Promise<void> => {
  try {
    const authToken = await auth.currentUser?.getIdToken();
    if (!authToken) {
      toast.error("User not authenticated. Please log in again.");
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/locations/save/${hobby}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          location: {
            name,
            lat: position.lat,
            lng: position.lng,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save location. Please try again later.");
    }

    toast.success(`Location saved successfully!`);
  } catch (error) {
    console.error("Error saving location:", error);
    toast.error("Location already saved!");
  }
};

export const updateUserLocation = async (location: LatLng): Promise<void> => {
    try {
      const authToken = await auth.currentUser?.getIdToken();
      if (!authToken) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/locations/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error("Failed to update location.");
      }

      console.log("Location updated successfully.");
    } catch (error) {
      console.error("Error updating user location:", error);
      toast.error("Failed to update location.");
    }
  };

  export const fetchRoute = async (location: LatLng): Promise<MyCustomRouteData | null> => {
    try {
     const authToken = await auth.currentUser?.getIdToken();
     if (!authToken) {
        toast.error("User not authenticated. Please log in again.");
        return null;
     }

      const response = await fetch("http://localhost:8080/api/locations/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch route");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching route:", error);
      throw error;
    }
  };
