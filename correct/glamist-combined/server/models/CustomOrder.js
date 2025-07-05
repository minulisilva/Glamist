import { Schema, model } from 'mongoose';

const customOrderSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  estimatedPrice: { type: Number, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
});

export default model('CustomOrder', customOrderSchema);