"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const FindRide = () => {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [findDate, setFindDate] = useState("");
    const [findTime, setFindTime] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [onboarding, setOnboarding] = useState("");
    const [foundRides, setFoundRides] = useState([]);

    const handleFind = async (e) => {
        e.preventDefault();
        try {
            const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";

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

            if (response.data.rides && response.data.rides.length > 0) {
                try {
                    const Rides = await fetchRides(response.data.rides);
                    console.log("Rides after processing:", Rides);
                    setFoundRides(Rides); // Update foundRides with processed data
                } catch (fetchError) {
                    console.error("Error processing rides:", fetchError);
                    // Optionally, keep the original foundRides or handle the error
                }
            } else {
              console.log("No rides to process");
            }

            console.log("Final Found Rides:", foundRides);

        } catch (error) {
            console.error("Error finding rides:", error);
            setFoundRides([]);
        }
    };



        const fetchRides = async (rides) => {
            console.log("fetched ride called =======================",rides)
            try {
                const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    
                const response = await axios.post(`${API_URL}/rides/processRides`,rides);
                setFoundRides(response.data.rides);
                console.log("Found Rides:::::::", response.data.rides);
            } catch (error) {
                console.error("Error finding rides:", error);
                setFoundRides([]);
            }
          };
      
     

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
            {foundRides.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Found Rides:</h3>
                    <ul>
                        {foundRides.map((ride) => (
                            <li key={ride._id} className="border p-2 mb-2 rounded">
                                <p>From: {ride.startingPoint.coordinates.lat}, {ride.startingPoint.coordinates.lng}</p>
                                <p>To: {ride.destination.coordinates.lat}, {ride.destination.coordinates.lng}</p>
                                <p>Price: {ride.farePerSeat}</p>
                                {/* Display other relevant ride details */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {foundRides.length === 0 && foundRides.length !== undefined && (<div className="mt-4">No rides found.</div>)}
        </div>
    );
};

export default FindRide;