"use client";
import React, { useState } from "react";

const CreateRide = () => {
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
    const [seats, setSeats] = useState("");
    const [price, setPrice] = useState("");
    const [stops, setStops] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ departure, destination, date, time, expectedArrivalTime, seats, price, stops });
        // Handle form submission logic here (replace with API call)
        setDeparture("");
        setDestination("");
        setDate("");
        setTime("");
        setExpectedArrivalTime("");
        setSeats("");
        setPrice("");
        setStops("");
    };

    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-semibold mb-4">Create a Ride</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="departure" className="block text-sm font-medium text-gray-700">Departure</label>
                    <input
                        type="text"
                        id="departure"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        placeholder="Enter departure location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                    <input
                        type="text"
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter destination location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Starting Time</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="expectedArrivalTime" className="block text-sm font-medium text-gray-700">Expected Arrival Time</label>
                    <input
                        type="time"
                        id="expectedArrivalTime"
                        value={expectedArrivalTime}
                        onChange={(e) => setExpectedArrivalTime(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="seats" className="block text-sm font-medium text-gray-700">Seats Available</label>
                    <input
                        type="number"
                        id="seats"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        placeholder="Enter number of seats"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price per seat"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="stops" className="block text-sm font-medium text-gray-700">Stops (if any)</label>
                    <input
                        type="text"
                        id="stops"
                        value={stops}
                        onChange={(e) => setStops(e.target.value)}
                        placeholder="Enter stops (comma-separated)"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                    Create Ride
                </button>
            </form>
        </div>
    );
};

export default CreateRide;