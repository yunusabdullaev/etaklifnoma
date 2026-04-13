/**
 * File Upload Controller — stores files in PostgreSQL, serves via URL.
 * In-memory LRU cache for fast repeated access.
 */
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

// ── Simple LRU Cache (max 100 files, ~100MB) ──────────
const CACHE_MAX = 100;
const cache = new Map();

function cacheGet(id) {
  const entry = cache.get(id);
  if (!entry) return null;
  // Move to end (most recently used)
  cache.delete(id);
  cache.set(id, entry);
  return entry;
}

function cacheSet(id, data) {
  if (cache.size >= CACHE_MAX) {
    // Delete oldest entry
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
  cache.set(id, data);
}

// ── Multer config — memory, max 10MB ──────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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
 */
exports.uploadMiddleware = upload.single('file');

exports.upload = catchAsync(async (req, res) => {
  const { File } = require('../models');

  if (!req.file) {
    return ApiResponse.error(res, { message: 'Fayl tanlanmadi' }, 400);
  }

  // Compress images server-side
  let buffer = req.file.buffer;
  let mimetype = req.file.mimetype;

  if (mimetype.startsWith('image/')) {
    try {
      const sharp = require('sharp');
      buffer = await sharp(req.file.buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toBuffer();
      mimetype = 'image/jpeg';
    } catch (e) {
      // sharp not available, use original
    }
  }

  const file = await File.create({
    filename: req.file.originalname,
    mimetype,
    data: buffer,
    size: buffer.length,
  });

  // Pre-cache
  cacheSet(file.id, { data: buffer, mimetype, filename: req.file.originalname, size: buffer.length });

  // Use relative URL to avoid http/https mixed content issues
  const url = `/api/files/${file.id}`;

  ApiResponse.success(res, { url, id: file.id }, 'Fayl yuklandi');
});

/**
 * GET /api/files/:id
 * Serves from cache first, then DB
 */
exports.serve = catchAsync(async (req, res) => {
  const id = req.params.id;

  // Check cache first
  let file = cacheGet(id);

  if (!file) {
    // Load from DB
    const { File } = require('../models');
    const dbFile = await File.findByPk(id, {
      attributes: ['data', 'mimetype', 'filename', 'size'],
    });

    if (!dbFile) {
      return res.status(404).send('File not found');
    }

    file = { data: dbFile.data, mimetype: dbFile.mimetype, filename: dbFile.filename, size: dbFile.size };
    cacheSet(id, file);
  }

  res.set({
    'Content-Type': file.mimetype,
    'Content-Length': file.size,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Disposition': `inline; filename="${file.filename}"`,
  });

  res.send(file.data);
});
