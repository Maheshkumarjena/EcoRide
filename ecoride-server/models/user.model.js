import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: Number, // or Number, depending on your code generation
    },
    verificationCodeExpiresAt: {
        type: Date,
    },
});



userSchema.methods.generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.methods.comparePassword = async (InputPassword,RegisteredPassword) => {
    return await bcrypt.compare(InputPassword, RegisteredPassword);
}

userSchema.statics.hashPassword = async (password)=> {
    return await bcrypt.hash(password, 10);
}




const userModel = mongoose.model('user', userSchema);


export default userModel;