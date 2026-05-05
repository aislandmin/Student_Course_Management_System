const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(config.mongoUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s
        });
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
