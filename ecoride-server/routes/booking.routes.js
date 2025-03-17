import { createBooking } from "../controllers/booking.controller.js";
import express from 'express';

const router = express.Router(); // ✅ Corrected this line

router.post('/createBooking/:rideId', createBooking);

export default router;
