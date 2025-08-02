import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireJudge, 
  requireSchool 
} from "../middleware/roleMiddleware.js";
import { CSVUpload } from "../middleware/uploadMiddleware.js";
import { addQuestion, addQuestionsCSV, calculateAndUpdateScore, checkCurrentQuestion, deleteAllQuestions, deleteQuestion, editQuestion, getAllQuestions, getQuestionsWithAnswers, setTime, submitQuiz } from "../controllers/Games/quizHunters.controller.js";

const router = express.Router();

// Public routes
router.get("/", protect, requireSchool, getAllQuestions);
router.get("/QnA", protect, requireAdmin, getQuestionsWithAnswers);
router.post("/addQuestion", protect, requireAdmin, addQuestion);
router.put("/editQuestion/:questionId", protect, requireAdmin, editQuestion);
router.delete("/deleteQuestion/:questionId", protect, requireAdmin, deleteQuestion);
router.delete("/deleteAllQuestions", protect, requireAdmin, deleteAllQuestions);
router.post("/uploadCSV", protect, requireAdmin, CSVUpload.single('csv'), addQuestionsCSV);
router.post("/setTime", protect, requireAdmin, setTime);
router.post("/submit", protect, requireSchool, submitQuiz);
router.get("/finish", protect, requireSchool, calculateAndUpdateScore);
router.get("/currentQuestion", protect, requireSchool, checkCurrentQuestion);


export default router;