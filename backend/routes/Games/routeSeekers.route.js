import express from "express";
import { getQuestions, submitAnswers, getallstudentanswers } from "../../controllers/Games/routeSeekers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitAnswers);
router.get("/all-answers", protect, getallstudentanswers);

export default router;
