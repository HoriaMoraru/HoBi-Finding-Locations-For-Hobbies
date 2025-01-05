import React from "react";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

interface SearchBoxProps {
    setSelected: (location: { lat: number; lng: number }) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ setSelected }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            // Define search options, e.g., radius or location
        },
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = ({ description }: { description: string }) => {
        setValue(description, false);
        clearSuggestions();

        getGeocode({ address: description })
            .then((results) => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                setSelected({ lat, lng });
            })
            .catch((error) => {
                console.error("Error fetching coordinates: ", error);
            });
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
                    onClick={() => handleSelect(suggestion)}
                    style={{ cursor: "pointer", padding: "5px 10px" }}
                >
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });

    if (!ready) {
        return <div>Loading...</div>; // Display a loader until Places API is ready
    }

    return (
        <div ref={ref} style={{ position: "relative", maxWidth: "400px" }}>
            <input
                value={value}
                onChange={handleInput}
                placeholder="Search for a location"
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
            />
            {status === "OK" && (
                <ul
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        width: "100%",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        zIndex: 1000,
                        listStyleType: "none",
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {renderSuggestions()}
                </ul>
            )}
        </div>
    );
};

export default SearchBox;
