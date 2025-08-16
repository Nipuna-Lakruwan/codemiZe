import multer from "multer";
import path from "path";
import { getUploadPath } from "../config/localStorage.js";

// Factory function to create upload middleware for different types
const createUploadMiddleware = (options = {}) => {
  const {
    destination = 'general',
    allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'],
    allowedExtensions = [], // New option for file extensions
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
      if (destination === 'resources') {
        cb(null, req.user.name + path.extname(file.originalname));
      } else {
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }
  });

  // Enhanced file filter based on mime types and file extensions
  const fileFilter = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Check both MIME type and file extension
    const isMimeTypeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtensionAllowed = allowedExtensions.length === 0 || allowedExtensions.includes(fileExtension);
    
    if (isMimeTypeAllowed || isExtensionAllowed) {
      cb(null, true);
    } else {
      const allowedFormats = [...allowedMimeTypes, ...allowedExtensions].join(', ');
      cb(new Error(`Only ${allowedFormats} files are allowed!`), false);
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
  allowedMimeTypes: [
    'application/zip', 
    'application/pdf',
    'text/x-python',        // Python files (.py)
    'text/plain',           // Arduino files (.ino) and text files
    'text/x-c',
    'text/x-c++',
    'application/octet-stream', // Arduino files (.ino) and Packet Tracer files (.pkt)
    'application/x-packet-tracer' // Packet Tracer files (.pkt) - specific MIME type
  ],
  allowedExtensions: [
    '.py',      // Python files
    '.ino',     // Arduino sketch files
    '.pkt',     // Cisco Packet Tracer files
    '.c',       // C source files
    '.cpp',     // C++ source files
    '.h',       // Header files
    '.js',      // JavaScript files
    '.txt',     // Text files
    '.zip'      // Zip archives for multiple files
  ],
  maxFileSize: 50 * 1024 * 1024 // 50MB (increased for larger project files)
});

// Pre-configured upload middleware for general files
const generalUpload = createUploadMiddleware({
  destination: 'general',
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxFileSize: 10 * 1024 * 1024 // 10MB
});

// Pre-configured upload middleware specifically for code files
const codeUpload = createUploadMiddleware({
  destination: 'resources',
  allowedMimeTypes: [
    'text/x-python',
    'text/plain',
    'application/octet-stream',
    'text/x-c',
    'text/x-c++',
    'application/javascript',
    'text/javascript'
  ],
  allowedExtensions: [
    '.py',      // Python files
    '.ino',     // Arduino sketch files
    '.pkt',     // Cisco Packet Tracer files
    '.c',       // C source files
    '.cpp',     // C++ source files
    '.h',       // Header files
    '.js',      // JavaScript files
    '.txt',     // Text files
    '.zip'      // Zip archives for multiple files
  ],
  maxFileSize: 50 * 1024 * 1024 // 50MB
});

export { createUploadMiddleware, avatarUpload, slidesUpload, generalUpload, CSVUpload, resourceUpload, codeUpload };