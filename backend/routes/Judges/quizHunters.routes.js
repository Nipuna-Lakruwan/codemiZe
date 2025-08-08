import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { requireJudge } from "../../middleware/roleMiddleware.js";
import { getMarking } from "../../controllers/Judges/quizHunters.controller.js";

const router = express.Router();

router.get("/", protect, requireJudge, getMarking);

export default router;