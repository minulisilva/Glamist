import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import existing routes
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import workRouter from './routes/workRoutes.js';
import hairAppointmentRouter from './routes/hairAppointmentRoutes.js';
import inventoryRouter from './routes/inventoryRoutes.js';
import salaryRouter from './routes/salary.route.js';

// Import new routes
import employeeRouter from './routes/employeeRouter.js';
import attendanceRouter from './routes/attendanceRouter.js';
import departmentRouter from './routes/departmentRouter.js';
import customOrderRouter from './routes/customOrderRoute.js';
import orderRouter from './routes/orderRoute.js';
import productRouter from './routes/productRoute.js';
import contactRouter from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Configure CORS
const allowedOrigins = process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:5174', 'http://localhost:5173']
    : ['https://your-production-domain.com'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (e.g., form submissions)
app.use(cookieParser());

// Serve static files for uploads
const uploadsDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/Uploads', express.static(uploadsDir));

// Debug middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.get('/', (req, res) => res.send('API working fine'));

// Existing routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/works', workRouter);
app.use('/api/hair-appointments', hairAppointmentRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/salary', salaryRouter);

// New routes
app.use('/api/employees', employeeRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/departments', departmentRouter);
app.use('/orders', orderRouter);
app.use('/customOrders', customOrderRouter);
app.use('/products', productRouter);
app.use('/api/contact', contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Request payload too large. Please reduce the size of your request.',
        });
    }
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Start server
app.listen(port, () => console.log(`Server started on PORT:${port}`));