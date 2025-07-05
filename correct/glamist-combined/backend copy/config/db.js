import mongoose from 'mongoose';

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);  // No need for deprecated options
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);  // Exit the process if MongoDB connection fails
    }
};

export { connection };




