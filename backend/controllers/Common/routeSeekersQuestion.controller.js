import RouteSeekersQuestion from "../../models/questions/RouteSeekersQuestion.js";

// Add a new question
export const addRouteSeekersQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newQuestion = new RouteSeekersQuestion({ question, answer });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions
export const getAllRouteSeekersQuestions = async (req, res) => {
  try {
    const questions = await RouteSeekersQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single question by ID
export const getRouteSeekersQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await RouteSeekersQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question
export const updateRouteSeekersQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const updatedQuestion = await RouteSeekersQuestion.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a question
export const deleteRouteSeekersQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await RouteSeekersQuestion.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
