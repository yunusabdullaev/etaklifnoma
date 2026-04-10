const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const ApiResponse = require('../utils/ApiResponse');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/music');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.mp3';
    cb(null, `${uniqueName}${ext}`);
  },
});

// File filter — only audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a', 'audio/x-m4a'];
  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|ogg|aac|m4a)$/i)) {
    cb(null, true);
  } else {
    cb(new AppError('Faqat audio fayllar (MP3, WAV, OGG, AAC) yuklanishi mumkin', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

/**
 * POST /api/upload/music
 * Uploads an audio file and returns its public URL
 */
exports.uploadMusic = [
  upload.single('music'),
  catchAsync(async (req, res) => {
    if (!req.file) {
      throw AppError.badRequest('Audio fayl yuklanmadi');
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const fileUrl = `${appUrl}/uploads/music/${req.file.filename}`;

    ApiResponse.success(res, {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  }),
];
