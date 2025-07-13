import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireJudge, 
  requireSchool 
} from "../middleware/roleMiddleware.js";
import { 
  getUserInfo, 
  loginUser, 
  registerUser, 
  registerSchool,
  getAllUsers,
  getAllSchools,
  deleteUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/signup", registerUser);
router.post("/signup-school", registerSchool);
router.post("/login", loginUser);

// Protected routes - accessible by all authenticated users
router.get("/getUserInfo", protect, getUserInfo);

// Role-based protected routes
router.get("/profile", protect, requireSchool, getUserInfo);

// Admin only routes
router.get("/users", protect, requireAdmin, getAllUsers);
router.get("/schools", protect, requireAdmin, getAllSchools);
router.delete("/users/:userId", protect, requireAdmin, deleteUser);

export default router;