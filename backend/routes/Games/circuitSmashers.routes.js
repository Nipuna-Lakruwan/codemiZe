import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireAdminorJudge, 
  requireJudge, 
  requireSchool 
} from "../../middleware/roleMiddleware.js";
import { resourceUpload, slidesUpload } from "../../middleware/uploadMiddleware.js";
import { deleteAllSlides, getAllResources, getCriteria, getFormattedCircuitSmashersMarkings, getResource, getResourceCount, getSlides, getTime, setTime, uploadResource, uploadSlides } from "../../controllers/Games/circuitSmashers.controller.js";

const router = express.Router();

router.get("/", protect, requireSchool, getSlides);
router.get("/criteria", protect, requireAdminorJudge, getCriteria);
router.post("/slides", protect, requireAdmin, slidesUpload.array('slides', 10), uploadSlides);
router.delete("/slides/delete", protect, requireAdmin, deleteAllSlides);
router.post("/upload", protect, requireSchool, resourceUpload.single('resource'), uploadResource);
router.get("/resources", protect, requireAdmin, getAllResources);
router.get("/resources/count", protect, requireAdmin, getResourceCount);
router.get("/resources/:id", protect, requireAdminorJudge, getResource);
router.get("/markings", protect, requireAdminorJudge, getFormattedCircuitSmashersMarkings);
router.get("/time", protect, requireAdmin, getTime);
router.post("/time", protect, requireAdmin, setTime);

export default router;