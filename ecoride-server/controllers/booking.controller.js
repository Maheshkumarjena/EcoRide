// controllers/bookingController.js
import rideModel from '../models/ride.model.js';
import userModel from '../models/user.model.js';
import { generateOtp } from './ride.contorller.js';

export const createBooking = async (req, res) => {
  console.log('create bookin hit');
  try {
    const { userId, seats } = req.body;
    const { rideId } = req.params; // Get rideId from URL parameters

    // Validate input
    if (!rideId || !userId || !seats || seats <= 0) {
      return res.status(400).json({ message: 'Invalid booking data.' });
    }

    // Find the ride
    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check seat availability
    if (ride.totalSeatsAvailable < seats) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    // Generate OTP
    const otp = generateOtp(5);
    console.log('otp generated at booking controller  ==========>', otp);

    // Add rider to the ride
    ride.riders.push({
      user: userId,
      seatsBooked: seats,
      otp: otp,
    });

    // Update totalSeatsAvailable
    ride.totalSeatsAvailable -= seats;

    await ride.save();

    res.status(201).json({ message: 'Booking successful!', otp });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};