// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const departmentRouter = require('./Routes/departmentRoute');
const employeeRouter = require('./Routes/employeeRoute');
const attendanceRouter = require('./Routes/attendanceRoute'); // Add this

const app = express();

app.use(cors());
app.use(express.json());
app.use('/departments', departmentRouter);
app.use('/employees', employeeRouter);
app.use('/attendance', attendanceRouter); // Add attendance routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect('mongodb+srv://Customer:OQu09KQmffUORmUC@cluster0.jwlzggp.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Magula connected successfully'))
  .then(() => {
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  })
  .catch((err) => console.log(err));