const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

exports.login = async (req, res) => {
    const { studentNumber, password } = req.body;

    try {
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
            sameSite: "lax" // safe for local dev
            // secure: true   // enable in HTTPS/production
        });

        res.json({
            message: "Login successful",
            role: user.role,
            id: user._id,
            studentNumber: user.studentNumber
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
};
