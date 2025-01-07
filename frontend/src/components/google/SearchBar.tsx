import React from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

interface LatLng {
    lat: number;
    lng: number;
}

interface SearchBarProps {
    onSelectLocation: (location: LatLng) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectLocation }) => {
    const {
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            // Define search options here (e.g., bounds, radius)
        },
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = async (description: string) => {
        setValue(description, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address: description });
            const { lat, lng } = await getLatLng(results[0]);
            console.log("Selected Location Coordinates:", { lat, lng });
            onSelectLocation({ lat, lng });
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li
                    key={place_id}
                    onClick={() => handleSelect(suggestion.description)}
                    style={{
                        cursor: "pointer",
                        padding: "10px 15px",
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    return (
        <div
            ref={ref}
            style={{
                position: "relative",
                width: "95%", // Make the search bar wider
                maxWidth: "600px", // Add a max width for larger screens
                margin: "10px auto", // Center it horizontally
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
            }}
        >
            <input
                value={value}
                onChange={handleInput}
                placeholder="Search for a location..."
                style={{
                    width: "100%",
                    padding: "15px 20px", // Larger padding for better appearance
                    fontSize: "18px", // Larger font size
                    border: "none",
                    borderRadius: "8px",
                }}
            />
            {status === "OK" && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        width: "100%",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        listStyleType: "none",
                        margin: 0,
                        padding: 0,
                        overflow: "hidden",
                    }}
                >
                    {renderSuggestions()}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
