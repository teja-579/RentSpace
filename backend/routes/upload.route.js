import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();
import fs from 'fs'; // Import fs for logging

// Create a log file if it doesn't exist
const logFilePath = 'logs/upload.log'; // Corrected path for logs
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs'); // Create logs directory if it doesn't exist
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'backend/public/uploads';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Route for uploading multiple photos
router.post('/upload', upload.array('photos', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  
    const filePaths = req.files.map(file => 
      file.path.replace(/\\/g, '/').replace('backend/public/uploads/', 'uploads/')
    );
  
    // Log file paths
    const logMessage = `Files uploaded: ${filePaths.join(', ')}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
  
    res.status(200).json({ 
      message: 'Files uploaded successfully',
      filePaths 
    });
  }
);

export default router;
