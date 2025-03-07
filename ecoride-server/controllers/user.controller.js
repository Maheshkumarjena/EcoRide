import userModel from '../models/user.model.js';
import { createUser } from '../services/user.service.js';

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
    res.status(201).json({ token, user: userWithoutPassword });


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