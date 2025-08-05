
import express from "express";
import {
  getMarkings,
  deleteMarking,
  createOrUpdateBulkMarkings,
} from "../../controllers/Judges/circuitSmashers.controller.js";
import { protect } from "../../middleware/authMiddleware.js";
import { requireJudge } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/bulk", protect, requireJudge, createOrUpdateBulkMarkings);
router.get("/", protect, requireJudge, getMarkings);
router.delete("/:id", protect, deleteMarking);

export default router;
