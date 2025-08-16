
import express from "express";
import {
  createMarking,
  getMarkings,
  getMarkingById,
  updateMarking,
  deleteMarking,
} from "../../controllers/Judges/routeSeekersNetworkDesignMarking.controller.js";

const router = express.Router();

router.post("/", createMarking);
router.get("/", getMarkings);
router.get("/:id", getMarkingById);
router.put("/:id", updateMarking);
router.delete("/:id", deleteMarking);

export default router;
