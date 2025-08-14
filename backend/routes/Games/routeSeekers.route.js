import express from "express";
import { getQuestions, submitAnswers, getallstudentanswers, updateStudentAnswers, deleteAllStudentAnswers } from "../../controllers/Games/routeSeekers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitAnswers);
router.get("/all-student-answers", protect, getallstudentanswers);
router.put("/answers/:id", protect, updateStudentAnswers);
router.delete("/answers", protect, deleteAllStudentAnswers);

export default router;
