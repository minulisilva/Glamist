import LookBook from '../models/Look_Book.js';
import mongoose from 'mongoose';

export const getProducts= async (req, res) => {
    try {
        const lookBooks = await LookBook.find();  
        res.status(200).json({ success: true, data: lookBooks });
    } catch (error) {
        console.error("Error fetching LookBook entries:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const createProduct=async (req, res) => {
    try {
        const newLookBook = new LookBook(req.body);
        await newLookBook.save();
        res.status(201).json({ success: true, data: newLookBook });
    } catch (error) {
        console.error("Error creating LookBook:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const updateProduct= async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;  

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid LookBook ID" });
    }

    try {
        const updatedLook = await LookBook.findByIdAndUpdate(id, updatedData, { 
            new: true, 
            runValidators: true  
        });

        if (!updatedLook) {
            return res.status(404).json({ success: false, message: "LookBook not found" });
        }

        res.status(200).json({ success: true, data: updatedLook });
    } catch (error) {
        console.error("❌ Error updating LookBook:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

export const deleteProduct=async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid LookBook ID" });
    }

    try {
        const deletedLook = await LookBook.findByIdAndDelete(id);

        if (!deletedLook) {
            return res.status(404).json({ success: false, message: "LookBook not found" });
        }

        res.status(200).json({ success: true, message: "LookBook deleted successfully", data: deletedLook });
    } catch (error) {
        console.error("Error deleting LookBook:", error.message);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};