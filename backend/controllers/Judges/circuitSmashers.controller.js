
import CircuitSmashersMarking from "../../models/markings/CircuitSmashersMarking.js";

// Create or update bulk markings
export const createOrUpdateBulkMarkings = async (req, res) => {
  try {
    const { markings } = req.body;
    const judgeId = req.user.id;
    
    // markings is an object where keys are schoolIds and values are objects with criteriaId: mark pairs
    const results = [];
    
    for (const schoolId in markings) {
      const schoolMarks = markings[schoolId];
      
      // Convert the marks object to the required array format
      const marksArray = [];
      let totalMarks = 0;
      
      for (const criteriaId in schoolMarks) {
        const mark = parseInt(schoolMarks[criteriaId]) || 0;
        marksArray.push({
          criteriaId: criteriaId,
          mark: mark
        });
        totalMarks += mark;
      }
      
      // Check if marking already exists for this school and judge
      const existingMarking = await CircuitSmashersMarking.findOne({
        schoolId: schoolId,
        judgeId: judgeId
      });
      
      if (existingMarking) {
        // Update existing marking
        existingMarking.marks = marksArray;
        existingMarking.totalMarks = totalMarks;
        await existingMarking.save();
        results.push(existingMarking);
      } else {
        // Create new marking
        const newMarking = new CircuitSmashersMarking({
          schoolId: schoolId,
          judgeId: judgeId,
          marks: marksArray,
          totalMarks: totalMarks
        });
        await newMarking.save();
        results.push(newMarking);
      }
    }
    
    res.status(200).json({
      message: "Markings saved successfully",
      markings: results
    });
  } catch (error) {
    console.error("Error saving bulk markings:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all markings
export const getMarkings = async (req, res) => {
  try {
    const judgeId  = req.user.id;
    const markings = await CircuitSmashersMarking.find({ judgeId });

    // Transform markings to the expected format
    const transformedMarkings = {};
    markings.forEach(marking => {
      transformedMarkings[marking.schoolId] = {};
      marking.marks.forEach(mark => {
        transformedMarkings[marking.schoolId][mark.criteriaId] = mark.mark;
      });
    });
    
    res.status(200).json(transformedMarkings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a marking
export const deleteMarking = async (req, res) => {
  try {
    const deletedMarking = await CircuitSmashersMarking.findByIdAndDelete(req.params.id);
    if (!deletedMarking) {
      return res.status(404).json({ message: "Marking not found" });
    }
    res.status(200).json({ message: "Marking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};