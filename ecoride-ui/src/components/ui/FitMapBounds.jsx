// FitMapBounds.jsx
import { useMap } from "react-leaflet";
import React, { useEffect } from "react";

const FitMapBounds = ({ bounds }) => {
    const map = useMap();

    useEffect(() => {
        console.log("FitMapBounds: map:", map, "bounds:", bounds); // Log map and bounds

        if (bounds && map) { // Check if bounds and map exist
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
          console.log("FitMapBounds: bounds or map is invalid");
        }
    }, [bounds, map]);

    return null;
};

export default FitMapBounds;