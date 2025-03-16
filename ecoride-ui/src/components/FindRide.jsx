"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getAddressFromCoordinates, getAutoCompleteSuggestions } from "@/lib/utils";
import RideList from "./RideList";
import _ from "lodash";

const FindRide = () => {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY;
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [onboarding, setOnboarding] = useState("");
    const [date, setDate] = useState("");
        const [time, setTime] = useState("");
    
    const [findTime, setFindTime] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [foundRides, setFoundRides] = useState([]);
    const [ridesWithAddresses, setRidesWithAddresses] = useState([]);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [onboardingSuggestions, setOnboardingSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [showOnboardingSuggestions, setShowOnboardingSuggestions] = useState(false);

    const handleFromSearch = useCallback(
        _.debounce(async (searchValue) => {
            if (searchValue.trim()) {
                const suggestions = await getAutoCompleteSuggestions(searchValue);
                setFromSuggestions(suggestions);
                setShowFromSuggestions(true);
            } else {
                setFromSuggestions([]);
                setShowFromSuggestions(false);
            }
        }, 300),
        []
    );

    const handleToSearch = useCallback(
        _.debounce(async (searchValue) => {
            if (searchValue.trim()) {
                const suggestions = await getAutoCompleteSuggestions(searchValue);
                setToSuggestions(suggestions);
                setShowToSuggestions(true);
            } else {
                setToSuggestions([]);
                setShowToSuggestions(false);
            }
        }, 300),
        []
    );

    const handleOnboardingSearch = useCallback(
        _.debounce(async (searchValue) => {
            if (searchValue.trim()) {
                const suggestions = await getAutoCompleteSuggestions(searchValue);
                setOnboardingSuggestions(suggestions);
                setShowOnboardingSuggestions(true);
            } else {
                setOnboardingSuggestions([]);
                setShowOnboardingSuggestions(false);
            }
        }, 300),
        []
    );

    const handleFind = async (e) => {
        e.preventDefault();
        try {
            const startTime = `${date}T${time}:00Z`; // Correct ISO 8601 format
            
            const response = await axios.post(`${API_URL}/rides/findRide`, {
                startingPoint: fromLocation,
                destination: toLocation,
                startTime: startTime,
                minPrice: maxPrice ? 0 : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                onboarding: onboarding,
            });

            console.log("Rides before processing:", response.data.rides);
            setFoundRides(response.data.rides);
        } catch (error) {
            console.error("Error finding rides:", error);
            setFoundRides([]);
        }
    };

    useEffect(() => {
        async function fetchAddresses() {
            if (foundRides.length === 0) return;

            const ridesWithAddressesPromises = foundRides.map(async (ride) => {
                const startAddress = await getAddressFromCoordinates(ride.startingPoint.coordinates.lat, ride.startingPoint.coordinates.lng, MAP_URL);
                const destinationAddress = await getAddressFromCoordinates(ride.destination.coordinates.lat, ride.destination.coordinates.lng, MAP_URL);
                return {
                    ...ride,
                    startAddress,
                    destinationAddress,
                };
            });

            const ridesWithAddresses = await Promise.all(ridesWithAddressesPromises);
            console.log("processed rides with location :", ridesWithAddresses);
            setRidesWithAddresses(ridesWithAddresses);
        }

        fetchAddresses();
    }, [foundRides, API_URL, MAP_URL]);

    useEffect(() => {
        if (fromLocation) setShowFromSuggestions(false);
    }, [fromLocation]);

    useEffect(() => {
        if (toLocation) setShowToSuggestions(false);
    }, [toLocation]);

    useEffect(() => {
        if (onboarding) setShowOnboardingSuggestions(false);
    }, [onboarding]);

    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-semibold mb-4">Find a Ride</h2>
            <form onSubmit={handleFind}>
                <div className="mb-4 relative">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                    <input
                        type="text"
                        id="from"
                        value={fromLocation}
                        onChange={(e) => {
                            setFromLocation(e.target.value);
                            handleFromSearch(e.target.value);
                        }}
                        onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                        placeholder="Enter departure location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                    {showFromSuggestions && fromSuggestions.length > 0 && (
                        <ul className="absolute mt-2 bg-white border border-gray-300 dark:bg-purple-800 border border-gray-300 text-black text-white rounded-md shadow-lg w-full z-10">
                            {fromSuggestions.map((suggestion, index) => (

                                <li
                                    key={index}
                                    className="p-2 hover:bg-purple-500 rounded-md cursor-pointer"
                                    onClick={() => {
                                        setFromLocation(`${suggestion.name}, ${suggestion.address}`); // Use full_text
                                    }}
                                >
                                    {suggestion.name}, {suggestion.address}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        type="text"
                        id="to"
                        value={toLocation}
                        onChange={(e) => {
                            setToLocation(e.target.value);
                            handleToSearch(e.target.value);
                        }}
                        onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                        placeholder="Enter destination location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                    {showToSuggestions && toSuggestions.length > 0 && (
                        <ul className="absolute mt-2 bg-white border border-gray-300 rounded-md border-gray-300 dark:bg-purple-800 border border-gray-300 text-white shadow-lg w-full z-10">
                            {toSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="p-2 hover:bg-purple-500 cursor-pointer"
                                    onClick={() => {
                                        setToLocation(`${suggestion.name}, ${suggestion.address}`); // Use full_text
                                    }}
                                >
                                    {suggestion.name}, {suggestion.address} {/* Display full_text */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="onboarding" className="block text-sm font-medium text-gray-700">Onboarding Point</label>
                    <input
                        type="text"
                        id="onboarding"
                        value={onboarding}
                        onChange={(e) => {
                            setOnboarding(e.target.value);
                            handleOnboardingSearch(e.target.value);
                        }}
                        onBlur={() => setTimeout(() => setShowOnboardingSuggestions(false), 200)}
                        placeholder="Enter onboarding location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                    {showOnboardingSuggestions && onboardingSuggestions.length > 0 && (
                        <ul className="absolute mt-2 bg-white border border-gray-300 rounded-md rounded-md border-gray-300 dark:bg-purple-800 border border-gray-300 text-white shadow-lg w-full z-10">
                            {onboardingSuggestions.map((suggestion, index) => (
                                <li
                                    key={index} className="p-2 hover:bg-purple-500 cursor-pointer"
                                    onClick={() => {
                                        setOnboarding(`${suggestion.name}, ${suggestion.address}`); // Use full_text
                                    }}
                                >
                                    {suggestion.name}, {suggestion.address}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="findTime" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" id="findTime" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
                    <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Enter max fare" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">Find Ride</button>
            </form>
            <RideList rides={ridesWithAddresses} />
          
            {ridesWithAddresses.length === 0 && foundRides.length !== undefined && (<div className="mt-4">No rides found.</div>)}
        </div>
    );
};

export default FindRide;