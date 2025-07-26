import archiver from "archiver";
import path from "path";
import fs from "fs";
import GameSlides from "../../models/GameSlides.js";
import StudentUpload from "../../models/StudentUpload.js";
import Criteria from "../../models/Criteria.js";
import CircuitSmashersMarking from "../../models/markings/CircuitSmashersMarking.js";

export const uploadSlides = async (req, res) => {
    const slides = req.files;

    if (!slides || slides.length === 0) {
        return res.status(400).json({ message: "No slides uploaded" });
    }

    try {
        const slidePaths = slides.map(slide => `/uploads/slides/${slide.filename}`);
        await GameSlides.create({ slides: slidePaths, gameType: "circuitSmashers" });

        res.status(200).json({ message: "Slides uploaded successfully", slidePaths });
    } catch (error) {
        console.error("Error uploading slides:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCriteria = async (req, res) => {
    try {
        const criteria = await Criteria.find({ gameType: "circuitSmashers" });
        res.status(200).json({ message: "Criteria retrieved successfully", criteria });
    } catch (error) {
        console.error("Error retrieving criteria:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getSlides = async (req, res) => {
    try {
        const slides = await GameSlides.find({ gameType: "circuitSmashers" });
        res.status(200).json({ message: "Slides retrieved successfully", slides });
    } catch (error) {
        console.error("Error retrieving slides:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteAllSlides = async (req, res) => {
    try {
        await GameSlides.deleteMany({ gameType: "circuitSmashers" });
        res.status(200).json({ message: "All slides deleted successfully" });
    } catch (error) {
        console.error("Error deleting slides:", error);
        res.status(500).json({ message: "Internal Server Error" });
    } 
};

export const uploadResource = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const resourcePath = `/uploads/resources/${file.filename}`;
        await StudentUpload.create({ userId: req.user.id, gameName: "circuitSmashers", fileUrl: resourcePath });
        res.status(200).json({ message: "Resource uploaded successfully", resourcePath });
    } catch (error) {
        console.error("Error uploading resource:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllResources = async (req, res) => {
    try {
        const resources = await StudentUpload.find({ gameName: "circuitSmashers" });
        if (!resources.length) {
            return res.status(404).json({ message: "No resources found" });
        }

         // Set headers for zip download
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=circuitSmashers-resources.zip");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res); // Pipe archive stream to the response

        for (const resource of resources) {
            const fileName = path.basename(resource.fileUrl);
            const filePath = path.join(process.cwd(), "uploads", "resources", fileName);

            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: fileName });
            }
        }

        archive.finalize(); // Close and send the zip
    } catch (error) {
        console.error("Error retrieving resources:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getResource = async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await StudentUpload.findOne({ userId: id, gameName: "circuitSmashers" });
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json({ message: "Resource retrieved successfully", resource });
        //res.download(resource);
    } catch (error) {
        console.error("Error retrieving resource:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFormattedCircuitSmashersMarkings = async (req, res) => {
  try {
    const rawMarkings = await CircuitSmashersMarking.find()
      .populate("schoolId", "name")
      .populate("judgeId", "name");

    const formatted = {};

    rawMarkings.forEach((entry) => {
      const judgeName = entry.judgeId?.name || "Unknown Judge";
      const schoolName = entry.schoolId?.name || "Unknown Team";
      const marksArray = entry.marks.map((m) => m.mark);
      marksArray.push(entry.totalMarks);

      if (!formatted[judgeName]) {
        formatted[judgeName] = {};
      }

      formatted[judgeName][schoolName] = marksArray;
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching markings:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const setTime = async (req, res) => {};