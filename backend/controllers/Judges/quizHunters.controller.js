import QuizHuntersAnswer from "../../models/markings/QuizHuntersAnswer.js";

// Create a new answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, userId, selectedAnswer, correctAnswer, status } = req.body;
    const newAnswer = new QuizHuntersAnswer({
      questionId,
      userId,
      selectedAnswer,
      correctAnswer,
      status,
    });
    await newAnswer.save();
    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all answers
export const getAnswers = async (req, res) => {
  try {
    const answers = await QuizHuntersAnswer.find();
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single answer by ID
export const getAnswerById = async (req, res) => {
  try {
    const answer = await QuizHuntersAnswer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an answer
export const updateAnswer = async (req, res) => {
  try {
    const { questionId, userId, selectedAnswer, correctAnswer, status } = req.body;
    const updatedAnswer = await QuizHuntersAnswer.findByIdAndUpdate(
      req.params.id,
      {
        questionId,
        userId,
        selectedAnswer,
        correctAnswer,
        status,
      },
      { new: true }
    );
    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an answer
export const deleteAnswer = async (req, res) => {
  try {
    const deletedAnswer = await QuizHuntersAnswer.findByIdAndDelete(req.params.id);
    if (!deletedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
