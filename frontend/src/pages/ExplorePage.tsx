import React, { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { googleMapsConfig } from "../config/googleMapsConfig";
import SearchBar from "../components/google/SearchBar";
import { auth } from "../config/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const mapContainerStyle = {
    width: "100%",
    height: "100vh",
};

interface LatLng {
    lat: number;
    lng: number;
}

const ExplorePage: React.FC = () => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);

    const userLanguage = navigator.language || "en";

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsConfig.apiKey,
        libraries: ["places"],
        language: userLanguage,
    });

    const fetchHobbies = async (): Promise<string[]> => {
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

    const saveLocation = async (name: string, position: LatLng, hobby: string) => {
        try {
            const authToken = await auth.currentUser?.getIdToken();
            if (!authToken) {
                toast.error("User not authenticated. Please log in again.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/locations/save/${hobby}`, {
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
                    }
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save location. Please try again later.");
            }

            toast.success(`Location saved successfully!`);
        } catch (error) {
            console.error("Error saving location:", error);
            toast.error("Location already saved!");
        }
    };


    const handleSearchSelect = (location: LatLng) => {
        if (mapRef.current) {
            mapRef.current.setCenter(location);
            mapRef.current.setZoom(14);
        }
    };

    const initMap = (location: LatLng) => {
        if (!mapContainerRef.current) {
            console.error("Map container not found.");
            return;
        }

        const map = new google.maps.Map(mapContainerRef.current, {
            center: location,
            zoom: 14,
        });
        mapRef.current = map;

        const marker = new google.maps.Marker({
            position: location,
            map,
            title: "Your Location",
        });
        markerRef.current = marker;

        const infoWindow = new google.maps.InfoWindow();
        infoWindowRef.current = infoWindow;

        map.addListener("click", (event: google.maps.MapMouseEvent & { placeId?: string }) => {
            if (event.placeId) {
                const service = new google.maps.places.PlacesService(map);
                service.getDetails(
                    {
                        placeId: event.placeId,
                        fields: ["name", "geometry"],
                    },
                    (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                            const name = place.name || "Unnamed Location";
                            const position = {
                                lat: place.geometry?.location?.lat() || 0,
                                lng: place.geometry?.location?.lng() || 0,
                            };

                            const saveButtonId = `save-button-${Date.now()}`;
                            const hobbiesContainerId = `hobbies-container-${Date.now()}`;

                            infoWindow.setContent(`
                                <div style="padding: 10px; text-align: center;">
                                    <h3 style="margin: 5px;">${name}</h3>
                                    <button id="${saveButtonId}" style="padding: 8px 12px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
                                        Save Location
                                    </button>
                                    <div id="${hobbiesContainerId}" style="margin-top: 10px; display: none;"></div>
                                </div>
                            `);
                            infoWindow.setPosition(position);
                            infoWindow.open(map);

                            setIsInfoWindowOpen(true);

                            infoWindow.addListener("closeclick", () => {
                                setIsInfoWindowOpen(false);
                            });

                            setTimeout(() => {
                                const saveButton = document.getElementById(saveButtonId);
                                const hobbiesContainer = document.getElementById(hobbiesContainerId);

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
                                                        ${hobby}
                                                    </li>
                                                `;
                                            });
                                            listHTML += `</ul>`;

                                            hobbiesContainer.innerHTML = listHTML;
                                            hobbiesContainer.style.display = "block";

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
                event.stop();
            }
        });
    };

    const fetchCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setCurrentLocation(location);
                if (mapRef.current) {
                    mapRef.current.setCenter(location);
                }
                if (markerRef.current) {
                    markerRef.current.setPosition(location);
                }
            },
            (error) => {
                console.error("Error fetching user location:", error);
                const fallbackLocation = { lat: 37.7749, lng: -122.4194 };
                setCurrentLocation(fallbackLocation);
                if (mapRef.current) {
                    mapRef.current.setCenter(fallbackLocation);
                }
                if (markerRef.current) {
                    markerRef.current.setPosition(fallbackLocation);
                }
            }
        );
    };

    useEffect(() => {
        if (!isLoaded || !mapContainerRef.current) return;

        if (currentLocation) {
            initMap(currentLocation);
        } else {
            fetchCurrentLocation();
        }
    }, [isLoaded, currentLocation]);

    if (loadError) {
        return <div>Error loading Google Maps API</div>;
    }

    if (!isLoaded) {
        return <div>Loading map...</div>;
    }

    return (
        <div style={{ position: "relative" }}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

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
                        gap: "10px",
                    }}
                >
                    <SearchBar onSelectLocation={handleSearchSelect} />
                    <button
                        onClick={fetchCurrentLocation}
                        style={{
                            height: "100%",
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Back to My Location
                    </button>
                </div>
            )}

            <div ref={mapContainerRef} style={mapContainerStyle} />
        </div>
    );
};

export default ExplorePage;
