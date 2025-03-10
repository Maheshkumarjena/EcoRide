"use client"; // Ensure this is a Client Component
import React from "react";
import dynamic from "next/dynamic";
import FitMapBounds from "./ui/FitMapBounds";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css"; // ✅ Ensure Leaflet styles are loaded
import L from "leaflet";
import polyline from "@mapbox/polyline"; // ✅ Import polyline decoder

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);



const API_KEY = "62e7db61-374d-4be8-b22d-43407c2cd56f"; // Replace with your actual API key


const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41], // Default size
    iconAnchor: [12, 41], // Adjust to position correctly
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
  

const RideMap = ({ start, end , stops,via }) => {
  const [route, setRoute] = useState([]);
  const [bounds, setBounds] = useState(null);
  
  useEffect(() => {
    const fetchRoute = async () => {
      if (typeof window === "undefined") return;

      try {
        let points = [`${start.lat},${start.lng}`]; // Start with the origin

        if (stops && stops.length > 0) {
            stops.forEach(stop => {
                points.push(`${stop.lat},${stop.lng}`); // Add stops in order
            });
        }

        if (via && via.length > 0) {
            via.forEach(viaPoint => {
                points.push(`${viaPoint.lat},${viaPoint.lng}`); // Add via points in order
            });
        }

        points.push(`${end.lat},${end.lng}`); // Add the destination

        let graphHopperUrl = `https://graphhopper.com/api/1/route?profile=car&locale=en&calc_points=true&instructions=false&key=${API_KEY}`;

        points.forEach(point => {
            graphHopperUrl += `&point=${point}`; // Append all points in order
        });

        console.log("The api that is called ====>", graphHopperUrl);

        const response = await fetch(graphHopperUrl);
        const data = await response.json();

        console.log("GraphHopper API Response:", data);

        if (data.paths && data.paths.length > 0) {
          const encodedPoints = data.paths[0].points;
          const decodedPoints = polyline.decode(encodedPoints);

          console.log("decoded points by polyline", decodedPoints);

          const formattedRoute = decodedPoints.map((point) => [point[0], point[1]]);

          console.log("Decoded Route Coordinates:", formattedRoute);

          setRoute(formattedRoute);

          const bbox = data.paths[0].bbox;
          setBounds([
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]],
          ]);
        } else {
          console.warn("No route found in API response");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (start && end) {
      fetchRoute();
    }
  }, [start, end, stops, via]);


  return (
   <MapContainer
    center={[25, 75]}
    zoom={5}
    style={{ height: "500px", width: "100%", borderRadius: "10px" }}
    whenCreated={(map) => {
        if (route.length > 0) {
            map.fitBounds(route);
        }
    }}
>
    <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    />



{end && <Marker position={[end.lat, end.lng]} icon={customIcon}
 eventHandlers={{
  mouseover: (e) => e.target.openPopup(),
  mouseout: (e) => e.target.closePopup(),
}}
>
        <Popup>Destination</Popup>
    </Marker>}


    
    {stops && stops.length > 0 && stops.map((stop, index) => (
        <Marker key={`stop-${index}`} position={[stop.lat, stop.lng]} icon={customIcon}
        eventHandlers={{
          mouseover: (e) => e.target.openPopup(),
          mouseout: (e) => e.target.closePopup(),
        }}
        >
            <Popup>{`Stop ${index + 1}`}</Popup>
        </Marker>
    ))}

    {via && via.length > 0 && via.map((viaPoint, index) => (
        <Marker key={`via-${index}`} position={[viaPoint.lat, viaPoint.lng]} icon={customIcon}
        eventHandlers={{
          mouseover: (e) => e.target.openPopup(),
          mouseout: (e) => e.target.closePopup(),
        }}
        >
            <Popup>{`Via ${index + 1}`}</Popup>
        </Marker>
    ))}

{start && <Marker position={[start.lat, start.lng]} icon={customIcon}
     eventHandlers={{
                        mouseover: (e) => e.target.openPopup(),
                        mouseout: (e) => e.target.closePopup(),
                    }}
    >
        <Popup>Starting Point</Popup>
    </Marker>}



    {route.length > 0 && <Polyline positions={route} color="blue" weight={2} />}

    {bounds && <FitMapBounds bounds={bounds} />}
</MapContainer>
  )
};

export default RideMap;
