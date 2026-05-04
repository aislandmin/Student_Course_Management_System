const Student = require("../models/student");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");

// CREATE student (admin)
exports.createStudent = asyncHandler(async (req, res) => {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
        ...rest,
        password: hashedPassword
    });

    await student.save();
    const studentResponse = student.toObject();
    delete studentResponse.password;
    res.status(201).json(studentResponse);
});

// READ all students (admin) with pagination
exports.getAllStudents = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
        .select("-password")
        .skip(skip)
        .limit(limit);

    const total = await Student.countDocuments();

    res.json({
        students,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStudents: total
    });
});

// READ single student (admin or student self)
exports.getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).select("-password");
    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    res.json(student);
});

// UPDATE student (admin)
exports.updateStudent = asyncHandler(async (req, res) => {
    const updates = { ...req.body };

    // Industry Level Security: Prevent an admin from changing their own role
    // This prevents accidental self-lockout from the admin panel
    if (req.params.id === req.user.id && updates.role && updates.role !== req.user.role) {
        const error = new Error("You cannot change your own role. Please ask another admin to do this.");
        error.statusCode = 400;
        throw error;
    }

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    res.json(student);
});

// DELETE student (admin)
exports.deleteStudent = asyncHandler(async (req, res) => {
    // Industry Level: Prevent self-deletion
    if (req.params.id === req.user.id) {
        const error = new Error("You cannot delete your own account while logged in.");
        error.statusCode = 400;
        throw error;
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    res.json({ message: "Student deleted" });
});

// Student Self-Profile Update
exports.updateMe = asyncHandler(async (req, res) => {
    const updates = { ...req.body };

    // Security: Explicitly remove fields that students should not be able to change
    delete updates.studentNumber;
    delete updates.role;

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
    }

    const student = await Student.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }
    res.json(student);
});
