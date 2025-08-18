import archiver from "archiver";
import path from "path";
import fs from "fs";
import GameSlides from "../../models/GameSlides.js";
import StudentUpload from "../../models/StudentUpload.js";
import Criteria from "../../models/Criteria.js";
import CircuitSmashersMarking from "../../models/markings/CircuitSmashersMarking.js";
import Game from "../../models/Game.js";

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
        // Check for existing resource for this user and game
        const existingResource = await StudentUpload.findOne({ userId: req.user.id, gameName: "circuitSmashers" });
        if (existingResource) {
            // Delete the old file from disk if it exists
            const oldFilePath = path.join(process.cwd(), existingResource.fileUrl);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            // Remove the old resource entry from DB
            await StudentUpload.deleteOne({ _id: existingResource._id });
        }

        const resourcePath = `/uploads/resources/${file.filename}`;
        await StudentUpload.create({ 
            userId: req.user.id,
            gameName: "circuitSmashers",
            fileUrl: resourcePath,
            originalName: file.filename
        });
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

        // Get the file path from the resource
        const filePath = path.join(process.cwd(), resource.fileUrl);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found on server" });
        }

        // Get the original filename from the database or extract from path
        const originalName = resource.originalName || path.basename(filePath);
        
        // Detect MIME type
        const mimeType = mime.getType(filePath) || "application/octet-stream";
        console.log("Downloading:", originalName, "MIME:", mimeType);

        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        
        // Send the file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error downloading file:", err);
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error downloading file" });
                }
            }
        });
        
    } catch (error) {
        console.error("Error retrieving resource:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getFormattedCircuitSmashersMarkings = async (req, res) => {
  try {
    const rawMarkings = await CircuitSmashersMarking.find()
      .populate("schoolId", "name nameInShort")
      .populate("judgeId", "name");

    const formatted = {};

    rawMarkings.forEach((entry) => {
      const judgeName = entry.judgeId?.name || "Unknown Judge";
      const schoolName = entry.schoolId?.nameInShort || "Unknown Team";
      const marksArray = entry.marks.map((m) => m.mark);
      marksArray.push(entry.totalMarks);

      if (!formatted[judgeName]) {
        formatted[judgeName] = {};
      }

      formatted[judgeName][schoolName] = marksArray;
    });

    // Calculate overall averages
    const overallData = {};
    const schoolNames = new Set();
    
    // Collect all school names
    Object.values(formatted).forEach(judgeData => {
      Object.keys(judgeData).forEach(schoolName => {
        schoolNames.add(schoolName);
      });
    });

    // Calculate averages for each school
    schoolNames.forEach(schoolName => {
      const allMarksForSchool = [];
      const judgeCount = Object.keys(formatted).length;
      
      // Get marks from all judges for this school
      Object.values(formatted).forEach(judgeData => {
        if (judgeData[schoolName]) {
          allMarksForSchool.push(judgeData[schoolName]);
        }
      });

      if (allMarksForSchool.length > 0) {
        // Calculate average for each criterion
        const criteriaCount = allMarksForSchool[0].length - 1; // Exclude total
        const averages = [];
        
        for (let i = 0; i < criteriaCount; i++) {
          const sum = allMarksForSchool.reduce((acc, marks) => acc + marks[i], 0);
          averages.push(Math.round(sum / allMarksForSchool.length));
        }
        
        // Calculate total average
        const totalSum = averages.reduce((acc, mark) => acc + mark, 0);
        averages.push(totalSum);
        
        overallData[schoolName] = averages;
      }
    });

    // Add overall data to formatted response
    if (Object.keys(overallData).length > 0) {
      formatted["Overall"] = overallData;
    }

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching markings:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const setTime = async (req, res) => {
    const { time } = req.body;

    if (!time || time <= 0) {
        return res.status(400).json({ message: "Valid time is required" });
    }

    try {
        // Update the allocated time for the Circuit Smashers game
        const updatedGame = await Game.findOneAndUpdate(
            { name: "Circuit Smashers" },
            { allocateTime: parseInt(time) },
            { new: true, upsert: false }
        );

        if (!updatedGame) {
            return res.status(404).json({ message: "Circuit Smashers game not found" });
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
        const game = await Game.findOne({ name: "Circuit Smashers" });

        if (!game) {
            return res.status(404).json({ message: "Circuit Smashers game not found" });
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

export const getResourceCount = async (req, res) => {
    try {
        const uniqueStudents = await StudentUpload.distinct("userId", { gameName: "circuitSmashers" });
        const count = uniqueStudents.length;
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching resource count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};