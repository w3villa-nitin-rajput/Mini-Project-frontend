import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem"
};

const defaultCenter = {
    lat: 40.7128, // Default to NY
    lng: -74.0060
};

const MapDisplay = ({ coordinates }) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const center = (coordinates && coordinates.lat && coordinates.lng)
        ? { lat: parseFloat(coordinates.lat), lng: parseFloat(coordinates.lng) }
        : defaultCenter;

    if (loadError) return <div className="h-64 flex items-center justify-center bg-red-50 text-red-500 rounded-lg border border-red-200 text-sm">Error loading maps</div>;
    if (!isLoaded) return <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse text-gray-400">Loading Map...</div>;

    return (
        <div className="w-full h-64 md:h-80 shadow-inner rounded-lg overflow-hidden border border-gray-200 relative mb-6">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={center}
            >
                {coordinates && coordinates.lat && coordinates.lng && (
                    <Marker position={center} animation={window.google.maps.Animation.DROP} />
                )}
            </GoogleMap>
        </div>
    );
};

// Memoize to prevent unnecessary re-renders when form states change
export default React.memo(MapDisplay);
