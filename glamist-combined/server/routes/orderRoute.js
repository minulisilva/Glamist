import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { items, total, date } = req.body;
    const order = new Order({
      items,
      total,
      date,
      status: 'Pending',
    });
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all orders
router.delete('/', async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'All orders cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an order's status
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;