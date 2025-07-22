import express from 'express';
import { getAllCriteria, createCriterion, updateCriterion, deleteCriterion } from '../controllers/Common/criteriaController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes restricted to admin only
router.route('/')
  .get(getAllCriteria) // Get all criteria
  .post(restrictTo('admin'), createCriterion); // Create a new criterion

router.route('/:id')
  .put(restrictTo('admin'), updateCriterion) // Update a criterion
  .delete(restrictTo('admin'), deleteCriterion); // Delete a criterion

export default router;
