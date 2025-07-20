import BattleBreakersDashboard from "../../models/BattleBreakersDashboard.js";
import BattleBreakersQuestion from "../../models/Questions/BattleBreakersQuestion.js";
import { parseCSVFile } from "../../utils/csvParser.js";

export const buzzerPress = async (req, res) => {
    try {
        const { questionId } = req.body;
        const schoolId = req.user.id;

        // Validate input
        if (!questionId || !schoolId) {
            return res.status(400).json({ message: "questionId and schoolId are required" });
        }

        const pressTime = Date.now();

        // Find existing record for the question
        let record = await BattleBreakersDashboard.findOne({ questionId });
        if (record) {
            const alreadyPressed = record.schools.some(s => s.schoolId.toString() === schoolId.toString());

            if (alreadyPressed) {
                return res.status(200).json({ message: "This school has already pressed the buzzer for this question." });
            }

            record.schools.push({ schoolId, time: pressTime });
            await record.save();
        } else {
            // First buzzer press for this question
            record = await BattleBreakersDashboard.create({
                questionId,
                schools: [{ schoolId, time: pressTime }],
            });
        }

        const io = req.app.get("io");
        io.to("scoreboard").emit("buzzerPress", {
            _id: req.user.id,
            name: req.user.name,
            city: req.user.city,
            logo: req.user.avatar.url,
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
            .populate('questionId', 'questionText') // Assuming questionText is a field in BattleBreakersQuestion
            .populate('schools.schoolId', 'name'); // Assuming name is a field in School model

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
        res.status(200).json({ message: "Questions added successfully" });
    } catch (error) {
        console.error("Error adding questions:", error);
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
        await BattleBreakersQuestion.insertMany(results);
        res.status(200).json({ message: "Questions added successfully" });
    } catch (error) {
        console.error("Error adding questions from CSV:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}