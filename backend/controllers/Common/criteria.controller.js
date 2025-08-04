import Criteria from '../../models/Criteria.js';

// Get all criteria
export const getAllCriteria = async (req, res) => {
  try {
    const criteria = await Criteria.find().sort({ gameType: 1, criteria: 1 });
    
    // Group criteria by gameType for easier frontend consumption
    const groupedCriteria = {
      circuitSmashers: [],
      codeCrushers: [],
      routeSeekers: []
    };
    
    criteria.forEach(item => {
      if (groupedCriteria[item.gameType]) {
        groupedCriteria[item.gameType].push(item);
      }
    });
    
    res.status(200).json({
      success: true,
      message: "Criteria fetched successfully",
      data: groupedCriteria,
      total: criteria.length
    });
  } catch (error) {
    console.error('Error fetching criteria:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching criteria", 
      error: error.message 
    });
  }
};

// Create a new criterion
export const createCriterion = async (req, res) => {
  try {
    const { criteria, gameType } = req.body;

    // Validation
    if (!criteria || !criteria.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Criteria text is required' 
      });
    }
    
    if (!gameType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Game type is required' 
      });
    }
    
    const validGameTypes = ["circuitSmashers", "codeCrushers", "routeSeekers"];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid game type. Must be one of: circuitSmashers, codeCrushers, routeSeekers" 
      });
    }
    
    // Check for duplicate criteria within the same game type
    const existingCriteria = await Criteria.findOne({ 
      criteria: criteria.trim(), 
      gameType 
    });
    
    if (existingCriteria) {
      return res.status(400).json({ 
        success: false,
        message: `Criteria "${criteria.trim()}" already exists for ${gameType}` 
      });
    }

    const newCriterion = await Criteria.create({ 
      criteria: criteria.trim(), 
      gameType 
    });
    
    res.status(201).json({ 
      success: true, 
      message: "Criteria created successfully",
      data: newCriterion 
    });
  } catch (error) {
    console.error('Error creating criteria:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating criteria",
      error: error.message 
    });
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
    const { criteria, gameType } = req.body;

    // Validation
    if (!criteria || !criteria.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Criteria text is required' 
      });
    }
    
    if (!gameType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Game type is required' 
      });
    }
    
    const validGameTypes = ["circuitSmashers", "codeCrushers", "routeSeekers"];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid game type. Must be one of: circuitSmashers, codeCrushers, routeSeekers" 
      });
    }
    
    // Check if criteria exists
    const existingCriteria = await Criteria.findById(id);
    if (!existingCriteria) {
      return res.status(404).json({ 
        success: false,
        message: "Criteria not found" 
      });
    }
    
    // Check for duplicate criteria within the same game type (excluding current item)
    const duplicateCriteria = await Criteria.findOne({ 
      criteria: criteria.trim(), 
      gameType,
      _id: { $ne: id }
    });
    
    if (duplicateCriteria) {
      return res.status(400).json({ 
        success: false,
        message: `Criteria "${criteria.trim()}" already exists for ${gameType}` 
      });
    }

    const updatedCriterion = await Criteria.findByIdAndUpdate(
      id,
      { 
        criteria: criteria.trim(),
        gameType
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Criteria updated successfully",
      data: updatedCriterion 
    });
  } catch (error) {
    console.error('Error updating criteria:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating criteria",
      error: error.message 
    });
  }
};

// Delete a criterion
export const deleteCriterion = async (req, res) => {
  try {
    const { id } = req.params;
    const criterion = await Criteria.findByIdAndDelete(id);

    if (!criterion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Criterion not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Criteria deleted successfully",
      data: criterion 
    });
  } catch (error) {
    console.error('Error deleting criteria:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting criteria",
      error: error.message 
    });
  }
};

// Get criteria by game type
export const getCriteriaByGameType = async (req, res) => {
  try {
    const { gameType } = req.params;
    
    // Validate gameType
    const validGameTypes = ["circuitSmashers", "codeCrushers", "routeSeekers"];
    if (!validGameTypes.includes(gameType)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid game type. Must be one of: circuitSmashers, codeCrushers, routeSeekers" 
      });
    }
    
    const criteria = await Criteria.find({ gameType }).sort({ criteria: 1 });
    
    res.status(200).json({
      success: true,
      message: `Criteria for ${gameType} fetched successfully`,
      data: criteria,
      gameType,
      total: criteria.length
    });
  } catch (error) {
    console.error('Error fetching criteria by game type:', error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching criteria", 
      error: error.message 
    });
  }
};