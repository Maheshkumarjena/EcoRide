// import { Router } from 'express';
// const router = Router();
// import { body } from 'express-validator';
// import { authUser } from '../middlewares/auth.middleware.js';
// import { createRide } from '../controllers/ride.contorller.js';

// router.post(
//     '/create', 
//     authUser,[ 
//     body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
//     body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
//     body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type'),],
//     createRide
// );

// export default router;
