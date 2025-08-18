
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
//http://localhost:8000/api/v1/judges/route-seekers-marking/submit-all
//http://localhost:8000/api/v1/judge/route-seekers-network-design/

export default router;
