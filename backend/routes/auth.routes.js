import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { avatarUpload } from "../middleware/uploadMiddleware.js";
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
  updateAvatar,
  logoutUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/signup", avatarUpload.single('avatar'), registerUser);
router.post("/signup-school", avatarUpload.single('avatar'), registerSchool);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes - accessible by all authenticated users
router.get("/getUserInfo", protect, getUserInfo);
router.put("/avatar", protect, avatarUpload.single('avatar'), updateAvatar);

// Role-based protected routes
router.get("/profile", protect, requireSchool, getUserInfo);

// Admin only routes
router.get("/users", protect, requireAdmin, getAllUsers);
router.get("/schools", protect, requireAdmin, getAllSchools);
router.delete("/users/:userId", protect, requireAdmin, deleteUser);

export default router;