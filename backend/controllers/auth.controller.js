import User from "../models/User.js";
import School from "../models/School.js";
import jwt from "jsonwebtoken";
import { deleteFromLocal } from "../config/localStorage.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Helper to send token in HTTP-only cookie
const sendToken = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// Register User
export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    // validation: Check for missing fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if User already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Handle avatar upload
        let avatarData = { url: '', publicId: '' };
        if (req.file) {
            avatarData = {
                url: `/uploads/avatars/${req.file.filename}`,
                publicId: req.file.filename
            };
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarData,
            role: role || "Judge",
        });

        res.status(201).json({
            id: user._id,
            user,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Register School
export const registerSchool = async (req, res) => {
    const { name, city, nameInShort, email, password, role } = req.body;
    
    // validation: Check for missing fields
    if (!name || !city || !nameInShort || !email || !password || !role) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if school already exists
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Handle avatar upload
        let avatarData = { url: '', publicId: '' };
        if (req.file) {
            avatarData = {
                url: `/uploads/avatars/${req.file.filename}`,
                publicId: req.file.filename
            };
        }

        // Create school user
        const school = await School.create({
            name,
            city,
            nameInShort,
            email,
            password,
            avatar: avatarData,
            role: role || "School",
        });

        res.status(201).json({
            id: school._id,
            school,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering school", error: err.message });
    }
};

// Login User or School
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try{
        // Try to find user in User model first
        let user = await User.findOne({ email });
        let userType = 'user';
        
        // If not found in User model, try School model
        if (!user) {
            user = await School.findOne({ email });
            userType = 'school';
        }
        
        if (!user || !(await user.comparePasswords(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const responseKey = userType === 'user' ? 'user' : 'school';
        
        const token = generateToken(user._id, user.role);
        sendToken(res, token);

        res.status(200).json({
            id: user._id,
            [responseKey]: user,
            userType,
            message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} logged in successfully`,
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

// Get User Info
export const getUserInfo = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine user type based on the model structure
    const userType = user.city ? 'school' : 'user';

    res.status(200).json({
      user: user,
      userType
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting user info", error: err.message });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
