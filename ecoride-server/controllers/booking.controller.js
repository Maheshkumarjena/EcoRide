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

    // Create rider object
    const riderDetails = {
      user: userId,
      seatsBooked: seats,
      otp: otp,
      paymentID: null, // Initialize paymentID
      paymentStatus: "pending",
      status: "pending_otp",
    };

    // Add rider to the ride
    ride.riders.push(riderDetails);

    // Update totalSeatsAvailable
    ride.totalSeatsAvailable -= seats;

    await ride.save();

    // Find the newly added rider to send back in response
    const newRider = ride.riders.find(rider => rider.user.toString() === userId);
    res.status(201).json({
      message: 'Booking successful!',
      otp,
      rider: {
        _id: newRider._id, // Send rider object ID
        user: newRider.user,
        seatsBooked: newRider.seatsBooked,
        paymentID: newRider.paymentID,
        paymentStatus: newRider.paymentStatus,
        status: newRider.status,
      },
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// Controller to get a ride by rider _id
export const getRiderById = async (req, res) => {
  try {
      const { riderId } = req.params;

      console.log("riderId--------------------->", riderId);

      // Find the ride containing the rider
      const ride = await rideModel.findOne({ "riders._id": riderId })
          .populate("provider", "name email")
          .populate("riders.user", "name email");

      if (!ride) {
          return res.status(404).json({ message: "Ride not found" });
      }

      // Extract the specific rider
      const rider = ride.riders.find(r => r._id.toString() === riderId);

      if (!rider) {
          return res.status(404).json({ message: "Rider not found" });
      }

      res.status(200).json({ rider, ride, providerId: ride.provider._id }); // includes entire ride object
  } catch (error) {
      console.error("Error fetching rider:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};