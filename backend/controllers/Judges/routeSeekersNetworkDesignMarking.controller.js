import RouteSeekersMarking from "../../models/markings/RouteSeekersNetworkDesignMarking.js";
import School from "../../models/School.js";
import RouteSeekersAnswer from "../../models/markings/RouteSeekersAnswer.js";

const updateSchoolRouteSeekersTotalScore = async (schoolId) => {
  try {
    // 1. Get Quiz Score
    const answerDoc = await RouteSeekersAnswer.findOne({ userId: schoolId });
    const quizScore = answerDoc ? answerDoc.score : 0;

    // 2. Get Average Design Score
    const schoolMarkings = await RouteSeekersMarking.find({ schoolId: schoolId });
    let averageDesignScore = 0;
    if (schoolMarkings.length > 0) {
      const judgeTotals = schoolMarkings.map((marking) =>
        marking.marks.reduce((total, m) => total + (m.mark || 0), 0)
      );
      averageDesignScore = judgeTotals.reduce((sum, total) => sum + total, 0) / judgeTotals.length;
    }

    // 3. Calculate total and update school
    const totalScore = quizScore + (averageDesignScore / 2);
    await School.findByIdAndUpdate(schoolId, {
      $set: { "score.RouteSeekers": totalScore },
    });
  } catch (error) {
    console.error(`Failed to update RouteSeekers total score for school ${schoolId}:`, error);
  }
};


// Create a new marking
export const createMarking = async (req, res) => {
  try {
    const { judgeId, markings } = req.body;

    if (!judgeId || !markings || !Array.isArray(markings)) {
      return res.status(400).json({ message: "Invalid request body. 'judgeId' and 'markings' array are required." });
    }

    const operations = markings.map(marking => ({
      updateOne: {
        filter: { schoolId: marking.schoolId, judgeId: judgeId },
        update: { $set: { marks: marking.marks } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await RouteSeekersMarking.bulkWrite(operations);
    }

    const schoolIds = [...new Set(markings.map((m) => m.schoolId))];
    for (const schoolId of schoolIds) {
      await updateSchoolRouteSeekersTotalScore(schoolId);
    }

    res.status(201).json({ message: "Markings submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all markings
export const getMarkings = async (req, res) => {
  try {
    let query = {};
    if (req.query.judgeId) {
      query.judgeId = req.query.judgeId;
    }
    const markings = await RouteSeekersMarking.find(query);
    res.status(200).json(markings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single marking by ID
export const getMarkingById = async (req, res) => {
  try {
    const marking = await RouteSeekersMarking.findById(req.params.id);
    if (!marking) {
      return res.status(404).json({ message: "Marking not found" });
    }
    res.status(200).json(marking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a marking
export const updateMarking = async (req, res) => {
  try {
    const { schoolId, judgeId, marks } = req.body;
    const updatedMarking = await RouteSeekersMarking.findByIdAndUpdate(
      req.params.id,
      {
        schoolId,
        judgeId,
        marks,
      },
      { new: true }
    );
    if (!updatedMarking) {
      return res.status(404).json({ message: "Marking not found" });
    }
    
    await updateSchoolRouteSeekersTotalScore(updatedMarking.schoolId);

    res.status(200).json(updatedMarking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a marking
export const deleteMarking = async (req, res) => {
  try {
    const deletedMarking = await RouteSeekersMarking.findByIdAndDelete(req.params.id);
    if (!deletedMarking) {
      return res.status(404).json({ message: "Marking not found" });
    }
    
    await updateSchoolRouteSeekersTotalScore(deletedMarking.schoolId);

    res.status(200).json({ message: "Marking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
