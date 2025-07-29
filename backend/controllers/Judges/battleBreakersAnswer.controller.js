import BattleBreakersAnswer from "../../models/markings/BattleBreakersAnswer.js";

// Create a new answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, responses } = req.body;
    const newAnswer = new BattleBreakersAnswer({
      questionId,
      responses,
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
    const answers = await BattleBreakersAnswer.find();
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single answer by ID
export const getAnswerById = async (req, res) => {
  try {
    const answer = await BattleBreakersAnswer.findById(req.params.id);
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
    const { questionId, responses } = req.body;
    const updatedAnswer = await BattleBreakersAnswer.findByIdAndUpdate(
      req.params.id,
      {
        questionId,
        responses,
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
    const deletedAnswer = await BattleBreakersAnswer.findByIdAndDelete(req.params.id);
    if (!deletedAnswer) {
      return res.status(404).json({ message: "Answer not found" });
    }
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
