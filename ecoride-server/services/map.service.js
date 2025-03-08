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

// const a=getAddressCoordinates(" sundarpada ,bhubwhenswar , Khorda");
// console.log(a)


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
  const url = `https://graphhopper.com/api/1/route?point=${encodeURIComponent(start.lat)},${encodeURIComponent(start.lng)}&point=${encodeURIComponent(end.lat)},${encodeURIComponent(end.lng)}&type=json&key=${apiKey}&points_encoded=false`;

  try {
      const response = await axios.get(url);
      const points = response.data.paths[0].points.coordinates;
      return points.map(point => ({ lat: point[1], lng: point[0] }));
  } catch (error) {
      console.error("Error fetching route coordinates:", error);
      return null;
  }
}
