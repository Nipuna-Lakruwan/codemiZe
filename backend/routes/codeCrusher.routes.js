import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireJudge, 
  requireSchool 
} from "../middleware/roleMiddleware.js";
import { resourceUpload, slidesUpload } from "../middleware/uploadMiddleware.js";
import { deleteAllSlides, getAllResources, getResource, getSlides, setTime, uploadResource, uploadSlides } from "../controllers/Games/codeCrushers.controller.js";

const router = express.Router();

router.get("/", protect, requireSchool, getSlides);
router.post("/slides", protect, requireAdmin, slidesUpload.array('slides', 10), uploadSlides);
router.get("/slides/delete", protect, requireAdmin, deleteAllSlides);
router.post("/upload", protect, requireSchool, resourceUpload.single('resource'), uploadResource);
router.delete("/resources", protect, requireAdmin, getAllResources);
router.delete("/resources/:id", protect, requireAdmin, getResource);
router.post("/time", protect, requireAdmin, setTime);

export default router;