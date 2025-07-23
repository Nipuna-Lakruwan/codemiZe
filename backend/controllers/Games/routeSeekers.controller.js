import RouteSeekersAnswer from '../../models/RouteSeekersAnswer.js';
import RouteSeekersQuestion from '../../models/RouteSeekersQuestion.js';
import RouteSeekersMarking from '../../models/RouteSeekersMarking.js';

export const uploadQuestions = async (req, res) => {
    const { questions } = req.body;
    try {
        const createdQuestions = await RouteSeekersQuestion.insertMany(questions);
        res.status(201).json(createdQuestions);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading questions', error });
    }
};

export const getQuestions = async (req, res) => {
    try {
        const questions = await RouteSeekersQuestion.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
};

export const submitAnswers = async (req, res) => {
    const { answers } = req.body;
    try {
        const submittedAnswers = await RouteSeekersAnswer.insertMany(answers);
        res.status(201).json(submittedAnswers);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting answers', error });
    }
};

export const getAnswers = async (req, res) => {
    try {
        const answers = await RouteSeekersAnswer.find().populate('userId').populate('Answers.questionId');
        res.status(200).json(answers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching answers', error });
    }
};

export const checkAnswers = async (req, res) => {};

export const deleteQuestions = async (req, res) => {};

// By Admin
export const uploadResourceFiles = async (req, res) => {};

export const getResourceFiles = async (req, res) => {};

export const deleteResourceFile = async (req, res) => {};

// By Student
export const uploadDiagramFiles = async (req, res) => {};

export const getDiagramFiles = async (req, res) => {};

export const getDiagramFile = async (req, res) => {};