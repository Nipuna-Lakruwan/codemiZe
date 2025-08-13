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
