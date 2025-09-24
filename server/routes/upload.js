const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

// Upload file
router.post('/', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No file uploaded'
      });
    }
    
    const { type } = req.body;
    
    if (!type || !['logo', 'avatar', 'ad_creative'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid file type. Must be logo, avatar, or ad_creative'
      });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        type: type
      },
      message: 'File uploaded successfully'
    });
    
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'File upload failed'
    });
  }
});

// Upload multiple files
router.post('/multiple', verifyToken, upload.array('files', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No files uploaded'
      });
    }
    
    const { type } = req.body;
    
    if (!type || !['logo', 'avatar', 'ad_creative'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid file type. Must be logo, avatar, or ad_creative'
      });
    }
    
    const files = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      type: type
    }));
    
    res.json({
      success: true,
      data: files,
      message: 'Files uploaded successfully'
    });
    
  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'File upload failed'
    });
  }
});

// Delete file
router.delete('/:filename', verifyToken, (req, res) => {
  try {
    const { filename } = req.params;
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const filePath = path.join(uploadDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'File not found'
      });
    }
    
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'File deletion failed'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'File too large'
      });
    }
  }
  
  if (error.message === 'Invalid file type. Only images are allowed.') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: error.message
    });
  }
  
  next(error);
});

module.exports = router;
