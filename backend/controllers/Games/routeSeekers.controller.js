import RouteSeekersQuestion from "../../models/questions/RouteSeekersQuestion.js";
import RouteSeekersAnswer from "../../models/markings/RouteSeekersAnswer.js";
import StudentUpload from "../../models/StudentUpload.js";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const userId = req.user.id;
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

    const correctAnswersCount = answers.filter(answer => answer.isCorrect).length;
    const score = correctAnswersCount * 5;

    const updatedAnswer = await RouteSeekersAnswer.findByIdAndUpdate(
      id,
      { Answers: answers, score: score },
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

// Delete all student answers
export const deleteAllStudentAnswers = async (req, res) => {
  try {
    await RouteSeekersAnswer.deleteMany({});
    res.status(200).json({ message: "All student answers deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a single answer's status
export const updateAnswerStatus = async (req, res) => {
  try {
    const { submissionId, questionId } = req.params;
    const { status } = req.body;

    if (!status || !['correct', 'incorrect'].includes(status)) {
      return res.status(400).json({ message: "Valid status ('correct' or 'incorrect') is required" });
    }

    const submission = await RouteSeekersAnswer.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: "Answer document not found" });
    }

    let answerUpdated = false;
    submission.Answers.forEach(answer => {
      if (answer.questionId.toString() === questionId) {
        answer.status = status;
        answerUpdated = true;
      }
    });

    if (!answerUpdated) {
        return res.status(404).json({ message: "Question answer not found in this submission" });
    }

    const correctAnswersCount = submission.Answers.filter(
      (answer) => answer.status === 'correct'
    ).length;
    submission.score = correctAnswersCount * 5;

    const savedSubmission = await submission.save();

    res.status(200).json({ message: "Answer status updated successfully", result: savedSubmission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadNetworkDesign = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const newUpload = new StudentUpload({
            userId: req.user.id,
            gameName: "RouteSeekers",
            fileUrl: req.file.path,
            originalName: req.file.originalname,
        });

        await newUpload.save();

        res.status(201).json({
            message: "File uploaded successfully",
            file: newUpload,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllNetworkDesigns = async (req, res) => {
    try {
        const networkDesigns = await StudentUpload.find({ gameName: "RouteSeekers" });
        res.status(200).json(networkDesigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNetworkDesign = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await StudentUpload.findById(id);

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        fs.unlink(file.fileUrl, async (err) => {
            if (err) {
                console.error("File deletion error:", err);
                return res.status(500).json({ message: "Error deleting the file" });
            }

            await StudentUpload.findByIdAndDelete(id);
            res.status(200).json({ message: "File deleted successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const downloadAllNetworkDesigns = async (req, res) => {
    try {
        const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'resources', 'routeSeekersNetworkDesign');
        const zipFileName = 'routeSeekersNetworkDesigns.zip';
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level.
        });

        res.attachment(zipFileName);
        archive.pipe(res);

        archive.directory(uploadDir, false);

        await archive.finalize();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
