import express from 'express';
import { getAllCriteria, createCriterion, updateCriterion, deleteCriterion } from '../controllers/Common/criteria.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { createCriterias } from '../controllers/Common/criteria.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post("/create", requireAdmin, createCriterias)

// Routes restricted to admin only
router.route('/')
  .get(getAllCriteria) // Get all criteria
  .post(requireAdmin, createCriterion); // Create a new criterion

router.route('/:id')
  .put(requireAdmin, updateCriterion) // Update a criterion
  .delete(requireAdmin, deleteCriterion); // Delete a criterion

export default router;
