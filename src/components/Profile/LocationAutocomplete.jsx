import React, { useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const LocationAutocomplete = ({ address, setAddress, setLocationCoordinates }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const inputRef = useRef(null);
    const autocompleteInstance = useRef(null);

    useEffect(() => {
        if (isLoaded && inputRef.current) {
            // Initialize the Autocomplete class directly from the window object
            // to bypass the library wrapper limitations
            autocompleteInstance.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                fields: ["formatted_address", "geometry", "name"],
                types: ["address"], // Limits results to actual addresses
            });

            autocompleteInstance.current.addListener("place_changed", () => {
                const place = autocompleteInstance.current.getPlace();

                if (place.geometry && place.geometry.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const formattedAddress = place.formatted_address || place.name;

                    setAddress(formattedAddress);
                    setLocationCoordinates({ lat, lng });
                }
            });
        }
    }, [isLoaded, setAddress, setLocationCoordinates]);

    if (loadError) return <div className="text-red-500 text-sm">Error loading Google Maps API</div>;
    if (!isLoaded) return <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>;

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Address
            </label>
            <input
                ref={inputRef}
                type="text"
                defaultValue={address} // Use defaultValue to avoid controlled input conflicts with Autocomplete
                placeholder="Search for your address..."
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setAddress(e.target.value)}
            />
        </div>
    );
};

export default LocationAutocomplete;