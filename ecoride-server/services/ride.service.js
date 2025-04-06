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