import multer from "multer";
import path from "path";
import { getUploadPath } from "../config/localStorage.js";

// Factory function to create upload middleware for different types
const createUploadMiddleware = (options = {}) => {
  const {
    destination = 'general',
    allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'],
    maxFileSize = 5 * 1024 * 1024, // 5MB default
  } = options;

  // Configure multer for local storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = getUploadPath(destination);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // Generate unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  // File filter based on allowed mime types
  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed!`), false);
    }
  };

  return multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize
    }
  });
};

// Pre-configured upload middleware for avatars
const avatarUpload = createUploadMiddleware({
  destination: 'avatars',
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  maxFileSize: 5 * 1024 * 1024 // 5MB
});

// Pre-configured upload middleware for slides
const slidesUpload = createUploadMiddleware({
  destination: 'slides',
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain'],
  maxFileSize: 10 * 1024 * 1024 // 10MB
});

// Pre-configured upload middleware for documents
const CSVUpload = createUploadMiddleware({
  destination: 'csv',
  allowedMimeTypes: ['text/csv', 'application/vnd.ms-excel', 'application/csv'],
  maxFileSize: 5 * 1024 * 1024 // 5MB
});

// Pre-configured upload middleware for documents
const resourceUpload = createUploadMiddleware({
  destination: 'resources',
  allowedMimeTypes: ['application/zip', 'application/pdf'],
  maxFileSize: 10 * 1024 * 1024 // 10MB
});

// Pre-configured upload middleware for general files
const generalUpload = createUploadMiddleware({
  destination: 'general',
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFileSize: 10 * 1024 * 1024 // 10MB
});

export { createUploadMiddleware, avatarUpload, slidesUpload, generalUpload, CSVUpload, resourceUpload };