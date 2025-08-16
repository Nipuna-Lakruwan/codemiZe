import express from "express";
import { 
    getQuestions, 
    submitAnswers, 
    getallstudentanswers, 
    updateStudentAnswers, 
    deleteAllStudentAnswers, 
    updateAnswerStatus,
    uploadNetworkDesign
} from "../../controllers/Games/routeSeekers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { routeSeekersNetworkDesignUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/questions", protect, getQuestions);
router.post("/submit", protect, submitAnswers);
router.post("/upload-network-design", protect, routeSeekersNetworkDesignUpload.single('file'), uploadNetworkDesign);
router.get("/all-student-answers", protect, getallstudentanswers);
router.put("/answers/:id", protect, updateStudentAnswers);
router.patch("/answers/:submissionId/questions/:questionId", protect, updateAnswerStatus);
router.delete("/answers", protect, deleteAllStudentAnswers);

export default router;
