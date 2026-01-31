import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../config/snowflake.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, JPG, PNG, CSV, XLSX'));
    }
  }
});

// Auth middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Upload document
router.post('/upload', authenticate, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType } = req.body;
    const documentId = uuidv4();

    await executeQuery(
      `INSERT INTO documents (id, user_id, filename, file_type, file_size, document_type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        documentId,
        req.userId,
        req.file.originalname,
        path.extname(req.file.originalname).toLowerCase(),
        req.file.size,
        documentType || 'general'
      ]
    );

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: documentId,
        filename: req.file.originalname,
        fileType: path.extname(req.file.originalname).toLowerCase(),
        fileSize: req.file.size,
        documentType: documentType || 'general',
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get user's documents
router.get('/', authenticate, async (req, res) => {
  try {
    const documents = await executeQuery(
      `SELECT id, filename, file_type, file_size, document_type, status, uploaded_at, processed_at
       FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC`,
      [req.userId]
    );

    res.json({
      documents: documents.map(doc => ({
        id: doc.ID,
        filename: doc.FILENAME,
        fileType: doc.FILE_TYPE,
        fileSize: doc.FILE_SIZE,
        documentType: doc.DOCUMENT_TYPE,
        status: doc.STATUS,
        uploadedAt: doc.UPLOADED_AT,
        processedAt: doc.PROCESSED_AT
      }))
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to get documents' });
  }
});

// Delete document
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify document belongs to user
    const docs = await executeQuery(
      'SELECT id FROM documents WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (!docs || docs.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await executeQuery('DELETE FROM documents WHERE id = ?', [id]);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
