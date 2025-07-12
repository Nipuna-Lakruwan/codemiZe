import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register User
export const registerUser = async (req, res) => {
    const { fullName, email, password, dob } = req.body;
    
    // validation: Check for missing fields
    if (!fullName || !email || !password || !dob) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password,
            dob,
        });

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try{
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePasswords(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

// Get User Info
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting user info", error: err.message });
  }
};