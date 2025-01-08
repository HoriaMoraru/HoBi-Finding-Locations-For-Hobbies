// src/store/mapSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../config/firebaseConfig";

// For typed usage, define your data shape
interface HobbyLocation {
  lat: number;
  lng: number;
  name: string;
}

interface MapState {
  hobbyLocations: HobbyLocation[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: MapState = {
  hobbyLocations: [],
  loading: false,
  error: null,
};

// 1) Thunk to fetch hobby locations from your backend
export const fetchHobbyLocations = createAsyncThunk<
  HobbyLocation[],    // Return type of the payload creator
  string,             // Argument (e.g., the hobby name)
  { rejectValue: string }
>(
  "map/fetchHobbyLocations",
  async (hobby, { rejectWithValue }) => {
    try {
      const authToken = await auth.currentUser?.getIdToken();
      const response = await fetch(`http://localhost:8080/api/locations/fetchLocations/${hobby}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        return rejectWithValue("Error fetching hobby locations");
      }
      const data = await response.json();
      return data; // This should be HobbyLocation[]
    } catch (error) {
      return rejectWithValue("Error fetching hobby locations: " + error);
    }
  }
);

// 2) Create the slice
const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    // If you want a direct way to set locations (e.g. setHobbyLocations([...]))
    setHobbyLocations(state, action) {
      state.hobbyLocations = action.payload;
    },
    // You can have other synchronous reducers, e.g. clearHobbyLocations
    clearHobbyLocations(state) {
      state.hobbyLocations = [];
    },
  },
  extraReducers: (builder) => {
    // 3) Handle the thunk lifecycle
    builder
      .addCase(fetchHobbyLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHobbyLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.hobbyLocations = action.payload;
      })
      .addCase(fetchHobbyLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching hobby locations";
      });
  },
});

export const { setHobbyLocations, clearHobbyLocations } = mapSlice.actions;
export default mapSlice.reducer;
