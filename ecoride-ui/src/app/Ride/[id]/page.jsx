// pages/ride/[id].jsx (or [id].js)
"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { getAddressFromCoordinates } from '@/lib/utils';
import { getAddressCoordinates } from '@/lib/utils';
import dynamic from 'next/dynamic';


const RideMap = dynamic(() => import("@/components/Ride-map"), { ssr: false });

const RideDetailPage = ({ params }) => {
  
  const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY
  const router = useRouter();
  const unwrappedParams = React.use(params); // Unwrap the `params` Promise
  const { id } = unwrappedParams; // Destructure `id` from the unwrapped `params`
  console.log("id at the query===========================>", id);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [start,setStart]= useState(null);
  const [end,setEnd]=useState(null);
  const [stops,setStops]=useState(null);
  const [via,setVia]=useState(null);

  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";



  useEffect(() => {
    if (!id) return;
  
    const fetchRideAndGetCoords = async () => {
      setLoading(true);
      setError(null);
  
      try {
        // Fetch ride details
        const response = await axios.get(`${API_URL}/rides/${id}`, {
          withCredentials: true,
        });
        console.log(response.data.ride.startingPoint);
  
        // Extract coordinates (assuming they are in the format [latitude, longitude])
        const startCoords = response.data.ride.startingPoint.coordinates;
        const destCoords = response.data.ride.destination.coordinates;
        console.log('coordinates===================<', startCoords, destCoords);
  
        // Get addresses from coordinates
        const startAddress = await getAddressFromCoordinates(startCoords.lat, startCoords.lng, MAP_URL);
        const destinationAddress = await getAddressFromCoordinates(destCoords.lat, destCoords.lng, MAP_URL);
  
        // Combine ride details with the new addresses
        const rideDetail = {
          ...response.data.ride, // Spread the existing ride details
          startAddress, // Add the processed start address
          destinationAddress, // Add the processed destination address
        };
        console.log("ride details at ride details ", rideDetail);
  
        // Update state with the combined ride details
        setRide(rideDetail);
  
        // Now that the ride details are fetched and state is updated, call getCoords
        getCoords(rideDetail);
  
      } catch (err) {
        setError(err.message || 'Failed to fetch ride details.');
      } finally {
        setLoading(false);
      }
    };
  
    const getCoords = async (ride) => {
      try {
        // Extract start and end coordinates
        const start = {
          lat: ride.startingPoint.coordinates.lat,
          lng: ride.startingPoint.coordinates.lng,
        };
        const end = {
          lat: ride.destination.coordinates.lat,
          lng: ride.destination.coordinates.lng,
        };
    
        // Fetch coordinates for all stops  (if stops exist)
        const stops = ride.stops
          ? await Promise.all(
              ride.stops.map((stop) => getAddressCoordinates(stop, MAP_URL))
            )
          : [];
    
        // Example via points (you can modify this as needed)
        const via = ride.via? await Promise.all(
          ride.stops.map((stops)=>{
            getAddressCoordinates(stops,MAP_URL)
          })
        ) :[];
        
        // Log the results
        console.log('Start:', start);
        setStart(start)
        console.log('End:', end);
        setEnd(end)
        console.log('Stops:', stops);
        setStops(stops)
        console.log('Via:', via);
        setVia(via)
    
        // Return the coordinates if needed
        console.log('coordinates fetched')
        return { start, end, stops, via };
      } catch (error) {
        console.error('Error in getCoords:', error);
        throw error; // Re-throw the error if needed
      }
    };


    fetchRideAndGetCoords();
  
  }, [id]); // Add `id` as a dependency
  console.log("ride after adress extraction", ride)



  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!ride) return <div className="p-4">Ride not found.</div>;

  // Helper function to render coordinates or address
  const renderLocation = (location) => {
    if (typeof location === 'object' && location !== null) {
      if (location.coordinates) {
        return `Lat: ${location.coordinates[0]}, Lng: ${location.coordinates[1]}`;
      }
      return JSON.stringify(location);
    }
    return location; // Return as-is if it's a string, number, etc.
  };

  return (
    <div className="p-4">
    <h1 className="text-2xl font-semibold mb-4 text-gray-800">Ride Details</h1>
    <div className="lg:flex lg:space-x-6"> {/* Flex container for larger screens */}
      {/* Ride Details Section */}
      <div className="border p-4 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow duration-300 lg:flex-1">
        <p className="mb-3">
          <strong className="text-gray-700">Starting Point:</strong>{" "}
          <span className="text-gray-600">{ride.startAddress || renderLocation(ride.startingPoint)}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Destination:</strong>{" "}
          <span className="text-gray-600">{ride.destinationAddress || renderLocation(ride.destination)}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Fare Per Seat:</strong>{" "}
          <span className="text-gray-600">${ride.farePerSeat}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Vehicle Type:</strong>{" "}
          <span className="text-gray-600">{ride.vehicleType}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Total Seats Available:</strong>{" "}
          <span className="text-gray-600">{ride.totalSeatsAvailable}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Start Time:</strong>{" "}
          <span className="text-gray-600">{new Date(ride.startTime).toLocaleString()}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Duration:</strong>{" "}
          <span className="text-gray-600">{ride.duration ? `${ride.duration} seconds` : 'N/A'}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Distance:</strong>{" "}
          <span className="text-gray-600">{ride.distance ? `${ride.distance} meters` : 'N/A'}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Ride Status:</strong>{" "}
          <span className="text-gray-600">{ride.rideStatus}</span>
        </p>
        <p className="mb-3">
          <strong className="text-gray-700">Stops:</strong>{" "}
          <span className="text-gray-600">{ride.stops ? ride.stops.join(', ') : 'No stops'}</span>
        </p>
        {/* Render riders if needed */}
        {ride.riders && ride.riders.length > 0 && (
          <div className="mt-4">
            <strong className="text-gray-700">Riders:</strong>
            <ul className="mt-2 space-y-2">
              {ride.riders.map((rider, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200">
                  <p className="text-gray-600"><strong>User:</strong> {rider.user?.toString()}</p>
                  <p className="text-gray-600"><strong>Seats Booked:</strong> {rider.seatsBooked}</p>
                  <p className="text-gray-600"><strong>Payment Status:</strong> {rider.paymentStatus}</p>
                  <p className="text-gray-600"><strong>Status:</strong> {rider.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-300 text-gray-700 p-2 rounded-md hover:bg-gray-400 hover:text-gray-800 transition-colors duration-200"
        >
          Back
        </button>
      </div>
  
      {/* Ride Map Section */}
      <div className="mt-6 lg:mt-0 lg:flex-1"> 
        <RideMap start={start} end={end} stops={stops} via={via} />
      </div>
    </div>
  </div>
  );
};

export default RideDetailPage;