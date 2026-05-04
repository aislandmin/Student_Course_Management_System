const Course = require("../models/course");
const asyncHandler = require("../utils/asyncHandler");

// CREATE course (admin)
exports.createCourse = asyncHandler(async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
});

// READ all courses (admin, and also for some student views) with pagination
exports.getAllCourses = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.find()
        .skip(skip)
        .limit(limit);

    const total = await Course.countDocuments();

    res.json({
        courses,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCourses: total
    });
});

// READ single course
exports.getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }
    res.json(course);
});

// UPDATE course (admin)
exports.updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }
    res.json(course);
});

// DELETE course (admin)
exports.deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }
    res.json({ message: "Course deleted" });
});

// STUDENT: Add (enroll) current user to course
exports.addCourseForStudent = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    const userId = req.user.id;
    if (!course.students.includes(userId)) {
        course.students.push(userId);
        await course.save();
    }

    res.json(course);
});

// STUDENT: Drop (unenroll) current user from course
exports.dropCourseForStudent = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    const userId = req.user.id;
    course.students = course.students.filter(
        (id) => id.toString() !== userId
    );
    await course.save();

    res.json(course);
});

// STUDENT: list all courses taken by current student
exports.getMyCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ students: req.user.id });
    res.json(courses);
});

// ADMIN: list all students taking a specific course
exports.getStudentsInCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate(
        "students",
        "-password"
    );
    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    res.json(course.students);
});

// STUDENT: change section
exports.changeCourseEnrollment = asyncHandler(async (req, res) => {
    const { fromCourseId, toCourseId } = req.body;
    const userId = req.user.id;

    if (!fromCourseId || !toCourseId) {
        const error = new Error("Both fromCourseId and toCourseId are required");
        error.statusCode = 400;
        throw error;
    }

    // 1. Remove student from old course
    const fromCourse = await Course.findById(fromCourseId);
    if (!fromCourse) {
        const error = new Error("Source course not found");
        error.statusCode = 404;
        throw error;
    }

    fromCourse.students = fromCourse.students.filter(
        (id) => id.toString() !== userId
    );
    await fromCourse.save();

    // 2. Add student to new course
    const toCourse = await Course.findById(toCourseId);
    if (!toCourse) {
        const error = new Error("Target course not found");
        error.statusCode = 404;
        throw error;
    }

    if (!toCourse.students.includes(userId)) {
        toCourse.students.push(userId);
        await toCourse.save();
    }

    res.json({
        message: "Enrollment updated",
        fromCourse,
        toCourse
    });
});
