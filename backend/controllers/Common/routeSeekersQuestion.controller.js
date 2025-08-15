import RouteSeekersQuestion from "../../models/questions/RouteSeekersQuestion.js";
import { parseCSVFile } from "../../utils/csvParser.js";

// Add questions from CSV
export const addRouteSeekersQuestionsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const questions = await parseCSVFile(req.file, "route-seekers");
    if (!questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "No questions found in the CSV file" });
    }

    const newQuestions = await RouteSeekersQuestion.insertMany(questions);
    res.status(201).json(newQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// Delete many questions
export const deleteManyRouteSeekersQuestions = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "An array of question IDs is required" });
    }

    const result = await RouteSeekersQuestion.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No questions found with the provided IDs" });
    }

    res.status(200).json({ message: `${result.deletedCount} questions deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all questions
export const deleteAllRouteSeekersQuestions = async (req, res) => {
  try {
    await RouteSeekersQuestion.deleteMany({});
    res.status(200).json({ message: "All questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
