"use client";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import polyline from "@mapbox/polyline";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const API_KEY = "62e7db61-374d-4be8-b22d-43407c2cd56f";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const FitMapBounds = ({ bounds, map }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (isClient && map && bounds) {
      map.fitBounds(bounds);
    }
  }, [isClient, map, bounds]);
  return null;
};

const RideMap = ({ start, end, stops, via }) => {
  const [route, setRoute] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!isClient) return;
      try {
        let points = [`${start.lat},${start.lng}`];

        if (stops && stops.length > 1) {
          stops.forEach((stop) => {
            points.push(`${stop.lat},${stop.lng}`);
          });
        }

        if (via && via.length > 0) {
          via.forEach((viaPoint) => {
            points.push(`${viaPoint.lat},${viaPoint.lng}`);
          });
        }

        points.push(`${end.lat},${end.lng}`);

        let graphHopperUrl = `https://graphhopper.com/api/1/route?profile=car&locale=en&calc_points=true&instructions=false&key=${API_KEY}`;

        points.forEach((point) => {
          graphHopperUrl += `&point=${point}`;
        });

        const response = await fetch(graphHopperUrl);
        const data = await response.json();

        if (data.paths && data.paths.length > 0) {
          const encodedPoints = data.paths[0].points;
          const decodedPoints = polyline.decode(encodedPoints);

          const formattedRoute = decodedPoints.map((point) => [point[0], point[1]]);

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

    if (isClient && start && end) {
      fetchRoute();
    }
  }, [isClient, start, end, stops, via]);

  return (
    <MapContainer
      center={[25, 75]}
      zoom={5}
      style={{ height: "500px", width: "100%", borderRadius: "10px" }}
      whenCreated={(map) => {
        if (route.length > 0) {
          map.fitBounds(route);
        }
        mapRef.current = map;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {end && (
        <Marker
          position={[end.lat, end.lng]}
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup>Destination</Popup>
        </Marker>
      )}

      {stops &&
        stops.length > 0 &&
        stops.map((stop, index) => (
          <Marker
            key={`stop-${index}`}
            position={[stop.lat, stop.lng]}
            icon={customIcon}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>{`Stop ${index + 1}`}</Popup>
          </Marker>
        ))}

      {via &&
        via.length > 0 &&
        via.map((viaPoint, index) => (
          <Marker
            key={`via-${index}`}
            position={[viaPoint.lat, viaPoint.lng]}
            icon={customIcon}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) => e.target.closePopup(),
            }}
          >
            <Popup>{`Via ${index + 1}`}</Popup>
          </Marker>
        ))}

      {start && (
        <Marker
          position={[start.lat, start.lng]}
          icon={customIcon}
          eventHandlers={{
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup>Starting Point</Popup>
        </Marker>
      )}

      {route.length > 0 && <Polyline positions={route} color="blue" weight={2} />}

      {bounds && <FitMapBounds bounds={bounds} map={mapRef.current} />}
    </MapContainer>
  );
};

export default RideMap;