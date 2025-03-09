import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import dotenv from "dotenv";
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

// Example usage within a React component (or any frontend environment):
async function exampleUsage(latitude, longitude) {
  const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY; // Make sure you have this in your .env.local file for Next.js, or similar for other frameworks.

  if (!apiKey) {
    console.error("GraphHopper API key not found in environment variables.");
    return "API key not configured";
  }

  try {
    const address = await getAddressFromCoordinates(latitude, longitude, apiKey);
    console.log("Address:", address);
    return address; // Return the address so you can use it in your component's state, etc.
  } catch (error) {
    console.error("Error in example usage:", error);
    return "Error";
  }
}


exampleUsage(20.4686,85.8792,"62e7db61-374d-4be8-b22d-43407c2cd56f")
