/**
 * File Upload Controller — stores files in PostgreSQL, serves via URL.
 */
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

// Multer config — store in memory, max 10MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /^(image\/(jpeg|jpg|png|gif|webp)|audio\/(mpeg|mp3|wav|ogg|aac))$/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Faqat rasm yoki audio fayl yuklash mumkin'), false);
    }
  },
});

/**
 * POST /api/upload
 * Accepts multipart file, stores in DB, returns URL
 */
exports.uploadMiddleware = upload.single('file');

exports.upload = catchAsync(async (req, res) => {
  const { File } = require('../models');

  if (!req.file) {
    return ApiResponse.error(res, { message: 'Fayl tanlanmadi' }, 400);
  }

  const file = await File.create({
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    data: req.file.buffer,
    size: req.file.size,
  });

  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/api/files/${file.id}`;

  ApiResponse.success(res, { url, id: file.id }, 'Fayl yuklandi');
});

/**
 * GET /api/files/:id
 * Serves file binary with proper headers + caching
 */
exports.serve = catchAsync(async (req, res) => {
  const { File } = require('../models');

  const file = await File.findByPk(req.params.id, {
    attributes: ['data', 'mimetype', 'filename', 'size'],
  });

  if (!file) {
    return res.status(404).send('File not found');
  }

  res.set({
    'Content-Type': file.mimetype,
    'Content-Length': file.size,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Disposition': `inline; filename="${file.filename}"`,
  });

  res.send(file.data);
});
