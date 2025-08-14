import RouteSeekersQuestion from "../../models/questions/RouteSeekersQuestion.js";
import RouteSeekersAnswer from "../../models/markings/RouteSeekersAnswer.js";

// Get all questions for students
export const getQuestions = async (req, res) => {
  try {
    const questions = await RouteSeekersQuestion.find().select("-answer");
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit answers
export const submitAnswers = async (req, res) => {
  try {
    const { id: userId } = req.user; 
    const { answers } = req.body;

    const answerDetails = answers.map(answer => ({
      questionId: answer.questionId,
      answer: answer.answer,
    }));

    const newAnswer = new RouteSeekersAnswer({
      userId,
      Answers: answerDetails,
    });

    await newAnswer.save();
    res.status(201).json({ message: "Answers submitted successfully", result: newAnswer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all student answers
export const getallstudentanswers = async (req, res) => {
  try {
    const answers = await RouteSeekersAnswer.find().populate("userId", "username school");
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student answers
export const updateStudentAnswers = async (req, res) => {
  try {
    const { id } = req.params; // The ID of the RouteSeekersAnswer document
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const updatedAnswer = await RouteSeekersAnswer.findByIdAndUpdate(
      id,
      { Answers: answers },
      { new: true, runValidators: true }
    );

    if (!updatedAnswer) {
      return res.status(404).json({ message: "Answer document not found" });
    }

    res.status(200).json({ message: "Answers updated successfully", result: updatedAnswer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
