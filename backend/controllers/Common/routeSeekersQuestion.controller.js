import RouteSeekersQuestion from "../../models/questions/RouteSeekersQuestion.js";
import ResourceFile from "../../models/ResourceFile.js";
import { parseCSVFile } from "../../utils/csvParser.js";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add questions from CSV
export const addRouteSeekersQuestionsFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const questions = await parseCSVFile(req.file, "route-seekers");
    if (!questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "No questions found in the CSV file" });
    }

    const newQuestions = await RouteSeekersQuestion.insertMany(questions);
    res.status(201).json(newQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new question
export const addRouteSeekersQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newQuestion = new RouteSeekersQuestion({ question, answer });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all questions
export const getAllRouteSeekersQuestions = async (req, res) => {
  try {
    const questions = await RouteSeekersQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single question by ID
export const getRouteSeekersQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await RouteSeekersQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a question
export const updateRouteSeekersQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const updatedQuestion = await RouteSeekersQuestion.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a question
export const deleteRouteSeekersQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await RouteSeekersQuestion.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete many questions
export const deleteManyRouteSeekersQuestions = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "An array of question IDs is required" });
    }

    const result = await RouteSeekersQuestion.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No questions found with the provided IDs" });
    }

    res.status(200).json({ message: `${result.deletedCount} questions deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all questions
export const deleteAllRouteSeekersQuestions = async (req, res) => {
  try {
    await RouteSeekersQuestion.deleteMany({});
    res.status(200).json({ message: "All questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload a resource file
export const uploadQuestionnaireResourceFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const existingFile = await ResourceFile.findOne({ gameName: { $exists: false } });
    if (existingFile) {
        return res.status(400).json({ message: "A questionnaire resource file already exists. Please delete the existing file before uploading a new one." });
    }

    // Assuming the file is uploaded to the 'resources' directory
    const resourceFile = new ResourceFile({
      file: req.file.filename, // Save the filename
      originalname: req.file.originalname,
    });

    await resourceFile.save();

    res.status(201).json({
      message: "Resource file uploaded successfully",
      file: resourceFile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download a resource file
export const downloadQuestionnaireResourceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceFile = await ResourceFile.findById(id);

    if (!resourceFile) {
      return res.status(404).json({ message: "Resource file not found" });
    }

    const filePath = path.join(__dirname, `../../uploads/resources/${resourceFile.file}`);
    res.download(filePath, resourceFile.file, (err) => {
      if (err) {
        console.error("File download error:", err);
        res.status(500).json({ message: "Error downloading the file" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all uploaded resource files
export const getAllUploadedQuestionnaireResourceFiles = async (req, res) => {
  try {
    // Filter for files that have a .zip extension, case-insensitive
    const resourceFiles = await ResourceFile.find({
      file: { $regex: "\\.zip$", $options: "i" },
    });
    res.status(200).json(resourceFiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a resource file
export const deleteQuestionnaireResourceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const resourceFile = await ResourceFile.findById(id);

    if (!resourceFile) {
      return res.status(404).json({ message: "Resource file not found" });
    }

    const filePath = path.join(__dirname, `../../uploads/resources/${resourceFile.file}`);
    
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("File deletion error:", err);
        return res.status(500).json({ message: "Error deleting the file" });
      }

      await ResourceFile.findByIdAndDelete(id);
      res.status(200).json({ message: "Resource file deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload network design PDF
export const uploadNetworkDesignPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "No file uploaded." });
        }

        const existingFile = await ResourceFile.findOne({
            gameName: "RouteSeekers",
            fileType: "NetworkDesign",
        });

        if (existingFile) {
            return res.status(400).send({ message: "A network design PDF already exists. Please delete the existing file before uploading a new one." });
        }

        const newFile = new ResourceFile({
            gameName: "RouteSeekers",
            fileType: "NetworkDesign",
            path: req.file.path,
            filename: req.file.filename,
            originalname: req.file.originalname,
        });

        await newFile.save();
        res.status(201).send(newFile);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get all network design PDFs
export const getAllNetworkDesignPDFs = async (req, res) => {
    try {
        const files = await ResourceFile.find({
            gameName: "RouteSeekers",
            fileType: "NetworkDesign",
        });
        if (!files || files.length === 0) {
            return res.status(404).send({ message: "No files found." });
        }
        res.status(200).send(files);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get network design PDF by ID
export const getNetworkDesignPDFById = async (req, res) => {
    try {
        const file = await ResourceFile.findById(req.params.id);
        if (!file) {
            return res.status(404).send({ message: "File not found." });
        }
        res.status(200).send(file);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete network design PDF
export const deleteNetworkDesignPDF = async (req, res) => {
    try {
        const file = await ResourceFile.findById(req.params.id);

        if (!file) {
            return res.status(404).send({ message: "File not found." });
        }

        const filePath = path.join(__dirname, "../..", file.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await ResourceFile.findByIdAndDelete(file._id);

        res.status(200).send({ message: "File deleted successfully." });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
