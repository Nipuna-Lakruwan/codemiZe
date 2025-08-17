import QuizHuntersQuestion from "../../models/questions/QuizHuntersQuestion.js";
import QuizHuntersAnswer from "../../models/markings/QuizHuntersAnswer.js";
import School from "../../models/School.js";
import Game from "../../models/Game.js";
import { parseCSVFile } from "../../utils/csvParser.js";

export const getAllQuestions = async (req, res) => {
    try {
        const questions = await QuizHuntersQuestion.find({}).sort({ createdAt: 1 });

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
    const { question, option1, option2, option3, answer } = req.body;

    if (!question || !option1 || !option2 || !option3 || !answer) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newQuestion = new QuizHuntersQuestion({
            question,
            option1,
            option2,
            option3,
            answer
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
    const { question, option1, option2, option3, answer } = req.body;

    if (!questionId || !question || !option1 || !option2 || !option3 || !answer) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedQuestion = await QuizHuntersQuestion.findByIdAndUpdate(
            questionId,
            { question, option1, option2, option3, answer },
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

export const submitQuiz = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!questionId || !selectedAnswer) {
      return res.status(400).json({ message: "Question ID and selected answer are required" });
    }

    // Check if this user already submitted an answer for this question
    const alreadyAnswered = await QuizHuntersAnswer.findOne({ questionId, userId });
    if (alreadyAnswered) {
      return res.status(400).json({ message: "Answer for this question has already been submitted" });
    }

    // Find the question to validate and get correct answer
    const question = await QuizHuntersQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Check if answer is correct
    const isCorrect = selectedAnswer === question.answer;

    // Create the answer document
    const answerDoc = {
      questionId,
      userId,
      selectedAnswer,
      correctAnswer: question.answer,
      status: isCorrect ? "Correct" : "Incorrect"
    };

    // Save the answer
    await QuizHuntersAnswer.create(answerDoc);

    res.status(200).json({ message: "Answer submitted successfully" });
  } catch (err) {
    console.error("Quiz submission failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const calculateAndUpdateScore = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the school
    const school = await School.findById(userId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Get all answers for this user
    const userAnswers = await QuizHuntersAnswer.find({ userId });
    
    if (userAnswers.length === 0) {
      return res.status(400).json({ message: "No answers found for this user" });
    }

    // Calculate score
    const correctAnswers = userAnswers.filter(answer => answer.status === "Correct").length;
    const finalScore = correctAnswers * 4;

    // Prevent overwriting if a score already exists
    if (school.score.QuizHunters > 0) {
      return res.status(200).json({
        message: "Score for QuizHunters already exists and cannot be overwritten.",
        currentScore: school.score.QuizHunters
      });
    }

    // Update school score
    school.score.QuizHunters = finalScore;
    await school.save();

    const data = { id: school.id, score: finalScore, avatarUrl: school.avatar.url, name: school.name, city: school.city };

    const io = req.app.get("io");
    io.to("judge").emit("quizhunters completed", data);

    res.status(200).json({
      message: "Score calculated and updated successfully",
      score: finalScore,
      percentage: `${finalScore.toFixed(2)}%`
    });
  } catch (err) {
    console.error("Score calculation failed:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkCurrentQuestion = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all questions in order (by creation time)
    const allQuestions = await QuizHuntersQuestion.find({}).sort({ createdAt: 1 });
    
    if (allQuestions.length === 0) {
      return res.status(404).json({ message: "No questions available" });
    }

    // Find the last recorded answer for this user
    const lastAnswer = await QuizHuntersAnswer.findOne({ userId }).sort({ createdAt: -1 });

    let nextQuestion;

    if (!lastAnswer) {
      // No answers recorded yet, return the first question
      nextQuestion = allQuestions[0];
    } else {
      // Find the index of the last answered question
      const lastQuestionIndex = allQuestions.findIndex(q => q._id.toString() === lastAnswer.questionId.toString());
      
      if (lastQuestionIndex === -1) {
        // Last answered question not found in current questions, return first question
        nextQuestion = allQuestions[0];
      } else if (lastQuestionIndex + 1 >= allQuestions.length) {
        // All questions have been answered
        return res.status(200).json({ 
          message: "All questions have been completed",
          completed: true,
          totalQuestions: allQuestions.length
        });
      } else {
        // Return the next question
        nextQuestion = allQuestions[lastQuestionIndex + 1];
      }
    }

    // Format the question (shuffle options)
    const options = [nextQuestion.answer, nextQuestion.option1, nextQuestion.option2, nextQuestion.option3];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    const formattedQuestion = {
      _id: nextQuestion._id,
      question: nextQuestion.question,
      options: shuffledOptions,
    };

    res.status(200).json({ 
      message: "Next question retrieved successfully", 
      question: formattedQuestion,
      questionNumber: allQuestions.findIndex(q => q._id.toString() === nextQuestion._id.toString()) + 1,
      totalQuestions: allQuestions.length
    });
  } catch (err) {
    console.error("Error checking current question:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const setTime = async (req, res) => {
    const { time } = req.body;

    if (!time || time <= 0) {
        return res.status(400).json({ message: "Valid time is required" });
    }

    try {
        // Update the allocated time for the Quiz Hunters game
        const updatedGame = await Game.findOneAndUpdate(
            { name: "Quiz Hunters" },
            { allocateTime: parseInt(time) },
            { new: true, upsert: false }
        );

        if (!updatedGame) {
            return res.status(404).json({ message: "Quiz Hunters game not found" });
        }

        res.status(200).json({ 
            message: "Time allocated successfully", 
            game: updatedGame 
        });
    } catch (error) {
        console.error("Error setting allocated time:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTime = async (req, res) => {
    try {
        const game = await Game.findOne({ name: "Quiz Hunters" });

        if (!game) {
            return res.status(404).json({ message: "Quiz Hunters game not found" });
        }

        res.status(200).json({ 
            message: "Allocated time retrieved successfully",
            allocateTime: game.allocateTime
        });
    } catch (error) {
        console.error("Error retrieving allocated time:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};