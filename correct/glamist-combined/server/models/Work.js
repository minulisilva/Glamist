import mongoose from 'mongoose';

const workSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Stores file path (e.g., /uploads/image.jpg)
    height: { type: String, required: true },
    artist: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Work', workSchema);