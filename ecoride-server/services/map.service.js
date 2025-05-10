import axios from "axios"; 
import dotenv from 'dotenv'
dotenv.config();

export const getAddressCoordinates = async (address) => {
  const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY; // Replace with your GraphHopper API Key
  console.log('api key');
  console.log(apiKey);
  console.log("address at map . service =======>", address);
  // const apiKey = "62e7db61-374d-4be8-b22d-43407c2cd56f"
  const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(address)}&limit=1&key=${apiKey}`;

  try {
      const response = await axios.get(url);
      const data = await response.data;
      console.log("longititude and latitude", data.hits[0]?.point); // Use optional chaining
      if (data.hits && data.hits.length > 0 && data.hits[0].point) { // Check point existence
          console.log("data.hits=======>", data.hits[0].point);
          const { lat, lng } = data.hits[0].point;
          console.log(`Coordinates for "${address}":`, lat, lng);
          return { lat, lng };
      } else {
          console.error("No coordinates found for the given address.");
          return null;
      }
  } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
  }
};

export const coordinatesToLocation = async (latitude, longitude) => {
  const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY; // Replace with your GraphHopper API Key
  console.log("API key at coordinatesToLocation:", apiKey);

  if (!apiKey) {
      console.error("GraphHopper API key not found in environment variables.");
      return "API key not configured";
  }

  try {
      const response = await fetch(
          `https://graphhopper.com/api/1/geocode?key=${apiKey}&reverse=true&point=${latitude},${longitude}`
      );

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data);

      if (data.hits && data.hits.length > 0) {
          const { name, street, city, country } = data.hits[0];

          // Construct formatted address dynamically
          const formattedAddress = [name, street, city, country].filter(Boolean).join(", ");

          return formattedAddress || "Location details not available";
      } else {
          return "Location not found";
      }
  } catch (error) {
      console.error("Error converting coordinates to location:", error.message);
      return "Error fetching location";
  }
};


export const processRides= async (rides, apiKey)=> {
  const processedRides = await Promise.all(rides.map(async (ride) => {
      if (ride === null || !ride.startingPoint || !ride.destination) {
          return null; // Skip null or incomplete rides
      }

      console.log('at map service ride 76 line', rides);
      const startLat = ride.startingPoint.coordinates.lat;
      const startLng = ride.startingPoint.coordinates.lng;
      const destLat = ride.destination.coordinates.lat;
      const destLng = ride.destination.coordinates.lng;

      const startLocation = await coordinatesToLocation(startLat, startLng, apiKey);
      const destinationLocation = await coordinatesToLocation(destLat, destLng, apiKey);

      if (startLocation && destinationLocation){
        return {
            ...ride.toObject(), // Create a copy of the ride object
            startingPointLocation: startLocation,
            destinationLocation: destinationLocation,
        };
      }
      return null;
  }));

  return processedRides.filter(ride => ride !== null);
}


// Example usage:

//run the example function
//example();
// const a=getAddressCoordinates(" sundarpada ,bhubwhenswar , Khorda");
// console.log(a)

export const calculateDistanceWithCoords=(lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


export const getDistanceTime = async (origin, destination) => {
  const apiKey = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY;
  const url = `https://graphhopper.com/api/1/route?point=${origin.lat},${origin.lng}&point=${destination.lat},${destination.lng}&vehicle=car&locale=en&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.paths && data.paths.length > 0) {
      const { distance, time } = data.paths[0];

      // Convert time from milliseconds to minutes
      const durationInMinutes = Math.round(time / 60000);

      console.log(`Distance: ${distance / 1000} km, Time: ${durationInMinutes} min`);
      return { distance: distance / 1000, time: durationInMinutes };
    } else {
      console.error("No route found between the given locations.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    return null;
  }
};



export const getAutoCompleteSuggestions = async (input) => {
  const apiKey = "YOUR_GRAPHHOPPER_API_KEY"; // Replace with your GraphHopper API Key
  const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(input)}&limit=5&locale=en&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      const suggestions = data.hits.map((place) => ({
        name: place.name,
        address: place.street ? `${place.street}, ${place.city}, ${place.country}` : `${place.city}, ${place.country}`,
        lat: place.point.lat,
        lng: place.point.lng,
      }));

      console.log("Autocomplete Suggestions:", suggestions);
      return suggestions;
    } else {
      console.log("No suggestions found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    return [];
  }
};


export const getRouteCoordinates= async (start, end)=> {
  const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY; // Replace with your GraphHopper API key
  
  setTimeout(() => {
    console.log("start and end at getRouteCoordinates======================================>",start ,end)
    
  }, 2000);
  const url = `https://graphhopper.com/api/1/route?point=${encodeURIComponent(start.coordinates.lat)},${encodeURIComponent(start.coordinates.lng)}&point=${encodeURIComponent(end.coordinates.lat)},${encodeURIComponent(end.coordinates.lng)}&type=json&key=${apiKey}&points_encoded=false`;

  try {
      const response = await axios.get(url);
      const points = response.data.paths[0].points.coordinates;
      return points.map(point => ({ lat: point[1], lng: point[0] }));
  } catch (error) {
      console.error("Error fetching route coordinates:", error);
      return null;
  }
}
