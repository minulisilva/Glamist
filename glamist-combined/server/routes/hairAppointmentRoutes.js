import express from 'express';
import HairAppointment from '../models/hairAppointment.js';
import multer from 'multer';

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Log when routes are registered
console.log('Registering hair appointment routes...');

// Book a new appointment
router.post('/book', upload.single('image'), async (req, res) => {
  console.log('POST /book called');
  const { customerName, phoneNumber, email, service, staff, date, time, price, hairTool } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    if (!customerName || !phoneNumber || !email || !service || !staff || !date || !time || !price) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    const appointment = new HairAppointment({
      customerName,
      phoneNumber,
      email,
      service,
      staff,
      date: parsedDate,
      time,
      price,
      hairTool,
      image,
    });
    await appointment.save();

    res.status(201).json({ success: true, message: 'Appointment booked and pending approval', appointmentId: appointment._id });
  } catch (error) {
    console.error('Error in booking:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin view all appointments
router.get('/admin/appointments', async (req, res) => {
  console.log('GET /admin/appointments called');
  try {
    const appointments = await HairAppointment.find();
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin update appointment
router.put('/admin/appointments/:id', async (req, res) => {
  console.log('PUT /admin/appointments/:id called with ID:', req.params.id);
  const { id } = req.params;
  const { customerName, phoneNumber, service, staff, date, time } = req.body;

  try {
    const appointment = await HairAppointment.findById(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.customerName = customerName || appointment.customerName;
    appointment.phoneNumber = phoneNumber || appointment.phoneNumber;
    appointment.service = service || appointment.service;
    appointment.staff = staff || appointment.staff;
    appointment.date = date ? new Date(date) : appointment.date;
    appointment.time = time || appointment.time;

    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment updated', appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Admin delete appointment
router.delete('/admin/appointments/:id', async (req, res) => {
  console.log('DELETE /admin/appointments/:id called with ID:', req.params.id);
  const { id } = req.params;

  try {
    const appointment = await HairAppointment.findByIdAndDelete(id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    res.status(200).json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;