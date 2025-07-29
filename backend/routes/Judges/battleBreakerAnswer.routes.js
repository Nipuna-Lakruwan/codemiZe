
import express from "express";
import {
  createAnswer,
  getAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
} from "../../controllers/Judges/BattleBreakersAnswer.controller.js";

const router = express.Router();

router.post("/", createAnswer);
router.get("/", getAnswers);
router.get("/:id", getAnswerById);
router.put("/:id", updateAnswer);
router.delete("/:id", deleteAnswer);

export default router;
