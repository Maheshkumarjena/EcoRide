"use client";
import React, { useState } from "react";

const FindRide = () => {
    const [fromLocation, setFromLocation] = useState("");
    const [toLocation, setToLocation] = useState("");
    const [findDate, setFindDate] = useState("");
    const [findTime, setFindTime] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [onboardingPoint, setOnboardingPoint] = useState("");

    const handleFind = (e) => {
        e.preventDefault();
        console.log({ fromLocation, toLocation, findDate, findTime, vehicleType, maxPrice, onboardingPoint });
        // Handle find ride logic here (replace with API call)
        setFromLocation("");
        setToLocation("");
        setFindDate("");
        setFindTime("");
        setVehicleType("");
        setMaxPrice("");
        setOnboardingPoint("");
    };

    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-semibold mb-4">Find a Ride</h2>
            <form onSubmit={handleFind}>
                <div className="mb-4">
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
                    <input
                        type="text"
                        id="from"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        placeholder="Enter departure location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
                    <input
                        type="text"
                        id="to"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        placeholder="Enter destination location"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="findDate" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="findDate"
                        value={findDate}
                        onChange={(e) => setFindDate(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="findTime" className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                        type="time"
                        id="findTime"
                        value={findTime}
                        onChange={(e) => setFindTime(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <select
                        id="vehicleType"
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    >
                        <option value="">Select vehicle type</option>
                        <option value="Car">Car</option>
                        <option value="Bike">Bike</option>
                        <option value="Auto">Auto</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
                    <input
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Enter max fare"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="onboardingPoint" className="block text-sm font-medium text-gray-700">Onboarding Point</label>
                    <input
                        type="text"
                        id="onboardingPoint"
                        value={onboardingPoint}
                        onChange={(e) => setOnboardingPoint(e.target.value)}
                        placeholder="Nearby pickup point"
                        className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                    />
                </div>

                <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
                    Find Ride
                </button>
            </form>
        </div>
    );
};

export default FindRide;