import { Router } from 'express';
const router = Router();
import Product from '../models/Product.js';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const price = parseFloat(req.body.price);
    const stock = parseInt(req.body.stock);

    if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Price and stock must be valid non-negative numbers' });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: price,
      stock: stock,
      image: req.file ? `/Uploads/${req.file.filename}` : null,
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.price = req.body.price ? parseFloat(req.body.price) : product.price;
    product.stock = req.body.stock ? parseInt(req.body.stock) : product.stock;
    product.image = req.file ? `/Uploads/${req.file.filename}` : product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;