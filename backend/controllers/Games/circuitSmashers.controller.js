import GameSlides from "../../models/GameSlides.js";
import StudentUpload from "../../models/StudentUpload.js";

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
        res.status(200).json({ message: "Resources retrieved successfully", resources });
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

export const setTime = async (req, res) => {};