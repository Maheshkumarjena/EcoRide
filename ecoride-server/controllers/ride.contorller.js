import { validationResult } from "express-validator";
// import getFare from "../utils/getFare";
import mongoose from "mongoose";
import rideModel from "../models/ride.model.js";
import crypto from 'crypto';
import { getCoordinates } from "./map.controller.js";
import { getRouteCoordinates } from "../services/map.service.js";
import { calculateDistanceWithCoords } from "../services/map.service.js";
import { processRides } from "../services/map.service.js";

export const generateOtpetOtp = async (num) => {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}




export const createRide = async (req, res) => {
    console.log("create ride controller called")
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    try {
        // Extract data from request body
        const { user: provider, vehicleType, totalSeatsAvailable, startTime, expectedArrivalTime, stops, farePerSeat } = req.body;
        console.log("reqest body ", req.body)

        if (!provider || !req.body.startingPoint || !req.body.destination || !vehicleType || !totalSeatsAvailable || !startTime || !expectedArrivalTime) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Convert locations to coordinates
        const startingPoint = await getCoordinates(req.body.startingPoint);
        const destination = await getCoordinates(req.body.destination);
        console.log("startingpoint and destination in ride.controller.js", startingPoint, destination)

        if (!startingPoint || !destination) {
            return res.status(400).json({ message: "Invalid location provided" });
        }

        // Create ride in database
        const ride = await rideModel.create({
            provider, // User offering the ride
            startingPoint,
            destination,
            farePerSeat,
            vehicleType,
            totalSeatsAvailable,
            startTime,
            expectedArrivalTime,
            stops: stops || [], // Optional stops
            rideStatus: "available", // Default status
            riders: [] // Initially, no riders booked
        });

        res.status(201).json({ message: "Ride created successfully!", ride });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create ride", error: error.message });
    }
};

export const findRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const startingPoint = await getCoordinates(req.body.startingPoint);
        const destination = await getCoordinates(req.body.destination);
        const onboarding = await getCoordinates(req.body.onboarding);
        console.log("startingpoint and destination in ride.controller.js", startingPoint, destination);

        const { startTime, minPrice, maxPrice, maxDistance = 20 } = req.body;

        let query = {};

        // 1️⃣ Search by Location (Starting Point & Destination)
        if (startingPoint && destination) {
            query.startingPoint = startingPoint;
            query.destination = destination;
        }

        // 2️⃣ Search by Time (Start Time & Expected Arrival Time)
        if (startTime) {
            query.startTime = {};
            if (startTime) query.startTime.$gte = new Date(startTime);
        }

        // 3️⃣ Search by Price Range
        if (minPrice || maxPrice) {
            query.farePerSeat = {};
            if (minPrice) query.farePerSeat.$gte = minPrice;
            if (maxPrice) query.farePerSeat.$lte = maxPrice;
        }

        let rides = await rideModel.find(query).sort({ startTime: 1 });
        console.log("rides in findRide controller==========================>", rides);

        // 4️⃣ Search by Onboarding Point (Coordinate Proximity) and Stops
        if (onboarding && onboarding.coordinates) {
            rides = await Promise.all(rides.map(async ride => {
                const startCoords = ride.startingPoint;
                const endCoords = ride.destination;

                if (!startCoords || !endCoords) return null;

                const routeCoordinates = await getRouteCoordinates(startCoords, endCoords);

                let isNear = false;
                if (routeCoordinates) {
                    isNear = routeCoordinates.some(coord => {
                        const distance = calculateDistanceWithCoords(
                            onboarding.coordinates.lat,
                            onboarding.coordinates.lng,
                            coord.lat,
                            coord.lng
                        );
                        return distance <= parseFloat(maxDistance);
                    });
                }

                // Check if any stop matches the onboarding point
                let hasMatchingStop = false;
                if (ride.stops && ride.stops.length > 0) {
                    for (const stopName of ride.stops) {
                        const stopCoordinates = await getCoordinates(stopName);
                        if (stopCoordinates && stopCoordinates.coordinates) {
                            const distanceToStop = calculateDistanceWithCoords(
                                onboarding.coordinates.lat,
                                onboarding.coordinates.lng,
                                stopCoordinates.coordinates.lat,
                                stopCoordinates.coordinates.lng
                            );
                            if (distanceToStop <= parseFloat(maxDistance)) {
                                hasMatchingStop = true;
                                break;
                            }
                        }
                    }
                }

                return isNear || hasMatchingStop ? ride : null;
            }));

            rides = rides.filter(ride => ride !== null);
        }

        if (rides.length === 0) {
            return res.status(404).json({ message: "No rides found matching your criteria" });
        }

        const apiKey = process.env.NEXT_PUBLIC_GRAPHHOPPER_API_KEY;
        const ridesWithLocations = await processRides(rides, apiKey);

        res.status(200).json({ message: "Rides found successfully", rides: ridesWithLocations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching rides", error: error.message });
    }
};


export const getAllRides = async (req, res) => {
    try {
        let rides = await rideModel.find().sort({ startTime: 1 });

        if (!rides || rides.length === 0) {
            return res.status(404).json({ message: "No rides found." });
        }

        res.status(200).json({ rides }); // Send the rides as a JSON response
    } catch (error) {
        console.error("Error getting all rides:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getRideById = async (req, res) => {
    console.log('getRideById is hit')
    try {
        let id = req.params.id.trim();  // Trim any extra spaces or newlines
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid Ride ID format' });
        }
    
        const ride = await rideModel.findById(id);
        if (!ride) {
          return res.status(404).json({ error: 'Ride not found' });
        }
    
        res.json({ ride });
      } catch (error) {
        console.error("Error fetching ride:", error);
        res.status(500).json({ error: 'Server error' });
      }
  };