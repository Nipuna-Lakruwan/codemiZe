import express from "express";
import {
  addRouteSeekersQuestion,
  getAllRouteSeekersQuestions,
  getRouteSeekersQuestionById,
  updateRouteSeekersQuestion,
  deleteRouteSeekersQuestion,
  deleteManyRouteSeekersQuestions,
  addRouteSeekersQuestionsFromCSV,
  deleteAllRouteSeekersQuestions,
} from "../../controllers/Common/routeSeekersQuestion.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { CSVUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin routes for managing questions
router.post("/", protect, addRouteSeekersQuestion);
router.post(
  "/upload",
  protect,
  CSVUpload.single("csv"),
  addRouteSeekersQuestionsFromCSV
);
router.get("/", protect, getAllRouteSeekersQuestions);
router.get("/:id", protect, getRouteSeekersQuestionById);
router.put("/:id", protect, updateRouteSeekersQuestion);
router.delete("/:id", protect, deleteRouteSeekersQuestion);
router.post("/delete-many", protect, deleteManyRouteSeekersQuestions);
router.delete("/", protect, deleteAllRouteSeekersQuestions);

export default router;
