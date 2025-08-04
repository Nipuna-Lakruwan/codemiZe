import express from 'express';
import { getAllCriteria, createCriterion, updateCriterion, deleteCriterion, getCriteriaByGameType } from '../controllers/Common/criteria.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { createCriterias } from '../controllers/Common/criteria.controller.js';

const router = express.Router();

router.post("/create", protect, requireAdmin, createCriterias)
router.get("/", protect, requireAdmin, getAllCriteria);
router.get("/:gameType", protect, requireAdmin, getCriteriaByGameType);
router.post("/", protect, requireAdmin, createCriterion);
router.put("/:id", protect, requireAdmin, updateCriterion);
router.delete("/:id", protect, requireAdmin, deleteCriterion);

export default router;
