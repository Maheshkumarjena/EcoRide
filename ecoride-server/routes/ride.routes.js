import express from "express";
import { body } from "express-validator";
import { createRide } from "../controllers/ride.contorller.js";
import { findRide } from "../controllers/ride.contorller.js";

const router = express.Router();

router.post(
    "/createRide",
    [
        body("user").notEmpty().withMessage("User ID is required"),
        body("startingPoint").notEmpty().withMessage("Starting point is required"),
        body("destination").notEmpty().withMessage("Destination is required"),
        body("vehicleType").isIn(["auto", "car", "moto"]).withMessage("Invalid vehicle type"),
        body("totalSeatsAvailable").isInt({ min: 1 }).withMessage("Total seats must be at least 1"),
        body("startTime").isISO8601().toDate().withMessage("Invalid start time format"),
    ],
    createRide
);

router.post(
    "/findRide",
    [
        body("startingPoint").notEmpty().withMessage("Starting point is required"),
        body("destination").notEmpty().withMessage("Destination is required"),
        body("onboarding").notEmpty().withMessage("Onboarding point is required"),
        body("minPrice").optional().isNumeric().withMessage("Min price must be a number"),
        body("maxPrice").optional().isNumeric().withMessage("Max price must be a number"),
        body("maxDistance").optional().isNumeric().withMessage("Max distance must be a number"),
    ],
    findRide
);

export default router;
