import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import dotenv from "dotenv";
import axios from "axios";
dotenv.config()

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const getAddressFromCoordinates= async (latitude, longitude, apiKey)=> {
  try {
    const response = await fetch(
      `https://graphhopper.com/api/1/geocode?key=${apiKey}&reverse=true&point=${latitude},${longitude}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.hits && data.hits.length > 0) {
      const hit = data.hits[0];
      const formattedAddress = [
        hit.name,
        hit.street,
        hit.city,
        hit.district,
        hit.state, // Added state
        hit.country
    ]
    .filter(part => part) // Filter out null, undefined, or empty strings
    .join(', ')
    .trim();
    
    if (formattedAddress === ""){
        return "Location not found";
    } else {
        return formattedAddress;
    }      return formattedAddress;
    } else {
      return "Location not found";
    }
  } catch (error) {
    console.error("Error converting coordinates to location:", error);
    return "Error fetching location";
  }
}


export const getAutoCompleteSuggestions = async (input) => {
  const apiKey = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY; // Replace with your GraphHopper API Key
  const url = `https://graphhopper.com/api/1/geocode?q=${encodeURIComponent(input)}&limit=5&locale=en&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("data of the",data.hits)
    if (data.hits && data.hits.length > 0) {
      const suggestions = data.hits.map((place) => ({
        name: place.name,
        address: place.street ? `${place.street}, ${place.state}, ${place.country}` : `${place.state ? place.state : place.city},  ${place.country}`,
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


export const getAddressCoordinates = async (address,apiKey) => {
  console.log("getAddressCoordinates triggered")
  ; // Replace with your GraphHopper API Key
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



// Example usage within a React component (or any frontend environment):
// async function exampleUsage(latitude, longitude) {
//   const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY; // Make sure you have this in your .env.local file for Next.js, or similar for other frameworks.

//   if (!apiKey) {
//     console.error("GraphHopper API key not found in environment variables.");
//     return "API key not configured";
//   }

//   try {
//     const address = await getAddressFromCoordinates(latitude, longitude, apiKey);
//     console.log("Address:", address);
//     return address; // Return the address so you can use it in your component's state, etc.
//   } catch (error) {
//     console.error("Error in example usage:", error);
//     return "Error";
//   }
// }


// exampleUsage(20.4686,85.8792,"62e7db61-374d-4be8-b22d-43407c2cd56f")
