import BattleBreakersDashboard from "../../models/BattleBreakersDashboard.js";
import BattleBreakersAnswer from "../../models/markings/BattleBreakersAnswer.js";
import BattleBreakersQuestion from "../../models/Questions/BattleBreakersQuestion.js";
import School from "../../models/School.js";
import { parseCSVFile } from "../../utils/csvParser.js";

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
        
        // Ensure attempt is a number
        if (typeof submission.attempt !== 'number') {
            return res.status(400).json({
                message: "The attempt field must be a numerical value"
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
                attempt: sub.attempt,
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
                    attempt: submission.attempt,
                    status: submission.status
                });
            }
        }
        
        await answerDoc.save();
        
        // Process and update scores for all submitted schools
        const scoreUpdates = [];
        
        for (const submission of submissions) {
            const userId = submission.userId;
            
            // Get all responses for this user and question
            const userResponses = answerDoc.responses.filter(
                r => r.userId.toString() === userId.toString()
            );

            // Calculate score based on response pattern
            let score = 0;
            if (userResponses.length >= 1) {
                if (userResponses[0].status === "Correct") {
                    score = 10;
                } else {
                    score = -5;
                    if (userResponses.length > 1 && userResponses[1].status === "Correct") {
                        score += 5;
                    }
                }
            }

            // Update the BattleBreakers score for the school
            await School.findByIdAndUpdate(userId, {
                $inc: { "score.BattleBreakers": score }
            });
            
            scoreUpdates.push({
                userId,
                scoreUpdated: score
            });
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