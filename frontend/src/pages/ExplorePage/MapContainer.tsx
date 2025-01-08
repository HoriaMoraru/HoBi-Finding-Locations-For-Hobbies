// src/pages/ExplorePage/MapContainer.tsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { clearHobbyLocations } from "../../store/mapSlice";
import { fetchHobbies, saveLocation, updateUserLocation, fetchRoute } from "./locationService";
import { useLoadScript } from "@react-google-maps/api";
import { googleMapsConfig } from "../../config/googleMapsConfig";
import "react-toastify/dist/ReactToastify.css";
import SearchBar from "../../components/google/SearchBar";
import { LatLng, MyCustomRouteData } from "./types";
import { toast } from "react-toastify";
import myLocationIcon from "../../assets/images/return-tran.png";
import deleteIcon from "../../assets/images/x-logo.png";
import trafficLogo from "../../assets/images/traffic-logo.png";
import transitLogo from "../../assets/images/transit-logo.png";
import { decode } from "@googlemaps/polyline-codec";

const mapContainerStyle = {
  width: "100%",
  height: "86vh",
};


const MapContainer: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const activeRouteRef = useRef<google.maps.Polyline | null>(null);

  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const transitLayerRef = useRef<google.maps.TransitLayer | null>(null);

    // Redux
    const dispatch = useDispatch();
    const { hobbyLocations } = useSelector((state: RootState) => state.map);

    // Markers for the hobbyLocations
    const [hobbyMarkers, setHobbyMarkers] = useState<google.maps.Marker[]>([]);

    const [showTraffic, setShowTraffic] = useState<boolean>(false);
    const [showTransit, setShowTransit] = useState<boolean>(false);

  // Determine user language for Google Maps
  const userLanguage = navigator.language || "en";

  // Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: ["places"],
    language: userLanguage,
  });

  /**
   * Center the map on the selected location from the search bar.
   */
  const handleSearchSelect = (location: LatLng) => {
    if (mapRef.current) {
      mapRef.current.setCenter(location);
      mapRef.current.setZoom(14);
    }
  };

    // Toggle traffic layer
    const toggleTrafficLayer = () => {
        setShowTraffic((prev) => {
          const newVal = !prev;
          if (trafficLayerRef.current) {
            trafficLayerRef.current.setMap(newVal ? mapRef.current : null);
          }
          return newVal;
        });
      };

      // Toggle transit layer
      const toggleTransitLayer = () => {
        setShowTransit((prev) => {
          const newVal = !prev;
          if (transitLayerRef.current) {
            transitLayerRef.current.setMap(newVal ? mapRef.current : null);
          }
          return newVal;
        });
      };

  /**
   * Attempt to get the user's current location.
   * If that fails, set a fallback location (e.g., San Francisco).
   */
  const fetchCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(location);

        // If the map is already initialized, center the map and update the marker.
        if (mapRef.current) {
          mapRef.current.setCenter(location);
          mapRef.current.setZoom(15);
        }
        if (markerRef.current) {
          markerRef.current.setPosition(location);
        }
      },
      (error) => {
        console.error("Error fetching user location:", error);
        const fallbackLocation = { lat: 37.7749, lng: -122.4194 };
        setCurrentLocation(fallbackLocation);

        // If the map is already initialized, center the map and update the marker.
        if (mapRef.current) {
          mapRef.current.setCenter(fallbackLocation);
        }
        if (markerRef.current) {
          markerRef.current.setPosition(fallbackLocation);
        }
      }
    );
  };

  function drawCustomRoute(routeData: MyCustomRouteData) {
    if (!mapRef.current) return;

    // 1) Remove the old route if it exists
    if (activeRouteRef.current) {
      activeRouteRef.current.setMap(null);
      activeRouteRef.current = null;
    }

    // 2) Decode the path
    const decodedPath = decode(routeData.overviewPolyline.encodedPath).map(
      ([lat, lng]) => ({ lat, lng })
    );

    const newPolyline = new google.maps.Polyline({
      path: decodedPath,
      strokeColor: "#FF0000",
      strokeWeight: 5,
    });

    newPolyline.addListener("click", () => {
        // Hide the polyline by removing it from the map
        newPolyline.setMap(null);
        // Clear our reference
        activeRouteRef.current = null;
      });

    newPolyline.setMap(mapRef.current);
    activeRouteRef.current = newPolyline;
  }

  /**
   * Initialize the Google Map once we have a location and the script is loaded.
   */
  const initMap = (location: LatLng) => {
    if (!mapContainerRef.current) {
      console.error("Map container not found.");
      return;
    }

    // Create the map
    const map = new google.maps.Map(mapContainerRef.current, {
      center: location,
      zoom: 14,
    });
    mapRef.current = map;

    // Create a marker for the current location
    const marker = new google.maps.Marker({
      position: location,
      map,
      title: "Your Location",
    });
    markerRef.current = marker;

    // InfoWindow to show on map click
    const infoWindow = new google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;

    trafficLayerRef.current = new google.maps.TrafficLayer();
    transitLayerRef.current = new google.maps.TransitLayer();

    // Initially show them if the state is `true`
    if (showTraffic && trafficLayerRef.current) {
      trafficLayerRef.current.setMap(map);
    }
    if (showTransit && transitLayerRef.current) {
      transitLayerRef.current.setMap(map);
    }

    // Handle map clicks (using placeId)
    map.addListener(
      "click",
      (event: google.maps.MapMouseEvent & { placeId?: string }) => {
        // If user clicked on a place
        if (event.placeId) {
          const service = new google.maps.places.PlacesService(map);
          service.getDetails(
            {
              placeId: event.placeId,
              fields: ["name", "geometry"],
            },
            (place, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                place
              ) {
                const name = place.name || "Unnamed Location";
                const position = {
                  lat: place.geometry?.location?.lat() || 0,
                  lng: place.geometry?.location?.lng() || 0,
                };

                // Create unique IDs for dynamic elements
                const saveButtonId = `save-button-${Date.now()}`;
                const hobbiesContainerId = `hobbies-container-${Date.now()}`;
                const showRouteButtonId = `show-route-button-${Date.now()}`;

                // Render the InfoWindow content
                infoWindow.setContent(`
                  <div style="padding: 10px; text-align: center;">
                    <h3 style="margin: 5px;">${name}</h3>
                    <button id="${saveButtonId}" style="padding: 8px 12px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                      Save Location
                    </button>
                  <button id="${showRouteButtonId}" style="margin-top: 10px; padding: 8px 12px; background-color: #28a745; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                    Show Route
                  </button>
                    <div id="${hobbiesContainerId}" style="margin-top: 10px; display: none;"></div>
                  </div>
                `);
                infoWindow.setPosition(position);
                infoWindow.open(map);

                setIsInfoWindowOpen(true);

                // Close InfoWindow callback
                infoWindow.addListener("closeclick", () => {
                  setIsInfoWindowOpen(false);
                });

                // Because InfoWindow content is set dynamically, we wait a tick to add event listeners
                setTimeout(() => {
                    const saveButton = document.getElementById(saveButtonId);
                    const hobbiesContainer = document.getElementById(hobbiesContainerId);
                    const showRouteButton = document.getElementById(showRouteButtonId);

                    if (showRouteButton) {
                      showRouteButton.addEventListener("click", async () => {

                        try {
                          const routeData = await fetchRoute(position);

                          if (!routeData) {
                            toast.error("Could not fetch route!");
                            return;
                          }
                          if (routeData) {
                            toast.success("Route fetched!");
                            drawCustomRoute(routeData);
                          } else {
                            toast.error("Could not fetch route!");
                          }
                        } catch (error) {
                          console.error("Error fetching route:", error);
                        }
                      });
                    } else {
                      console.error("Show Route Button not found in the DOM.");
                    }

                    if (saveButton && hobbiesContainer) {
                      saveButton.addEventListener("click", async () => {
                        const hobbies = await fetchHobbies();
                        if (hobbies.length > 0) {
                          let listHTML = `<ul style="list-style: none; padding: 0; margin: 0;">`;
                          hobbies.forEach((hobby) => {
                            listHTML += `
                              <li
                                style="margin: 5px 0; cursor: pointer; background: #f1f1f1; padding: 8px; border-radius: 4px;"
                              >
                                ${hobby.toLocaleUpperCase()}
                              </li>`;
                          });
                          listHTML += `</ul>`;
                          hobbiesContainer.innerHTML = listHTML;
                          hobbiesContainer.style.display = "block";

                          // Add click handlers to each hobby
                          hobbiesContainer.querySelectorAll("li").forEach((li) => {
                            li.addEventListener("click", () => {
                              const hobby = li.textContent || "";
                              console.log(`Hobby clicked: ${hobby}`);
                              saveLocation(name, position, hobby);
                            });
                          });
                        } else {
                          hobbiesContainer.innerHTML = "<p>No hobbies found.</p>";
                          hobbiesContainer.style.display = "block";
                        }
                      });
                    }
                  }, 0);
              }
            }
          );

          // Prevent the default info window from appearing
          event.stop();
        }
      }
    );
  };

  const showHobbyMarkers = useCallback(
    (locations: Array<{ lat: number; lng: number; name: string }>) => {
      if (!mapRef.current || !infoWindowRef.current) return;

      // Clear old markers
      setHobbyMarkers((prevMarkers) => {
        prevMarkers.forEach((marker) => marker.setMap(null));
        return []; // return empty so the new set replaces them
      });

      // Create new markers
      const newMarkers = locations.map((loc) => {
        const marker = new google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map: mapRef.current!,
          title: loc.name,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        // Add a click listener to open the InfoWindow
        marker.addListener("click", () => {
          const saveButtonId = `save-button-${Date.now()}`; // Unique ID for the save button
          const hobbiesContainerId = `hobbies-container-${Date.now()}`; // Unique ID for hobbies container
          const showRouteButtonId = `show-route-button-${Date.now()}`;


          const content = `
            <div style="padding: 10px; text-align: center;">
              <h3 style="margin: 5px;">${loc.name}</h3>
              <button id="${saveButtonId}" style="padding: 8px 12px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                Save Location
              </button>
              <button id="${showRouteButtonId}" style="margin-top: 10px; padding: 8px 12px; background-color: #28a745; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                Show Route
                </button>
              <div id="${hobbiesContainerId}" style="margin-top: 10px; display: none;"></div>
            </div>
          `;

          infoWindowRef.current!.setContent(content);
          infoWindowRef.current!.setPosition(marker.getPosition());
          infoWindowRef.current!.open(mapRef.current, marker);

          setIsInfoWindowOpen(true);

          // Close InfoWindow callback
          infoWindowRef.current!.addListener("closeclick", () => {
            setIsInfoWindowOpen(false);
          });

          // Add event listener to the Save Location button
          setTimeout(() => {
            const saveButton = document.getElementById(saveButtonId);
            const hobbiesContainer = document.getElementById(hobbiesContainerId);
            const showRouteButton = document.getElementById(showRouteButtonId);

            if (showRouteButton) {
                showRouteButton.addEventListener("click", async () => {

                  try {
                    const routeData = await fetchRoute({ lat: loc.lat, lng: loc.lng });

                    if (!routeData) {
                      toast.error("Could not fetch route!");
                      return;
                    }
                    if (routeData) {
                      toast.success("Route fetched!");
                      drawCustomRoute(routeData);
                    } else {
                      toast.error("Could not fetch route!");
                    }
                  } catch (error) {
                    console.error("Error fetching route:", error);
                  }
                });
              } else {
                console.error("Show Route Button not found in the DOM.");
              }

            if (saveButton && hobbiesContainer) {
              saveButton.addEventListener("click", async () => {
                const hobbies = await fetchHobbies();

                if (hobbies.length > 0) {
                  let listHTML = `<ul style="list-style: none; padding: 0; margin: 0;">`;
                  hobbies.forEach((hobby) => {
                    listHTML += `
                      <li
                        style="margin: 5px 0; cursor: pointer; background: #f1f1f1; padding: 8px; border-radius: 4px;"
                      >
                        ${hobby.toLocaleUpperCase()}
                      </li>
                    `;
                  });
                  listHTML += `</ul>`;

                  hobbiesContainer.innerHTML = listHTML;
                  hobbiesContainer.style.display = "block";

                  // Add click handlers to each hobby
                  hobbiesContainer
                    .querySelectorAll("li")
                    .forEach((li) => {
                      li.addEventListener("click", () => {
                        const hobby = li.textContent || "";
                        console.log(`Hobby clicked: ${hobby}`);
                        saveLocation(loc.name, { lat: loc.lat, lng: loc.lng }, hobby);
                      });
                    });
                } else {
                  hobbiesContainer.innerHTML = "<p>No hobbies found.</p>";
                  hobbiesContainer.style.display = "block";
                }
              });
            }
          }, 0); // Ensure the DOM has rendered before attaching the event listener
        });

        return marker;
      });

      setHobbyMarkers(newMarkers);
    },
    []
  );

  // Remove all hobby markers
  const removeHobbyMarkers = () => {
    hobbyMarkers.forEach((marker) => marker.setMap(null));
    setHobbyMarkers([]);
    // Optionally clear them from Redux if you want
    dispatch(clearHobbyLocations());
  };

    // Listen for changes in hobbyLocations from Redux
    useEffect(() => {
        // If the user picks a hobby in LeftPanel, hobbyLocations is updated
        if (hobbyLocations.length > 0) {
            showHobbyMarkers(hobbyLocations);
        }
        }, [hobbyLocations, showHobbyMarkers]);

    useEffect(() => {
        // Only create the map once when `isLoaded` is true
        // and if we don't already have a mapRef.current
        if (!isLoaded || !mapContainerRef.current) return;
        if (mapRef.current) return; // Already created, don't re-init

        // At this point, if you have a currentLocation,
        // create the map. If not, fetch it first, then create the map in that callback.
        initMap(currentLocation ?? { lat: 37.7749, lng: -122.4194 });
        if (currentLocation) {
            updateUserLocation(currentLocation)
        }
        }, [isLoaded]);

  /**
   * On initial render or when `currentLocation` changes,
   * if the script is loaded, initialize or update the map.
   */
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || mapRef.current) return;

    // If we don't have a currentLocation yet, you can either wait or use a fallback
    const initialLocation = currentLocation ?? { lat: 37.7749, lng: -122.4194 };
    const map = new google.maps.Map(mapContainerRef.current, {
      center: initialLocation,
      zoom: 14,
    });
    mapRef.current = map;

    // Create user location marker
    if (currentLocation) {
      markerRef.current = new google.maps.Marker({
        position: currentLocation,
        map,
        title: "Your Location",
      });
        updateUserLocation(currentLocation)
    }
  }, [isLoaded, currentLocation]);

  // 2) If your location changes, just move the marker or recenter
  useEffect(() => {
    if (!mapRef.current || !currentLocation) return;

    // Move the user marker to new location
    if (!markerRef.current) {
      // If it's the first time we have a marker
      markerRef.current = new google.maps.Marker({
        position: currentLocation,
        map: mapRef.current,
        title: "Your Location",
      });
      if (currentLocation) {
        updateUserLocation(currentLocation)
    }
    } else {
      markerRef.current.setPosition(currentLocation);
    }

    // Optionally recenter the map
    mapRef.current.setCenter(currentLocation);
  }, [currentLocation]);

  // 3) Poll or fetch user location *once* or at intervals
  useEffect(() => {
    // On mount, fetch user location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        if (currentLocation) {
        updateUserLocation(currentLocation);
        }
      },
      (err) => {
        console.error("Geo error: ", err);
        setCurrentLocation({ lat: 37.7749, lng: -122.4194 });
      }
    );

    // If you want to update location every minute:
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (currentLocation) {
            console.log("Location updated successfully")
            updateUserLocation(currentLocation);
          }
        },
        (err) => console.error("Geo error: ", err)
      );
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  // Handle errors / loading states for the Google Maps script
  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }
  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Only show the search bar + button if the InfoWindow is not open */}
      {!isInfoWindowOpen && (
        <div
        style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: "10px", // Space between the SearchBar and button
        }}
        >
            {/**
           *   TRAFFIC BUTTON
           */}
          <button
            onClick={toggleTrafficLayer}
            style={{
              height: "80px",
              width: "80px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <img
              src={trafficLogo}
              alt="Toggle Traffic"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </button>

          {/**
           *   TRANSIT BUTTON
           */}
          <button
            onClick={toggleTransitLayer}
            style={{
              height: "80px",
              width: "80px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <img
              src={transitLogo}
              alt="Toggle Transit"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </button>
        <SearchBar onSelectLocation={handleSearchSelect} />
        <button
            onClick={fetchCurrentLocation}
            style={{
            height: "100px", // Match height with the SearchBar
            width: "100px", // Square button
            backgroundColor: "transparent", // Remove background color
            border: "none", // Remove border
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0",
            }}
        >
            <img
            src={myLocationIcon}
            alt="My Location"
            style={{
                height: "100%", // Make the logo fill the button
                width: "100%",
                objectFit: "contain", // Ensure proper scaling
            }}
            />
        </button>
        </div>
      )}

    {hobbyMarkers.length > 0 && (
    <button
    className="delete-button"
    onClick={removeHobbyMarkers}
    style={{
        position: "absolute",
        top: "0px",
        right: "60px",
        zIndex: 10,
        backgroundColor: "transparent", // Remove background color to blend with the map
        border: "none", // Remove border
        borderRadius: "50%", // Optional: keeps button circular
        padding: "0",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    }}
    >
    <img
        src={deleteIcon}
        alt="Delete Markers"
        style={{
        width: "60%", // Adjust icon size relative to the button
        height: "60%", // Maintain aspect ratio
        objectFit: "contain", // Ensure the image scales properly
        }}
    />
    </button>
    )}

      {/* Map container div */}
      <div ref={mapContainerRef} style={mapContainerStyle} />
    </div>
  );
};

export default MapContainer;
