import { Router } from 'express';
import CustomOrder from '../models/CustomOrder.js';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';

const router = Router();

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const customOrder = new CustomOrder({
      name: req.body.name,
      description: req.body.description,
      estimatedPrice: req.body.estimatedPrice,
      image: req.file ? `/Uploads/${req.file.filename}` : null,
    });
    const newCustomOrder = await customOrder.save();
    res.status(201).json(newCustomOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const customOrders = await CustomOrder.find();
    res.json(customOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customOrder = await CustomOrder.findById(req.params.id);
    if (customOrder) res.json(customOrder);
    else res.status(404).json({ message: 'Custom order not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const customOrder = await CustomOrder.findById(req.params.id);
    if (!customOrder) return res.status(404).json({ message: 'Custom order not found' });
    await customOrder.deleteOne();
    res.json({ message: 'Custom order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;