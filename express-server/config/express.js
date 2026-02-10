const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config");

const authRoutes = require("../app/routes/authRoutes");
const studentRoutes = require("../app/routes/studentRoutes");
const courseRoutes = require("../app/routes/courseRoutes");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
    res.send(`API running (${config.env} mode)`);
});

module.exports = app;

