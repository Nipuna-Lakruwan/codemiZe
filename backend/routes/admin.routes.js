import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireAdminorJudge
} from "../middleware/roleMiddleware.js";
import { deleteSchool, deleteUser, editSchool, editUser, getAllJudges, getAllSchools, getAllUsers, getSchoolScores } from "../controllers/Common/admin.controller.js";

const router = express.Router();

// Public routes
router.get("/users", protect, requireAdmin, getAllUsers);
router.get("/judges", protect, requireAdmin, getAllJudges);
router.get("/schools", protect, requireAdminorJudge, getAllSchools);
router.put("/schools/:id", protect, requireAdmin, editSchool);
router.put("/users/:id", protect, requireAdmin, editUser);
router.delete("/school/:schoolId", protect, requireAdmin, deleteSchool);
router.delete("/user/:userId", protect, requireAdmin, deleteUser);
router.get("/dashboard", protect, requireAdmin, getSchoolScores);

export default router;