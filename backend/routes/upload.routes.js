import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { slidesUpload, createUploadMiddleware } from "../middleware/uploadMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Example: Upload game slides
router.post("/upload-slides", protect, requireAdmin, slidesUpload.single('slide'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // File information
    const fileData = {
      url: `/uploads/slides/${req.file.filename}`,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.status(200).json({
      message: "Slide uploaded successfully",
      file: fileData
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading slide", error: error.message });
  }
});

// Example: Upload multiple slides
router.post("/upload-multiple-slides", protect, requireAdmin, slidesUpload.array('slides', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedFiles = req.files.map(file => ({
      url: `/uploads/slides/${file.filename}`,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      message: "Slides uploaded successfully",
      files: uploadedFiles,
      count: uploadedFiles.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading slides", error: error.message });
  }
});

// Example: Create custom upload for different file types
const documentUpload = createUploadMiddleware({
  destination: 'documents',
  allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFileSize: 20 * 1024 * 1024 // 20MB
});

router.post("/upload-document", protect, requireAdmin, documentUpload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No document uploaded" });
    }

    const fileData = {
      url: `/uploads/documents/${req.file.filename}`,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    };

    res.status(200).json({
      message: "Document uploaded successfully",
      file: fileData
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading document", error: error.message });
  }
});

export default router;
