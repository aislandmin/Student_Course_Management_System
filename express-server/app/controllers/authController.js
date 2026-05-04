const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const asyncHandler = require("../utils/asyncHandler");

exports.login = asyncHandler(async (req, res) => {
    const { studentNumber, password } = req.body;

    const user = await Student.findOne({ studentNumber });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });

    res.json({
        message: "Login successful",
        role: user.role,
        id: user._id,
        studentNumber: user.studentNumber
    });
});

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};

exports.getMe = asyncHandler(async (req, res) => {
    const user = await Student.findById(req.user.id).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
});
