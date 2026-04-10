const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ApiResponse = require('../utils/ApiResponse');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/uploads/music');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage — save to disk
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
  const allowedMIME = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
    'audio/aac', 'audio/m4a', 'audio/x-m4a', 'audio/mp4',
    'audio/x-wav', 'audio/webm', 'audio/flac',
  ];
  const allowedExt = /\.(mp3|wav|ogg|aac|m4a|flac|webm)$/i;
  if (allowedMIME.includes(file.mimetype) || allowedExt.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Faqat audio fayllar (MP3, WAV, OGG, AAC) yuklanishi mumkin'), false);
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
exports.uploadMusic = (req, res) => {
  upload.single('music')(req, res, (err) => {
    if (err) {
      // Handle multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: { message: 'Fayl hajmi 10MB dan oshmasligi kerak' },
        });
      }
      return res.status(400).json({
        success: false,
        error: { message: err.message || 'Yuklashda xatolik yuz berdi' },
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'Audio fayl yuklanmadi. MP3, WAV, OGG yoki AAC fayl tanlang.' },
      });
    }

    // Build URL relative — works with any domain
    const fileUrl = `/uploads/music/${req.file.filename}`;

    ApiResponse.success(res, {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  });
};
