import React, { useState, useEffect, useRef } from "react";
import * as ELG from "esri-leaflet-geocoder";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";

const LocationAutocomplete = ({ address, setAddress, setLocationCoordinates }) => {
    const [query, setQuery] = useState(address || "");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);

    // Update query when address prop changes (initial load)
    useEffect(() => {
        setQuery(address || "");
    }, [address]);

    const handleSearch = (e) => {
        const val = e.target.value;
        setQuery(val);
        setAddress(val);

        if (val.length > 2) {
            ELG.geocodeService().suggest().text(val).run((err, results) => {
                if (!err && results.suggestions) {
                    setSuggestions(results.suggestions);
                    setShowSuggestions(true);
                }
            });
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (suggestion) => {
        setQuery(suggestion.text);
        setAddress(suggestion.text);
        setShowSuggestions(false);

        // Geocode the selected suggestion to get coordinates
        ELG.geocodeService().geocode().text(suggestion.text).run((err, results) => {
            if (!err && results.results && results.results.length > 0) {
                const { lat, lng } = results.results[0].latlng;
                setLocationCoordinates({ lat, lng });
            }
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full relative z-[2000]" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Address
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    placeholder="Search for your address..."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    onChange={handleSearch}
                    onFocus={() => query.length > 2 && setShowSuggestions(true)}
                />
                
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-[2001] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                className="p-3 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 transition-colors"
                                onClick={() => handleSelect(s)}
                            >
                                {s.text}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationAutocomplete;