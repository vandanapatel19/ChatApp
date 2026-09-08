import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";


//user signup
export const signup = async (req, res) => {

    const { email, fullName, password, bio } = req.body;

    try {
        if (!email || !fullName || !password || !bio) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email, fullName, password: hashedPassword, bio
        })

        const token = generateToken(newUser._id)

        res.status(201).json({ success: true, message: "User created successfully", userData: newUser, token });

    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        res.json({ success: true, message: "login successfully", token, userData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//check if the user is authenticated
export const checkAuth = async (req, res) => {
    res.json({ success: true, user: req.user })
}

//update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;
        let updatedUser;
        if(!profilePic){
            updatedUser = await User.findOneAndUpdate({_id:userId}, {fullName, bio}, {new:true});
        }
        else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findOneAndUpdate({_id:userId}, {fullName, bio, profilePic: upload.secure_url}, {new:true});
        }

        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}