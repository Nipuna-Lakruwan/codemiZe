import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  requireAdmin, 
  requireJudge, 
  requireSchool 
} from "../middleware/roleMiddleware.js";
import { activateGame, completeGame, deactivateGame, getActiveGame, getGames } from "../controllers/Common/games.controller.js";

const router = express.Router();

// Public routes
router.get("/", protect, getGames);
router.get("/active", protect, getActiveGame);
router.patch("/activate/:gameId", protect, requireAdmin, activateGame);
router.patch("/deactivate/:gameId", protect, requireAdmin, deactivateGame);
router.patch("/complete/:gameId", protect, requireAdmin, completeGame);

export default router;