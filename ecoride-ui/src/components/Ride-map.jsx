"use client"; // Ensure this is a Client Component
import FitMapBounds from "./ui/FitMapBounds";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline ,Marker,Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // ✅ Ensure Leaflet styles are loaded
import L from "leaflet";
import polyline from "@mapbox/polyline"; // ✅ Import polyline decoder

const API_KEY = "62e7db61-374d-4be8-b22d-43407c2cd56f"; // Replace with your actual API key


const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Adjust to position correctly
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
  

const RideMap = ({ start, end }) => {
  const [route, setRoute] = useState([]);
  const [bounds, setBounds] = useState(null);


   useEffect(() => {
    const fetchRoute = async () => {
      if (typeof window === "undefined") return;

      try {
        const response = await fetch(
          `https://graphhopper.com/api/1/route?point=${start.lat},${start.lng}&point=${end.lat},${end.lng}&profile=car&locale=en&calc_points=true&instructions=true&key=${API_KEY}`
        );
        const data = await response.json();

        console.log("GraphHopper API Response:", data); // ✅ Debugging Log

        if (data.paths && data.paths.length > 0) {
          const encodedPoints = data.paths[0].points; // Get encoded polyline string
          const decodedPoints = polyline.decode(encodedPoints); // ✅ Decode polyline

          console.log("decoded points by polyline",decodedPoints); // ✅ Debugging Log
          // Convert [lat, lng] pairs to correct Leaflet format
          const formattedRoute = decodedPoints.map((point) => [point[0], point[1]]);

          console.log("Decoded Route Coordinates:", formattedRoute); // ✅ Debugging Log

          setRoute(formattedRoute);
            // Extract bounding box from response and set bounds
            const bbox = data.paths[0].bbox;
            setBounds([
              [bbox[1], bbox[0]], // South-West (lat, lng)
              [bbox[3], bbox[2]], // North-East (lat, lng)
            ]);
        } else {
          console.warn("No route found in API response");
        }
      } 
      
      catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [start, end]);

  return (
    <MapContainer
      center={[25, 75]} // Center map over India
      zoom={5}
      style={{ height: "500px", width: "100%", borderRadius: "10px" }}
      whenCreated={(map) => map.fitBounds(route)}
    >
      {/* Base Map */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
         {/* Markers for Start & End Points */}
      <Marker position={[start.lat, start.lng]} icon={customIcon}>
        <Popup>Starting Point</Popup>
      </Marker>
      <Marker position={[end.lat, end.lng]} icon={customIcon}>
        <Popup>Destination</Popup>
      </Marker>

      {/* Draw Route */}
      {route.length > 0 && <Polyline positions={route} color="blue" weight={2} />}


      {/* Auto-fit map to bounds when route is available */}
      {bounds && <FitMapBounds bounds={bounds} />}
    </MapContainer>
  );
};

export default RideMap;
