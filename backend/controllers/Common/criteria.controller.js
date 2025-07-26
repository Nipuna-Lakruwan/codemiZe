import Criteria from '../../models/Criteria.js';

// Get all criteria
export const getAllCriteria = async (req, res) => {
  try {
    const criteria = await Criteria.find();
    res.status(200).json({ success: true, data: criteria });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new criterion
export const createCriterion = async (req, res) => {
  try {
    const { criteria } = req.body;

    if (!criteria) {
      return res.status(400).json({ success: false, message: 'Criteria text is required' });
    }

    const newCriterion = await Criteria.create({ criteria });
    res.status(201).json({ success: true, data: newCriterion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCriterias = async (req, res) => {
  try {
    const { criteria, gameType } = req.body;

    if (!criteria || !Array.isArray(criteria)) {
      return res.status(400).json({ success: false, message: 'Criteria array is required' });
    }

    if (!gameType || !["circuitSmashers", "codeCrushers", "routeSeekers"].includes(gameType)) {
      return res.status(400).json({ success: false, message: 'Valid gameType is required' });
    }

    const createdCriterias = await Criteria.insertMany(
      criteria.map(item => ({
        criteria: item,
        gameType: gameType
      }))
    );

    res.status(201).json({ success: true, data: createdCriterias });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a criterion
export const updateCriterion = async (req, res) => {
  try {
    const { id } = req.params;
    const { criteria } = req.body;

    if (!criteria) {
      return res.status(400).json({ success: false, message: 'Criteria text is required' });
    }

    const updatedCriterion = await Criteria.findByIdAndUpdate(
      id,
      { criteria },
      { new: true, runValidators: true }
    );

    if (!updatedCriterion) {
      return res.status(404).json({ success: false, message: 'Criterion not found' });
    }

    res.status(200).json({ success: true, data: updatedCriterion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a criterion
export const deleteCriterion = async (req, res) => {
  try {
    const { id } = req.params;
    const criterion = await Criteria.findByIdAndDelete(id);

    if (!criterion) {
      return res.status(404).json({ success: false, message: 'Criterion not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};