"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { getAutoCompleteSuggestions } from "@/lib/utils";
import { toast } from "sonner";

const CreateRide = () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [stops, setStops] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [error, setError] = useState(null);
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const handleDepartureSearch = useCallback(
    _.debounce(async (searchValue) => {
      if (searchValue.trim()) {
        const suggestions = await getAutoCompleteSuggestions(searchValue);
        setDepartureSuggestions(suggestions);
        setShowDepartureSuggestions(true);
      } else {
        setDepartureSuggestions([]);
        setShowDepartureSuggestions(false);
      }
    }, 300),
    []
  );

  const handleDestinationSearch = useCallback(
    _.debounce(async (searchValue) => {
      if (searchValue.trim()) {
        const suggestions = await getAutoCompleteSuggestions(searchValue);
        setDestinationSuggestions(suggestions);
        setShowDestinationSuggestions(true);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("Stored User at create ride :", storedUser);
    const userData = JSON.parse(storedUser);

    if (userData?.isVerified) {
      const currentTime = Date.now();

      if (userData.expiration && currentTime < userData.expiration) {
        setUser(userData);
      } else {
        console.log("User expired");
        localStorage.removeItem('user');
        router.push('/SignIn');
      }
    } else {
      console.log("User not verified");
      router.push('/SignIn');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    
    try {
    const startTime = `${date}T${time}:00Z`;
    const stopsArray = stops.split(",").map(stop => stop.trim());
    const expectedArrivalTimeISO = `${date}T${expectedArrivalTime}:00Z`;
      const rideData = {
        vehicleType: vehicleType,
        startingPoint: departure,
        destination: destination,
        startTime: startTime,
        expectedArrivalTime: expectedArrivalTimeISO,
        totalSeatsAvailable: parseInt(seats),
        farePerSeat: parseFloat(price),
        stops: stopsArray,
        user: user._id,
      };

      const response = await axios.post(`${API_URL}/rides/createRide`, rideData, {
        withCredentials: true,
      });
      console.log("Ride created:", response.data);
      toast.success("Ride created successfully!");

      setDeparture("");
      setDestination("");
      setDate("");
      setTime("");
      setExpectedArrivalTime("");
      setSeats("");
      setPrice("");
      setStops("");
      setVehicleType("");
    } catch (err) {
      console.error("Failed to create ride:", err.response?.data?.errors || err);
      setError(err.response?.data?.message || "Failed to create ride. Please try again.");
    }
  };

  useEffect(() => {
    if (departure) {
      setShowDepartureSuggestions(false);
    }
  }, [departure]);

  useEffect(() => {
    if (destination) {
      setShowDestinationSuggestions(false);
    }
  }, [destination]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 pb-20 text-purple-800 dark:text-purple-200">
  <h2 className="text-2xl font-semibold mb-4 text-purple-900 dark:text-purple-100">Create a Ride</h2>
  {error && <div className="text-red-500 mb-4">{error}</div>}
  {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

  <form onSubmit={handleSubmit}>
    <div className="mb-4 relative">
      <label htmlFor="departure" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Departure</label>
      <input
        type="text"
        id="departure"
        value={departure}
        onChange={(e) => {
          setDeparture(e.target.value);
          handleDepartureSearch(e.target.value);
        }}
        onBlur={() => setTimeout(() => setShowDepartureSuggestions(false), 200)}
        placeholder="Enter departure location"
        className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500"
      />
      {showDepartureSuggestions && departureSuggestions.length > 0 && (
        <ul className="absolute mt-2 bg-white rounded-md dark:bg-purple-800 border border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200 rounded-md shadow-lg w-full z-10">
          {departureSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-md cursor-pointer"
              onClick={() => {
                setDeparture(`${suggestion.name}, ${suggestion.address}`);
              }}
            >
              {`${suggestion.name}, ${suggestion.address}`}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="mb-4 relative">
      <label htmlFor="destination" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Destination</label>
      <input
        type="text"
        id="destination"
        value={destination}
        onChange={(e) => {
          setDestination(e.target.value);
          handleDestinationSearch(e.target.value);
        }}
        onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
        placeholder="Enter destination location"
        className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500"
      />
      {showDestinationSuggestions && destinationSuggestions.length > 0 && (
        <ul className="absolute mt-2 bg-white border border-purple-600 dark:border-purple-700 rounded-md dark:bg-purple-800 border border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200 rounded-md shadow-lg w-full z-10">
          {destinationSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-md cursor-pointer"
              onClick={() => {
                setDestination(`${suggestion.name}, ${suggestion.address}`);
              }}
            >
              {`${suggestion.name}, ${suggestion.address}`}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="mb-4">
      <label htmlFor="date" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Date</label>
      <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <div className="mb-4">
      <label htmlFor="time" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Starting Time</label>
      <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <div className="mb-4">
      <label htmlFor="expectedArrivalTime" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Expected Arrival Time</label>
      <input type="time" id="expectedArrivalTime" value={expectedArrivalTime} onChange={(e) => setExpectedArrivalTime(e.target.value)} className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <div className="mb-4">
      <label htmlFor="seats" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Seats Available</label>
      <input type="number" id="seats" value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="Enter number of seats" className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <div className="mb-4">
      <label htmlFor="price" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Price</label>
      <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price per seat" className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <div className="mb-4">
      <label htmlFor="stops" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Stops (if any)</label>
      <input type="text" id="stops" value={stops} onChange={(e) => setStops(e.target.value)} placeholder="Enter stops (comma-separated)" className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <div className="mb-4">
      <label htmlFor="vehicleType" className="block text-sm font-medium text-purple-700 dark:text-purple-300">Vehicle Type</label>
      <input type="text" id="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Enter vehicle type" className="mt-1 p-2 w-full border border-purple-400 dark:border-purple-600 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 placeholder-purple-600 dark:placeholder-purple-400 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-purple-500 dark:focus:ring-purple-500" />
    </div>
    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md">Create Ride</button>
  </form>
</div>
  );
};

export default CreateRide;