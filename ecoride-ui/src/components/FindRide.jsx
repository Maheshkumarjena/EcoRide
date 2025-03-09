"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAddressFromCoordinates } from "@/lib/utils"; // Assuming you have this utility function

const FindRide = () => {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY 
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [findDate, setFindDate] = useState("");
    const [findTime, setFindTime] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [onboarding, setOnboarding] = useState("");
    const [foundRides, setFoundRides] = useState([]);
    const [ridesWithAddresses, setRidesWithAddresses] = useState([]); // State to store rides with addresses

    const handleFind = async (e) => {
        e.preventDefault();
        try {
            const startTime = findDate && findTime ? `${findDate}T${findTime}:00Z` : null;

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
            console.log("processed rides with locaiton :", ridesWithAddresses)
            setRidesWithAddresses(ridesWithAddresses);
        }

        fetchAddresses();
    }, [foundRides, API_URL]); // Run when foundRides or API_URL changes

    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-semibold mb-4">Find a Ride</h2>
            <form onSubmit={handleFind}>
                <div className="mb-4">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                    <input type="text" id="from" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} placeholder="Enter departure location" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                    <input type="text" id="to" value={toLocation} onChange={(e) => setToLocation(e.target.value)} placeholder="Enter destination location" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="findDate" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="findDate" value={findDate} onChange={(e) => setFindDate(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="findTime" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" id="findTime" value={findTime} onChange={(e) => setFindTime(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
                    <input type="number" id="maxPrice" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Enter max fare" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="onboarding" className="block text-sm font-medium text-gray-700">Onboarding Point</label>
                    <input type="text" id="onboarding" value={onboarding} onChange={(e) => setOnboarding(e.target.value)} placeholder="Enter onboarding location" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">Find Ride</button>
            </form>
            {ridesWithAddresses.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Found Rides:</h3>
                    <ul>
                        {ridesWithAddresses.map((ride) => (
                            <li key={ride._id} className="border p-2 mb-2 rounded">
                                <p>From: {ride.startAddress}</p>
                                <p>To: {ride.destinationAddress}</p>
                                <p>Price: {ride.farePerSeat}</p>
                                {/* Display other relevant ride details */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {ridesWithAddresses.length === 0 && foundRides.length !== undefined && (<div className="mt-4">No rides found.</div>)}
        </div>
    );
};

export default FindRide;