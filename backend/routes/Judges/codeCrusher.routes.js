import express from "express";
import {
  getMarkings,
  deleteMarking,
  createOrUpdateBulkMarkings,
} from "../../controllers/Judges/codeCrushers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { requireJudge } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, requireJudge, createOrUpdateBulkMarkings);
router.get("/", protect, requireJudge, getMarkings);
router.delete("/:id", protect, requireJudge, deleteMarking);

export default router;