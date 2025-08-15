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
  uploadQuestionnaireResourceFile,
  downloadQuestionnaireResourceFile,
  getAllUploadedQuestionnaireResourceFiles,
  deleteQuestionnaireResourceFile,
} from "../../controllers/Common/routeSeekersQuestion.controller.js";
import {
  uploadNetworkDesignPDF,
  getNetworkDesignPDF,
  deleteNetworkDesignPDF,
} from "../../controllers/Common/routeSeekersQuestion.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { requireAdmin } from "../../middleware/roleMiddleware.js";
import { CSVUpload, resourceUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

// Admin routes for managing questions
router.post("/", protect, addRouteSeekersQuestion);
router.post(
  "/upload",
  protect,
  CSVUpload.single("csv"),
  addRouteSeekersQuestionsFromCSV
);
router.post("/upload-resource", protect, resourceUpload.single('file'), uploadQuestionnaireResourceFile);
router.get("/download-resource/:id", protect, downloadQuestionnaireResourceFile);
router.get("/resource-files", protect, getAllUploadedQuestionnaireResourceFiles);
router.delete("/resource-file/:id", protect, deleteQuestionnaireResourceFile);
router.get("/", protect, getAllRouteSeekersQuestions);
router.get("/:id", protect, getRouteSeekersQuestionById);
router.put("/:id", protect, updateRouteSeekersQuestion);
router.delete("/:id", protect, deleteRouteSeekersQuestion);
router.post("/delete-many", protect, deleteManyRouteSeekersQuestions);
router.delete("/", protect, deleteAllRouteSeekersQuestions);

// Routes for Network Design PDF
router.post("/upload-network-design-pdf", protect, requireAdmin, resourceUpload.single("file"), uploadNetworkDesignPDF);
router.get("/get-network-design-pdf", protect, getNetworkDesignPDF);
router.delete("/delete-network-design-pdf", protect, requireAdmin, deleteNetworkDesignPDF);

export default router;
