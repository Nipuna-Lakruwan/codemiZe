import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { avatarUpload } from "../../middleware/uploadMiddleware.js";
import { 
  getUserInfo, 
  loginUser, 
  registerUser, 
  registerSchool,
  logoutUser,
} from "../../controllers/Common/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/signup", avatarUpload.single('avatar'), registerUser);
router.post("/signup-school", avatarUpload.single('avatar'), registerSchool);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/getUserInfo", protect, getUserInfo);

export default router;