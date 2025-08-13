import express from "express";
import { getQuestions, submitAnswers } from "../../controllers/Games/routeSeekers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/questions", getQuestions);
router.post("/submit", submitAnswers);

export default router;
