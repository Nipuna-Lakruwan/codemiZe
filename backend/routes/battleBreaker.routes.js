import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireJudge, 
  requireSchool 
} from "../middleware/roleMiddleware.js";
import { addQuestion, addQuestionsCSV, buzzerPress, deleteAllQuestions, deleteQuestion, editQuestion, getDashboard, getQuestions, submitAnswers } from "../controllers/Games/battleBreakers.controller.js";
import { CSVUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", protect, requireAdmin, getQuestions);
router.post("/press", protect, requireSchool, buzzerPress);
router.get("/school/:questionId", protect, requireAdmin, getDashboard);
router.post("/addQuestion", protect, requireAdmin, addQuestion);
router.put("/editQuestion/:questionId", protect, requireAdmin, editQuestion);
router.delete("/deleteQuestion/:questionId", protect, requireAdmin, deleteQuestion);
router.delete("/deleteAllQuestions", protect, requireAdmin, deleteAllQuestions);
router.post("/uploadCSV", protect, requireAdmin, CSVUpload.single('csv'), addQuestionsCSV);
router.post("/submit", protect, requireAdmin, submitAnswers);

export default router;