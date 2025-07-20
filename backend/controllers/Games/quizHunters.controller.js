import QuizHuntersQuestion from "../../models/questions/QuizHuntersQuestion.js";
import QuizHuntersAnswer from "../../models/markings/QuizHuntersAnswer.js";
import { parseCSVFile } from "../../utils/csvParser.js";

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await QuizHuntersQuestion.find({});

        const formattedQuestions = questions.map(q => {
            const options = [q.answer, q.option1, q.option2, q.option3];

            // Shuffle the options array
            const shuffledOptions = options.sort(() => Math.random() - 0.5);

            return {
                _id: q._id,
                question: q.question,
                options: shuffledOptions,
            };
        });

        res.status(200).json({ questions: formattedQuestions });
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getQuestionsWithAnswers = async (req, res) => {
    try {
        const questions = await QuizHuntersQuestion.find({});
        res.status(200).json({ questions });
    } catch (error) {
        console.error("Error fetching questions with answers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addQuestion = async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;

    if (!questionText || !options || !correctAnswer) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newQuestion = new QuizHuntersQuestion({
            questionText,
            options,
            correctAnswer
        });
        await newQuestion.save();
        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const editQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { questionText, options, correctAnswer } = req.body;

    if (!questionId || !questionText || !options || !correctAnswer) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedQuestion = await QuizHuntersQuestion.findByIdAndUpdate(
            questionId,
            { questionText, options, correctAnswer },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question updated successfully", question: updatedQuestion });
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteQuestion = async (req, res) => {
    const { questionId } = req.params;

    if (!questionId) {
        return res.status(400).json({ message: "Question ID is required" });
    }

    try {
        const question = await QuizHuntersQuestion.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        await QuizHuntersAnswer.deleteMany({ questionId });
        res.status(200).json({ message: "Question and associated answers deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAllQuestions = async (req, res) => {
    try {
        await QuizHuntersQuestion.deleteMany({});
        await QuizHuntersAnswer.deleteMany({});
        res.status(200).json({ message: "All questions and answers deleted successfully" });
    } catch (error) {
        console.error("Error deleting all questions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addQuestionsCSV = async (req, res) => {
    const csvFile = req.file;

    if (!csvFile) {
        return res.status(400).json({ message: "CSV file is required" });
    }

    try {
        const results = await parseCSVFile(csvFile, "quiz-hunters");
        await QuizHuntersQuestion.insertMany(results);
        res.status(200).json({ message: "Questions added successfully" });
    } catch (error) {
        console.error("Error adding questions from CSV:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const setTime = async (req, res) => {

};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const userId = req.user.id;

    const answerDocs = [];

    for (const { questionId, selectedAnswer } of answers) {
      // Check if this user already submitted an answer for this question
      const alreadyAnswered = await QuizHuntersAnswer.findOne({ questionId, userId });
      if (alreadyAnswered) continue;

      const question = await QuizHuntersQuestion.findById(questionId);
      if (!question) continue;

      const isCorrect = selectedAnswer === question.answer;

      answerDocs.push({
        questionId,
        userId,
        selectedAnswer,
        correctAnswer: question.answer,
        status: isCorrect ? "Correct" : "Incorrect"
      });
    }

    if (answerDocs.length === 0) {
      return res.status(400).json({ message: "All selected questions were already submitted." });
    }

    await QuizHuntersAnswer.insertMany(answerDocs);

    const correctCount = answerDocs.filter(a => a.status === "Correct").length;

    res.status(200).json({
      score: correctCount,
      total: answers.length,
      details: answerDocs
    });
  } catch (err) {
    console.error("Quiz submission failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};