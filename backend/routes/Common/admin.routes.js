import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { avatarUpload } from "../../middleware/uploadMiddleware.js";
import { 
  requireAdmin, 
  requireAdminorJudge
} from "../../middleware/roleMiddleware.js";
import { deleteSchool, deleteUser, editSchool, editUser, getAllJudges, getAllSchools, getAllUsers, getSchoolScores, showWinners } from "../../controllers/Common/admin.controller.js";

const router = express.Router();

// Public routes
router.get("/users", protect, requireAdmin, getAllUsers);
router.get("/judges", protect, requireAdmin, getAllJudges);
router.get("/schools", protect, requireAdminorJudge, getAllSchools);
router.put("/schools/:id", protect, requireAdmin, avatarUpload.single('avatar'), editSchool);
router.put("/users/:id", protect, requireAdmin, avatarUpload.single('avatar'), editUser);
router.delete("/school/:schoolId", protect, requireAdmin, deleteSchool);
router.delete("/user/:userId", protect, requireAdmin, deleteUser);
router.get("/dashboard", protect, requireAdmin, getSchoolScores);
router.get("/winners", protect, showWinners);

export default router;