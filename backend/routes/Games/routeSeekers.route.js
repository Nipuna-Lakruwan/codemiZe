import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireJudge, 
  requireSchool 
} from "../../middleware/roleMiddleware.js";
import { CSVUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/uploadQuestion", protect, requireSchool, getAllQuestions);
router.get("/getQuestions", protect, requireAdmin, getQuestionsWithAnswers);
router.post("/submit", protect, requireAdmin, submitAnswers);
router.put("/editQuestion/:questionId", protect, requireAdmin, editQuestion);
router.delete("/deleteQuestion/:questionId", protect, requireAdmin, deleteQuestion);
router.delete("/deleteAllQuestions", protect, requireAdmin, deleteAllQuestions);
router.post("/uploadCSV", protect, requireAdmin, CSVUpload.single('csv'), addQuestionsCSV);
router.post("/setTime", protect, requireAdmin, setTime);
router.post("/submit", protect, requireSchool, submitQuiz);

export default router;