import bycrypt from 'bcrypt';
import crypto from 'crypto';
import rideModel from '../models/ride.model.js';
export const  generateOtpetOtp = async (num)=> {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}



export const CreateRide = async ({ user, startingPoint, destination, vehicleType, totalSeatsAvailable, startTime }) => {
    if (!user || !pickup || !destination || !vehicleType || !totalSeatsAvailable || !startTime) {
        throw new Error('All fields are required');
    }

    // Assuming getFare calculates fare per seat
    const farePerSeat = await getFare(pickup, destination);

    const ride = await rideModel.create({
        provider: user, // Assuming 'user' is the ID of the user creating the ride
        startingPoint,
        destination,
        farePerSeat,
        vehicleType,
        totalSeatsAvailable: totalSeatsAvailable,
        startTime,
        rideStatus: "available", // Default status
        riders: [] // Initially, no riders are booked
    });

    ride.save();

    return ride;
};

const FindRide = async ({startingPoint,destination,vehicleType,startTime,farePerSeat}) => {
    const rides = await rideModel.find({
        startingPoint,
        destination,
        vehicleType,
        startTime,
        farePerSeat,
        rideStatus
    })
    return rides;
}