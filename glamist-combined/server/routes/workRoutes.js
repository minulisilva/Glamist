import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Work from '../models/Work.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create uploads directory:', err.message);
  }
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png)!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all works
router.get('/', async (req, res) => {
  try {
    const works = await Work.find();
    res.json({ success: true, data: works });
  } catch (err) {
    console.error('Error in GET /api/works:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Get a single work by ID
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid work ID' });
    }
    const work = await Work.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }
    res.json({ success: true, data: work });
  } catch (err) {
    console.error(`Error in GET /api/works/${req.params.id}:`, err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Create a new work
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { category, title, description, height, artist } = req.body;
    if (!category || !title || !description || !height || !artist || !req.file) {
      return res.status(400).json({ success: false, message: 'All fields are required, including an image' });
    }
    const imagePath = `/uploads/${req.file.filename}`; // Fixed path to lowercase
    // Verify file was saved
    const fullPath = path.join(__dirname, '..', imagePath);
    if (!fs.existsSync(fullPath)) {
      console.error(`Image file not found at ${fullPath}`);
      return res.status(500).json({ success: false, message: 'Failed to save image' });
    }
    const newWork = new Work({ category, title, description, image: imagePath, height, artist });
    const savedWork = await newWork.save();
    res.status(201).json({ success: true, data: savedWork });
  } catch (err) {
    console.error('Error in POST /api/works:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Update a work
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid work ID' });
    }
    const { category, title, description, height, artist } = req.body;
    const updateData = { category, title, description, height, artist };
    let oldImagePath;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`; // Fixed path to lowercase
      // Verify new file was saved
      const fullPath = path.join(__dirname, '..', updateData.image);
      if (!fs.existsSync(fullPath)) {
        console.error(`New image file not found at ${fullPath}`);
        return res.status(500).json({ success: false, message: 'Failed to save new image' });
      }
      // Store old image path to delete after update
      const work = await Work.findById(req.params.id);
      if (work) {
        oldImagePath = work.image;
      }
    }
    const updatedWork = await Work.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedWork) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }
    // Delete old image if a new one was uploaded and old image exists
    if (oldImagePath && req.file) {
      const oldFullPath = path.join(__dirname, '..', oldImagePath);
      if (fs.existsSync(oldFullPath)) {
        try {
          fs.unlinkSync(oldFullPath);
        } catch (err) {
          console.error(`Failed to delete old image ${oldImagePath}:`, err.message);
        }
      }
    }
    res.json({ success: true, data: updatedWork });
  } catch (err) {
    console.error(`Error in PUT /api/works/${req.params.id}:`, err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Delete a workCW
router.delete('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid work ID' });
    }
    const deletedWork = await Work.findByIdAndDelete(req.params.id);
    if (!deletedWork) {
      return res.status(404).json({ success: false, message: 'Work not found' });
    }
    // Delete the image file if it exists
    const imagePath = path.join(__dirname, '..', deletedWork.image);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error(`Failed to delete image ${deletedWork.image}:`, err.message);
      }
    }
    res.json({ success: true, message: 'Work deleted successfully' });
  } catch (err) {
    console.error(`Error in DELETE /api/works/${req.params.id}:`, err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

export default router;