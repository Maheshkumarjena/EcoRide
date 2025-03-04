import { useMap } from "react-leaflet";
import { useEffect } from "react";
const FitMapBounds = ({ bounds }) => {
    const map = useMap();
  
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50] }); // Add padding for better visibility
      }
    }, [bounds, map]);
  
    return null;
  };
  
  export default FitMapBounds;