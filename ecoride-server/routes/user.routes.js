import { body } from 'express-validator';
import { Router } from 'express';
import {registerUser,loginUser,logoutUser,getUserProfile, verifyOtp} from '../controllers/user.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import { createAndSendOtp } from '../controllers/user.controller.js';

const router = Router();    

body('email').isEmail().withMessage('Invalid Email'),
router.post('/register', [
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    loginUser
)

router.get('/profile', authUser, getUserProfile)

router.get('/logout', authUser, logoutUser)

router.post('/getOtp',createAndSendOtp)

router.post('/verifyOtp',verifyOtp)


export default router;