import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    supplier: { type: String },
    description: { type: String },
    category: { type: String },
    history: [{
        action: { type: String, enum: ['added', 'updated', 'used'], required: true },
        quantityChanged: { type: Number, required: true },
        reason: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    lowStockEmailSent: { type: Boolean, default: false } // New field to track email status
}, { timestamps: true });

export default mongoose.model('Product', productSchema);