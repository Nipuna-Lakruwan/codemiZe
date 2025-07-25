import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireAdminorJudge
} from "../middleware/roleMiddleware.js";
import { deleteUser, getAllJudges, getAllSchools, getAllUsers } from "../controllers/Common/admin.controller.js";

const router = express.Router();

// Public routes
router.get("/users", protect, requireAdmin, getAllUsers);
router.get("/judges", protect, requireAdmin, getAllJudges);
router.get("/schools", protect, requireAdminorJudge, getAllSchools);
router.delete("/school/:schoolId", protect, requireAdmin, deleteUser);

export default router;