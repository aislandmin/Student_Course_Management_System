const Student = require("../models/student");
const bcrypt = require("bcryptjs");

// CREATE student (admin)
exports.createStudent = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            ...rest,
            password: hashedPassword
        });

        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: "Failed to create student", error: err.message });
    }
};

// READ all students (admin)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select("-password");
        res.json(students);
    } catch {
        res.status(500).json({ message: "Failed to fetch students" });
    }
};

// READ single student (admin or student self)
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).select("-password");
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch {
        res.status(500).json({ message: "Failed to fetch student" });
    }
};

// UPDATE student (admin)
exports.updateStudent = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select("-password");

        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: "Failed to update student" });
    }
};

// DELETE student (admin)
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted" });
    } catch {
        res.status(500).json({ message: "Failed to delete student" });
    }
};
