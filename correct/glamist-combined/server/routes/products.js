const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { sendLowStockEmail } = require('../utils/email');

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const predefinedCategories = ['Hair', 'Nail', 'Tattoo', 'Piercings', 'Bridal', 'Skin'];
    const allCategories = [...new Set([...categories.filter(c => c), ...predefinedCategories])].sort();
    res.json({ success: true, data: allCategories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// Add a product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Check for low stock
    if (product.quantity <= 10) {
      await sendLowStockEmail(product);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Failed to add product' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check for low stock
    if (product.quantity <= 10) {
      await sendLowStockEmail(product);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// Bulk delete products
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: 'Products deleted' });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({ success: false, message: 'Failed to delete products' });
  }
});

// Record product usage
router.post('/use/:id', async (req, res) => {
  try {
    const { quantity, reason } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.quantity -= quantity;
    product.history.push({
      action: 'used',
      quantityChanged: quantity,
      reason,
      timestamp: new Date()
    });
    await product.save();

    // Check for low stock
    if (product.quantity <= 10) {
      await sendLowStockEmail(product);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({ success: false, message: 'Failed to record usage' });
  }
});

// Get usage report
router.get('/usage-report', async (req, res) => {
  try {
    const { category, productId } = req.query;
    let query = {};
    if (category && category !== 'All Categories') {
      query.category = category;
    }
    if (productId && productId !== 'All Products') {
      query._id = productId;
    }
    const products = await Product.find(query).select('name category history');
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching usage report:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch usage report' });
  }
});

// Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const totalItems = await Product.countDocuments();
    const categories = await Product.distinct('category');
    const lowStock = await Product.countDocuments({ quantity: { $lte: 10 } });
    const totalValue = (await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$price'] } } } }
    ]))[0]?.total || 0;
    const unitsUsed = (await Product.aggregate([
      { $unwind: '$history' },
      { $match: { 'history.action': 'used' } },
      { $group: { _id: null, total: { $sum: '$history.quantityChanged' } } }
    ]))[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalItems,
        categories: categories.length,
        lowStock,
        totalValue,
        unitsUsed
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

// Generate report (placeholder)
router.post('/reports', (req, res) => {
  try {
    res.json({ success: true, message: 'Report generated' });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

module.exports = router;