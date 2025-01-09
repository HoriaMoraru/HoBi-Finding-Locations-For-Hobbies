import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuButton from "../buttons/MenuButton";
import Select from "react-select";
import { auth } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks"
import { fetchHobbyLocations } from "../../store/mapSlice"; // import the thunk
import "./LeftPanel.css";
import savedLocationsIcon from '../../assets/images/saved.png';
import hobbiesIcon from '../../assets/images/hobbies-logo.png';
import mapIcon from '../../assets/images/map-logo.png';
import findIcon from '../../assets/images/search-logo.png';

const LeftPanel: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [isHobbiesOpen, setIsHobbiesOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Fetch user hobbies
  const handleFetchHobbies = async () => {
    try {
      const authToken = await auth.currentUser?.getIdToken();
      if (!authToken) {
        toast.error("User not authenticated. Please log in again.");
        return;
      }
      const response = await fetch("http://localhost:8080/api/hobbies", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to fetch hobbies");
        return;
      }

      const data = await response.json();
      setHobbies(data);

      if (data.length === 0) {
        toast.info("Please add hobbies first!");
      }

      // Toggle show/hide of hobbies dropdown
      setIsHobbiesOpen((prev) => !prev);
    } catch (error) {
      console.error("Error fetching hobbies:", error);
      toast.error("Error fetching hobbies");
    }
  };

  // Handle button click for hobbies
  const handleHobbyClick = async (hobby: string) => {
    try {

      const resultAction = await dispatch(fetchHobbyLocations(hobby));
      if (fetchHobbyLocations.rejected.match(resultAction)) {
        toast.error("Failed to fetch locations for " + hobby);
      } else {
        toast.success(`Fetched locations for ${hobby}!`);
      }
    } catch (error) {
      console.error("Error fetching hobbies:", error);
      toast.error("Error fetching hobbies");
    }
  };

  return (
    <div className="left-panel p-2">
      <MenuButton onClick={handleToggleMenu} />

      {isMenuOpen && (
        <div className="d-flex flex-column gap-3 justify-content-around mt-3">
          <Link
            to="/explore/saved-locations"
            className={`btn ${
              location.pathname === "/explore/saved-locations"
                ? "btn-success"
                : "btn-outline-success"
            }`}
              data-tooltip="Saved Locations"
          >

            <img src={savedLocationsIcon} alt="Saved Locations" className="btn-icon" />
          </Link>

          <Link
            to="/explore/hobbies"
            className={`btn ${
              location.pathname === "/explore/hobbies"
                ? "btn-success"
                : "btn-outline-success"
            }`}
              data-tooltip="My Hobbies"
          >
            <img src={hobbiesIcon} alt="Hobbies" className="btn-icon" />
          </Link>
          <Link
            to="/explore"
            className={`btn ${
                location.pathname === "/explore" ? "btn-primary" : "btn-outline-primary"
            }`}
            data-tooltip="Explore Map"
            >
            <img src={mapIcon} alt="Map" className="btn-icon" />
           </Link>

          {location.pathname === "/explore" && (
            <button onClick={handleFetchHobbies} className="btn btn-info">
              <img src={findIcon} alt="Find" className="btn-icon" />
            </button>
          )}

            {isHobbiesOpen && hobbies.length > 0 && (
            <Select
                options={hobbies.map((hobby) => ({ label: hobby.toUpperCase(), value: hobby }))}
                onChange={(selectedOption) => {
                if (selectedOption?.value) {
                    handleHobbyClick(selectedOption.value);
                }
                }}
                placeholder="Select a hobby..."
                styles={{
                control: (base) => ({
                    ...base,
                    borderRadius: "8px",
                    borderColor: "#ccc",
                    padding: "2px", // Reduce padding for a compact design
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#4caf50" : "#fff",
                    color: state.isFocused ? "#fff" : "#000",
                    textTransform: "uppercase", // Ensure options are in uppercase
                    fontSize: "12px", // Smaller font size
                }),
                menu: (base) => ({
                    ...base,
                    width: "180px", // Narrow dropdown width
                }),
                }}
            />
            )}
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
