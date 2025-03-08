"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CreateRide = () => {
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
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [vehicleType, setVehicleType] = useState(""); // Add vehicleType state

    
    const handleSubmit = async (e) => {
        console.log("user at crateRide======>",user._id)
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
        console.log("server url:", API_URL);

        try {
            const startTime = `${date}T${time}:00Z`;
            const stopsArray = stops.split(",").map(stop => stop.trim());
            const expectedArrivalTimeISO = `${date}T${expectedArrivalTime}:00Z`;

            const rideData = {
                vehicleType:vehicleType,
                startingPoint: departure,
                destination: destination,
                startTime: startTime,
                expectedArrivalTime: expectedArrivalTimeISO,
                totalSeatsAvailable: parseInt(seats),
                farePerSeat: parseFloat(price),
                stops: stopsArray,
                vehicleType: vehicleType, // Add vehicleType to rideData
                user: user._id, // Add provider (user ID) to rideData
            };
            console.log("rideData at createRide=========>",rideData)

            const response = await axios.post(`${API_URL}/rides/createRide`, rideData, {
                withCredentials: true,
            });
            console.log("Ride created:", response.data);
            setSuccessMessage("Ride created successfully!");
            setDeparture("");
            setDestination("");
            setDate("");
            setTime("");
            setExpectedArrivalTime("");
            setSeats("");
            setPrice("");
            setStops("");
            setVehicleType(""); // Reset vehicleType
        } catch (err) {
            console.error("Failed to create ride:", err.response?.data?.errors || err);
            setError(err.response?.data?.message || "Failed to create ride. Please try again.");
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const userData = JSON.parse(storedUser);
            const currentTime = Date.now();

            if (userData.expiration && currentTime < userData.expiration) {
                setUser(userData);
            } else {
                localStorage.removeItem('user');
                router.push('/SignIn');
            }
        } else {
            router.push('/SignIn');
        }
    }, [router]);

    if (!user) {
        return null; // or a loading indicator
    }

    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-semibold mb-4">Create a Ride</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="departure" className="block text-sm font-medium text-gray-700">Departure</label>
                    <input type="text" id="departure" value={departure} onChange={(e) => setDeparture(e.target.value)} placeholder="Enter departure location" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                    <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter destination location" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Starting Time</label>
                    <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="expectedArrivalTime" className="block text-sm font-medium text-gray-700">Expected Arrival Time</label>
                    <input type="time" id="expectedArrivalTime" value={expectedArrivalTime} onChange={(e) => setExpectedArrivalTime(e.target.value)} className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="seats" className="block text-sm font-medium text-gray-700">Seats Available</label>
                    <input type="number" id="seats" value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="Enter number of seats" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price per seat" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="stops" className="block text-sm font-medium text-gray-700">Stops (if any)</label>
                    <input type="text" id="stops" value={stops} onChange={(e) => setStops(e.target.value)} placeholder="Enter stops (comma-separated)" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <div className="mb-4">
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <input type="text" id="vehicleType" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Enter vehicle type" className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none" />
                </div>
                <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">Create Ride</button>
            </form>
        </div>
    );
};

export default CreateRide;