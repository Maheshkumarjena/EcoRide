import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    provider: { // The user offering the ride
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    riders: [ // Multiple riders booking the ride
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            seatsBooked: {
                type: Number,
                required: true
            },
            paymentID: {
                type: String, // Store each rider's transaction ID
            },
            paymentStatus: {
                type: String,
                enum: ["pending", "holding", "released"],
                default: "pending",
            },
            otp: {
                type: String,
                select: false,
                required: true
            },
            status: {
                type: String,
                enum: ["pending_otp", "in_progress", "completed", "cancelled"],
                default: "pending_otp",
            }
        }
    ],
    startingPoint: {
        type: Object,
        required: true,
    },
    destination: {
        type: Object,
        required: true,
    },

    farePerSeat: { // Fare is now per seat, not per ride
        type: Number,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ["auto", "car", "moto"],
        required: true,
    },
    totalSeatsAvailable: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number, // in seconds
    },
    startTime: {
        type: Date,
        required: true,
    },
    stops:[{
        type: String,
    }]
    ,
    distance: {
        type: Number, // in meters
    },
    rideStatus: { // Overall ride status
        type: String,
        enum: ["available", "pending", "in_progress", "completed", "cancelled"],
        default: "available",
    }
});

const rideModel = mongoose.model("ride", rideSchema);
export default rideModel;