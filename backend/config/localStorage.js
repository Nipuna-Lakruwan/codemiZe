import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base uploads directory
const baseUploadPath = path.join(__dirname, '../uploads');

// Ensure base uploads directory exists
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Function to ensure specific upload directory exists
const ensureUploadDir = (subDir) => {
  const uploadPath = path.join(baseUploadPath, subDir);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

// Function to save file locally
const uploadToLocal = async (filePath, fileName, subDir = 'general') => {
  try {
    ensureUploadDir(subDir);
    const fileUrl = `/uploads/${subDir}/${fileName}`;
    return {
      url: fileUrl,
      public_id: fileName,
      folder: subDir
    };
  } catch (error) {
    throw new Error('Failed to save file locally');
  }
};

// Function to delete file locally
const deleteFromLocal = async (fileName, subDir = 'general') => {
  try {
    const uploadPath = path.join(baseUploadPath, subDir);
    const filePath = path.join(uploadPath, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { result: 'ok' };
  } catch (error) {
    throw new Error('Failed to delete file locally');
  }
};

// Get upload path for specific subdirectory
const getUploadPath = (subDir = 'general') => {
  return ensureUploadDir(subDir);
};

export { uploadToLocal, deleteFromLocal, getUploadPath, baseUploadPath };
