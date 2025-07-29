import RouteSeekersMarking from "../../models/markings/RouteSeekersMarking.js";

// Create a new marking
export const createMarking = async (req, res) => {
  try {
    const { schoolId, judgeId, marks } = req.body;
    const newMarking = new RouteSeekersMarking({
      schoolId,
      judgeId,
      marks,
    });
    await newMarking.save();
    res.status(201).json(newMarking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all markings
export const getMarkings = async (req, res) => {
  try {
    const markings = await RouteSeekersMarking.find();
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
    res.status(200).json({ message: "Marking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
