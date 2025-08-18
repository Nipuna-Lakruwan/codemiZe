import BattleBreakersDashboard from "../../models/BattleBreakersDashboard.js";
import BattleBreakersAnswer from "../../models/markings/BattleBreakersAnswer.js";
import BattleBreakersQuestion from "../../models/questions/BattleBreakersQuestion.js";
import School from "../../models/School.js";
import Game from "../../models/Game.js";
import { parseCSVFile } from "../../utils/csvParser.js";
import battleBreakersHandler from "../../sockets/games/battleBreakers.js";

export const buzzerPress = async (req, res) => {
    try {
        const { questionId, responseTime } = req.body;
        const schoolId = req.user.id;

        // Validate input
        if (!questionId || !schoolId) {
            return res.status(400).json({ message: "questionId and schoolId are required" });
        }

        // Find existing record for the question
        let record = await BattleBreakersDashboard.findOne({ questionId });
        if (record) {
            const alreadyPressed = record.schools.some(s => s.schoolId.toString() === schoolId.toString());

            if (alreadyPressed) {
                return res.status(200).json({ message: "This school has already pressed the buzzer for this question." });
            }

            record.schools.push({ schoolId, time: responseTime });
            await record.save();
        } else {
            // First buzzer press for this question
            record = await BattleBreakersDashboard.create({
                questionId,
                schools: [{ schoolId, time: responseTime }],
            });
        }

        const io = req.app.get("io");
        io.to("scoreboard").emit("buzzerPress", {
            _id: req.user.id,
            name: req.user.name,
            city: req.user.city,
            logo: req.user.avatar.url,
            responseTime: responseTime,
            timestamp: Date.now(),
        });

        res.status(200).json({ message: 'Buzzer press recorded' });
    } catch (error) {
        console.error("Error recording buzzer press:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDashboard = async (req, res) => {
    const { questionId } = req.params;

    try {
        const dashboardData = await BattleBreakersDashboard.find({ questionId })
            .populate('questionId', 'questionText')
            .populate('schools.schoolId', 'name');

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getQuestions = async (req, res) => {
    try {
        const questions = await BattleBreakersQuestion.find();
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addQuestion = async (req, res) => {
    const { question, answer } = req.body;

    if (!question || !answer) {
        return res.status(400).json({ message: "Question and answer are required" });
    }

    try {
        const createdQuestions = await BattleBreakersQuestion.create({ question, answer });
        res.status(200).json({ message: "Questions added successfully", createdQuestions });
    } catch (error) {
        console.error("Error adding questions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editQuestion = async (req, res) => {
    const { questionId } = req.params;
    const { question, answer } = req.body;

    if (!questionId || !question || !answer) {
        return res.status(400).json({ message: "Question ID, question text, and answer are required" });
    }

    try {
        const updatedQuestion = await BattleBreakersQuestion.findByIdAndUpdate(
            questionId,
            { question, answer },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question updated successfully", updatedQuestion });
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteQuestion = async (req, res) => {
    const { questionId } = req.params;

    if (!questionId) {
        return res.status(400).json({ message: "Question ID is required" });
    }

    try {
        const deletedQuestion = await BattleBreakersQuestion.findByIdAndDelete(questionId);
        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteAllQuestions = async (req, res) => {
    try {
        await BattleBreakersQuestion.deleteMany({});
        res.status(200).json({ message: "All questions deleted successfully" });
    } catch (error) {
        console.error("Error deleting all questions:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addQuestionsCSV = async (req, res) => {
    const csvFile = req.file;

    if (!csvFile) {
        return res.status(400).json({ message: "CSV file is required" });
    }

    try {
        const results = await parseCSVFile(csvFile, "battle-breakers");
        const questions = await BattleBreakersQuestion.insertMany(results);
        res.status(200).json({ message: "Questions added successfully", data: questions });
    } catch (error) {
        console.error("Error adding questions from CSV:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAnswers = async (req, res) => {
    try {
        // First, get answers without populate to see raw data
        const rawAnswers = await BattleBreakersAnswer.find({});
        
        // Then get answers with populate
        const answers = await BattleBreakersAnswer.find({})
            .populate('questionId', 'question answer')
            .populate('responses.userId', 'name nameInShort');
        
        // More lenient filtering - only remove if both questionId and all responses are invalid
        const validAnswers = answers.filter(answer => {
            if (!answer.questionId) {
                // Keep the document but with raw questionId
                const rawAnswer = rawAnswers.find(raw => raw._id.toString() === answer._id.toString());
                if (rawAnswer) {
                    answer.questionId = { _id: rawAnswer.questionId, question: 'Question not found', answer: 'Answer not found' };
                }
            }
            
            // Filter out responses with null userId but keep the document if some responses are valid
            const validResponses = answer.responses.filter(response => {
                if (!response.userId) {
                    // Find the raw response and use the raw userId
                    const rawAnswer = rawAnswers.find(raw => raw._id.toString() === answer._id.toString());
                    if (rawAnswer) {
                        const rawResponse = rawAnswer.responses.find(r => 
                            r._id.toString() === response._id.toString()
                        );
                        if (rawResponse) {
                            response.userId = { 
                                _id: rawResponse.userId, 
                                name: 'User not found',
                                nameInShort: 'N/A'
                            };
                            return true;
                        }
                    }
                    return false;
                }
                return true;
            });
            
            answer.responses = validResponses;
            
            // Only remove the document if it has no valid responses at all
            return answer.responses.length > 0;
        });
        
        res.status(200).json(validAnswers);
    } catch (error) {
        console.error("Error fetching answers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const submitAnswers = async (req, res) => {
    const { questionId, submissions } = req.body;

    // Validate required fields
    if (!questionId || !submissions || !Array.isArray(submissions) || submissions.length === 0 || submissions.length > 2) {
        return res.status(400).json({ 
            message: "questionId and submissions array (containing 1 or 2 schools) are required" 
        });
    }

    // Validate each submission has the required fields
    for (const submission of submissions) {
        if (!submission.userId || submission.attempt === undefined || !submission.status) {
            return res.status(400).json({
                message: "Each submission must contain userId, attempt, and status"
            });
        }
        
        // Convert attempt to number if it's a string, and validate it's a valid number
        if (typeof submission.attempt === 'string') {
            submission.attempt = parseInt(submission.attempt, 10);
        }
        
        if (typeof submission.attempt !== 'number' || isNaN(submission.attempt) || submission.attempt < 1) {
            return res.status(400).json({
                message: "The attempt field must be a valid positive number"
            });
        }
    }

    try {
        // Find or create an answer document for this question
        let answerDoc = await BattleBreakersAnswer.findOne({ questionId });

        if (!answerDoc) {
            // Create a new answer document if none exists
            const responses = submissions.map(sub => ({
                userId: sub.userId,
                attempt: Number(sub.attempt), // Ensure it's stored as a number
                status: sub.status
            }));
            
            answerDoc = new BattleBreakersAnswer({ 
                questionId, 
                responses
            });
        } else {
            // Add the new responses to existing document
            for (const submission of submissions) {
                answerDoc.responses.push({
                    userId: submission.userId,
                    attempt: Number(submission.attempt), // Ensure it's stored as a number
                    status: submission.status
                });
            }
        }
        
        await answerDoc.save();
        
        // Process and update scores for each school's submission
        const scoreUpdates = [];
        
        for (const submission of submissions) {
            const { userId, attempt, status } = submission;
            
            // Calculate score based on attempt number and status
            let score = 0;
            
            if (attempt === 1) {
                // First attempt (global attempt 1)
                if (status === "Correct") {
                    score = 10; // First attempt correct: +10 points
                } else {
                    score = -5; // First attempt wrong: -5 points
                }
            } else if (attempt === 2) {
                // Second attempt (global attempt 2)
                if (status === "Correct") {
                    score = 5; // Second attempt correct: +5 points
                } else {
                    score = 0; // Second attempt wrong: no points (no additional penalty)
                }
            }

            // Update the BattleBreakers score for this specific school
            await School.findByIdAndUpdate(userId, {
                $inc: { "score.BattleBreakers": score }
            });
            
            scoreUpdates.push({
                userId,
                attempt,
                status,
                scoreUpdated: score
            });
        }

        const io = req.app.get("io");
        if (io) {
            io.to("judge").emit("battlebreakersNewMarks");
        }
        
        res.status(200).json({ 
            message: "Answers submitted and scores updated successfully",
            data: answerDoc,
            scoreUpdates
        });
    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const finishGame = async (req, res) => {
    try {
        // Stop the Battle Breakers timer
        battleBreakersHandler.stopTimer();
        
        // Get the io instance and emit game completed
        const io = req.app.get("io");
        io.to("battleBreakers").emit("battleBreakers-gameCompleted", {
            message: "Game has ended"
        });
        
        // Update the BattleBreakers game status to completed
        const updatedGame = await Game.findOneAndUpdate(
            { name: "Battle Breakers" },
            { status: "completed" },
            { new: true }
        );

        res.status(200).json({ 
            message: "Game finished successfully",
            gameUpdated: !!updatedGame 
        });
    } catch (error) {
        console.error("Error finishing game:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTime = async (req, res) => {
    try {
        // Find the Battle Breakers game and get its allocated time
        const battleBreakersGame = await Game.findOne({ name: "Battle Breakers" });
        
        if (!battleBreakersGame) {
            return res.status(404).json({ message: "Battle Breakers game not found" });
        }
        
        res.status(200).json({
            allocatedTime: battleBreakersGame.allocateTime,
            gameStatus: battleBreakersGame.status
        });
    } catch (error) {
        console.error("Error fetching allocated time:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};