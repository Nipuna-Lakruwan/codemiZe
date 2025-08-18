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
  uploadNetworkDesignPDF,
  deleteNetworkDesignPDF,
  getAllNetworkDesignPDFs,
  getNetworkDesignPDFById,
  getFirstNetworkDesignPDF,
  viewNetworkDesignPDF,
  downloadFirstQuestionnaireResourceFile,
  deleteAllResourceFiles
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

// Routes for Network Design PDF
router.post("/network-design/upload", protect, requireAdmin, resourceUpload.single("file"), uploadNetworkDesignPDF);
router.get("/network-designs", protect, getAllNetworkDesignPDFs);
router.get("/network-design/first", protect, getFirstNetworkDesignPDF);
router.get("/network-design/view/:id", protect, viewNetworkDesignPDF);
router.get("/network-design/:id", protect, getNetworkDesignPDFById);
router.delete("/network-design/:id", protect, requireAdmin, deleteNetworkDesignPDF);

router.get("/resource/download/first", protect, downloadFirstQuestionnaireResourceFile);

router.get("/download-resource/:id", protect, downloadQuestionnaireResourceFile);
router.get("/resource-files", protect, getAllUploadedQuestionnaireResourceFiles);
router.delete("/resource-file/:id", protect, deleteQuestionnaireResourceFile);
router.delete("/resource-files", protect, deleteAllResourceFiles);
router.get("/", protect, getAllRouteSeekersQuestions);
router.post("/delete-many", protect, deleteManyRouteSeekersQuestions);
router.delete("/", protect, deleteAllRouteSeekersQuestions);

// These routes with dynamic :id should be last
router.get("/:id", protect, getRouteSeekersQuestionById);
router.put("/:id", protect, updateRouteSeekersQuestion);
router.delete("/:id", protect, deleteRouteSeekersQuestion);


export default router;
