const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Create new contact submission
        const contact = new Contact({
            name,
            email,
            message
        });

        // Save to database
        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Message submitted successfully',
            data: contact
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error submitting message',
            error: error.message
        });
    }
});

module.exports = router;