import express from "express";
import dotenv from "dotenv";
import { connection } from "./config/db.js";  
import productRoutes from "./routes/product.route.js"; // ✅ Fixed Import Path

dotenv.config();  
connection();  // ✅ Ensure this properly connects to MongoDB

const app = express();

// ✅ Middleware to parse JSON data in request body
app.use(express.json());

// ✅ Define Routes
app.use("/LookBook", productRoutes); // Ensure the correct naming of your route file

// ✅ Root Route - Check if server is working
app.get("/", (req, res) => {
    res.send("Server is ready");
});

// ✅ Graceful Shutdown Handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Closed all remaining connections.');
        process.exit(0);
    });
});

// ✅ Start Server with Dynamic Port
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
