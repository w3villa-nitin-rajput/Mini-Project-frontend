import React, { useRef, useEffect } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const LocationAutocomplete = ({ address, setAddress, setLocationCoordinates }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const autocompleteRef = useRef(null);

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();

            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const formattedAddress = place.formatted_address || place.name;

                setAddress(formattedAddress);
                setLocationCoordinates({ lat, lng });
            }
        } else {
            console.log("Autocomplete is not loaded yet!");
        }
    };

    if (loadError) return <div className="text-red-500 text-sm">Error loading Google Maps API</div>;
    if (!isLoaded) return <div className="text-gray-500 animate-pulse bg-gray-100 h-10 w-full rounded"></div>;

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Search for your address..."
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </Autocomplete>
        </div>
    );
};

export default LocationAutocomplete;
