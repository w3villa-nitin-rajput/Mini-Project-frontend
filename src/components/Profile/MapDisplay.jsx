import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in Leaflet + React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const mapContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem"
};

const defaultCenter = [40.7128, -74.0060]; // [lat, lng] for Leaflet

// Component to handle map center updates when coordinates change
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapDisplay = ({ coordinates }) => {
    const center = (coordinates && coordinates.lat && coordinates.lng)
        ? [parseFloat(coordinates.lat), parseFloat(coordinates.lng)]
        : defaultCenter;

    return (
        <div className="w-full h-64 md:h-80 shadow-inner rounded-lg overflow-hidden border border-gray-200 relative mb-6">
            <MapContainer
                center={center}
                zoom={14}
                style={mapContainerStyle}
                scrollWheelZoom={false}
            >
                <ChangeView center={center} zoom={14} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {coordinates && coordinates.lat && coordinates.lng && (
                    <Marker position={center} />
                )}
            </MapContainer>
        </div>
    );
};

export default React.memo(MapDisplay);
