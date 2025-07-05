import mongoose from 'mongoose';

const hairAppointmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  service: { type: String, required: true },
  staff: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // Base64 string for the uploaded image
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  approvedBy: { type: String }, // Admin username or ID who approved/denied
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('HairAppointment', hairAppointmentSchema);