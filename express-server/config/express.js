const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config");

const authRoutes = require("../app/routes/authRoutes");
const studentRoutes = require("../app/routes/studentRoutes");
const courseRoutes = require("../app/routes/courseRoutes");
const errorHandler = require("../app/middleware/errorMiddleware");

const app = express();

// In a single-project Vercel deployment, the frontend and backend share the same origin.
// We allow localhost for development and the production origin will be automatically handled.
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL 
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl) 
            // or if the origin is in our allowed list
            if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes(".vercel.app")) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
    res.send(`API running (${process.env.NODE_ENV || 'development'} mode)`);
});

app.use(errorHandler);

module.exports = app;
