import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';

const router = express.Router();

// Validation middleware for contact form
const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters'),
  body('phone')
    .matches(/^\+\d{1,3}\d{7,15}$/)
    .withMessage('Invalid phone number format (e.g., +94111234567)')
    .isLength({ max: 18 })
    .withMessage('Phone number must be less than 18 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message must be less than 1000 characters'),
];

// POST endpoint for contact form
router.post('/', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;

    // Check for inappropriate words
    const inappropriateWords = [
      'fuck',
      'bitch',
      'nigga',
      'shit',
      'asshole',
      'damn',
      'cunt',
      'bastard',
    ];
    const words = message.toLowerCase().split(/\s+/);
    if (inappropriateWords.some((word) => words.includes(word))) {
      return res.status(400).json({
        success: false,
        error: 'Inappropriate language detected. Please revise your message.',
      });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      message,
      createdAt: new Date(), // Ensure createdAt is set explicitly
    });

    await contact.save();
    res.status(201).json({
      success: true,
      message: 'Contact message saved successfully',
    });
  } catch (error) {
    console.error('Error saving contact:', error.message); // Log specific error message
    res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred. Please try again later.',
    });
  }
});

// GET endpoint to fetch all messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while fetching messages.',
    });
  }
});

export default router;

