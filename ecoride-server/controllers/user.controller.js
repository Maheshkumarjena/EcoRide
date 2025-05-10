import userModel from '../models/user.model.js';
import { createUser } from '../services/user.service.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import { generateOtp } from './ride.contorller.js';

console.log("email service id at user.contorller.js====================>",process.env.EMAIL_JS_PUBLICKEY)
// Email configuration -  EmailJS service and template IDs, and Public Key
const emailConfig = {
    serviceId: process.env.EMAIL_JS_SERVICEID,      // Replace with your EmailJS service ID
    templateId: process.env.EMAIL_JS_TEMPLETID,    // Replace with your EmailJS template ID
    publicKey: process.env.EMAIL_JS_PUBLICKEY,        // Replace with your EmailJS public key
};


export const createAndSendOtp = async (req,res) => {
    try {
        console.log('req. body at create otp----------->',req.body)
        const { email } = req.body;
    
        // Find the user by email
        const user = await userModel.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
    
        // Generate a new OTP
        const verificationCode = generateOtp(6);
        
    
        // Update or create the verification code in the user document
        user.verificationCode = verificationCode;
        user.verificationCodeExpiresAt = Date.now() + 3600000; // OTP expires in 1 hour (adjust as needed)
        await user.save();
    
        // Send the verification email (you can also handle this in the background)
        //await sendVerificationEmail(email, verificationCode); // uncomment if you want to send email from backend.
        res.status(200).json({ verificationCode, message: 'Verification code generated.' });
    
      } catch (error) {
        console.error('Error generating verification code:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
};

// New function to handle sending the verification email
export const verifyOtp = async (req, res, next) => {
    console.log("verification function hit",req.body)
    try {
        const { email, verificationCode } = req.body;
        console.log("email , vc",email, verificationCode)
    
        // Find the user by email
        const user = await userModel.findOne({ email });
        console.log("verification code", verificationCode)
        console.log("user at verify otp ==========<", user)
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
    
        // Check if the verification code matches and is not expired
        if (user.verificationCode == verificationCode && user.verificationCodeExpiresAt > Date.now()) {
          // Verification successful
          user.isVerified = true; // Mark the user as verified
          user.verificationCode = undefined; // Clear the verification code
          user.verificationCodeExpiresAt = undefined; // Clear the expiration date
          await user.save();
    
          res.status(200).json({ message: 'Email verified successfully.' });
        } else {
          // Verification failed
          res.status(400).json({ message: 'Invalid verification code or code expired.' });
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
};



export const registerUser = async (req, res, next) => {

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    console.log("inside registerUser controller , req.body", req.body);
    const { firstname,lastname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    
    const user = await createUser({
     firstname,
        lastname,
        email,
        password: hashedPassword
    });

    user.save();

    console.log("user at registerUser controller", user);

    const token = user.generateAuthToken(user);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(201).json({ message:'user registered successfully', token, user: userWithoutPassword  });


}

export const loginUser = async (req, res, next) => {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await user.comparePassword(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken(userModel);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    
    res.cookie('token', token,{ httpOnly: true , secure: true, sameSite: 'none' });
    
    res.status(200).json({ token, user: userWithoutPassword });
}

export const getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}

export const logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    // await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}