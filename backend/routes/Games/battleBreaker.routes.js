import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireAdminorJudge, 
  requireJudge, 
  requireSchool 
} from "../../middleware/roleMiddleware.js";
import { addQuestion, addQuestionsCSV, buzzerPress, deleteAllQuestions, deleteQuestion, editQuestion, finishGame, getAnswers, getDashboard, getQuestions, getTime, submitAnswers } from "../../controllers/Games/battleBreakers.controller.js";
import { CSVUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", protect, requireAdminorJudge, getQuestions);
router.get("/answers", protect, requireAdminorJudge, getAnswers);
router.post("/press", protect, requireSchool, buzzerPress);
router.get("/school/:questionId", protect, requireAdmin, getDashboard);
router.post("/addQuestion", protect, requireAdmin, addQuestion);
router.put("/editQuestion/:questionId", protect, requireAdmin, editQuestion);
router.delete("/deleteQuestion/:questionId", protect, requireAdmin, deleteQuestion);
router.delete("/deleteAllQuestions", protect, requireAdmin, deleteAllQuestions);
router.post("/uploadCSV", protect, requireAdmin, CSVUpload.single('csv'), addQuestionsCSV);
router.post("/submit", protect, requireAdmin, submitAnswers);
router.put("/finishGame", protect, requireAdmin, finishGame);
router.get("/allocatedTime", protect, requireAdmin, getTime);

export default router;