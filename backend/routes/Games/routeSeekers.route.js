import express from "express";
import { 
    getQuestions, 
    submitAnswers, 
    getallstudentanswers, 
    updateStudentAnswers, 
    deleteAllStudentAnswers, 
    updateAnswerStatus,
    uploadNetworkDesign,
    getAllNetworkDesigns,
    deleteNetworkDesign,
    downloadAllNetworkDesigns,
    downloadNetworkDesign
} from "../../controllers/Games/routeSeekers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { routeSeekersNetworkDesignUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitAnswers);
router.post("/upload-network-design", protect, routeSeekersNetworkDesignUpload.single('file'), uploadNetworkDesign);
router.get("/network-designs", protect, getAllNetworkDesigns);
router.delete("/network-designs/:id", protect, deleteNetworkDesign);
router.get("/download-all-network-designs", protect, downloadAllNetworkDesigns);
router.get("/network-designs/:id/download", protect, downloadNetworkDesign);
router.get("/all-student-answers", protect, getallstudentanswers);
router.put("/answers/:id", protect, updateStudentAnswers);
router.patch("/answers/:submissionId/questions/:questionId", protect, updateAnswerStatus);
router.delete("/answers", protect, deleteAllStudentAnswers);

export default router;
