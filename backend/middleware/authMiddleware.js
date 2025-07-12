import jwt from "jsonwebtoken";
import User from "../models/User.js";
import School from "../models/School.js";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Try to find user in User model first
        let user = await User.findById(decoded.id).select("-password");
        
        // If not found in User model, try School model
        if (!user) {
            user = await School.findById(decoded.id).select("-password");
        }
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Not authorized, token failed" })
    }
};