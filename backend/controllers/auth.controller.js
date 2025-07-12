import User from "../models/User.js";
import School from "../models/School.js";
import jwt from "jsonwebtoken";
import { VALID_ROLES } from "../utils/roleConstants.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register User
export const registerUser = async (req, res) => {
    const { name, email, password, profileImageUrl, role } = req.body;
    
    // validation: Check for missing fields
    if (!name || !email || !password || !profileImageUrl || !role) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if User already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            profileImageUrl,
            role: role || "Judge",
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

// Register School
export const registerSchool = async (req, res) => {
    const { name, city, nameInShort, email, password, profileImageUrl, role } = req.body;
    
    // validation: Check for missing fields
    if (!name || !city || !nameInShort || !email || !password || !profileImageUrl || !role) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {
        // Check if school already exists
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Create school user
        const school = await School.create({
            name,
            city,
            nameInShort,
            email,
            password,
            profileImageUrl,
            role: role || "School",
        });

        res.status(201).json({
            id: school._id,
            school,
            token: generateToken(school._id),
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
        
        res.status(200).json({
            id: user._id,
            [responseKey]: user,
            userType,
            token: generateToken(user._id),
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
    const responseKey = userType === 'user' ? 'user' : 'school';

    res.status(200).json({
      [responseKey]: user,
      userType
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting user info", error: err.message });
  }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    const schools = await School.find().select("-password -__v");
    
    res.status(200).json({
      users,
      schools,
      total: users.length + schools.length
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting users", error: err.message });
  }
};

// Get all schools (Admin only)
export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().select("-password -__v");
    
    res.status(200).json({
      schools,
      total: schools.length
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting schools", error: err.message });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Try to delete from User model first
    let deletedUser = await User.findByIdAndDelete(userId);
    let userType = 'user';
    
    // If not found in User model, try School model
    if (!deletedUser) {
      deletedUser = await School.findByIdAndDelete(userId);
      userType = 'school';
    }
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      message: `${userType === 'user' ? 'User' : 'School'} deleted successfully`,
      deletedUser 
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};