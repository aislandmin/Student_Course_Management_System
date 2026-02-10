const Course = require("../models/course");

// CREATE course (admin)
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(400).json({ message: "Failed to create course", error: err.message });
    }
};

// READ all courses (admin, and also for some student views)
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch {
        res.status(500).json({ message: "Failed to fetch courses" });
    }
};

// READ single course
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch {
        res.status(500).json({ message: "Failed to fetch course" });
    }
};

// UPDATE course (admin) – e.g., change section, semester, etc.
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(400).json({ message: "Failed to update course" });
    }
};

// DELETE course (admin)
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course deleted" });
    } catch {
        res.status(500).json({ message: "Failed to delete course" });
    }
};

// STUDENT: Add (enroll) current user to course
exports.addCourseForStudent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const userId = req.user.id;
        if (!course.students.includes(userId)) {
            course.students.push(userId);
            await course.save();
        }

        res.json(course);
    } catch {
        res.status(500).json({ message: "Failed to add course" });
    }
};

// STUDENT: Drop (unenroll) current user from course
exports.dropCourseForStudent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const userId = req.user.id;
        course.students = course.students.filter(
            (id) => id.toString() !== userId
        );
        await course.save();

        res.json(course);
    } catch {
        res.status(500).json({ message: "Failed to drop course" });
    }
};

// STUDENT: list all courses taken by current student
exports.getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ students: req.user.id });
        res.json(courses);
    } catch {
        res.status(500).json({ message: "Failed to fetch my courses" });
    }
};

// ADMIN: list all students taking a specific course
exports.getStudentsInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate(
            "students",
            "-password"
        );
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.json(course.students);
    } catch {
        res.status(500).json({ message: "Failed to fetch students for course" });
    }
};

// STUDENT: change section by changing enrollment between two courses
// different sections means two different courses even thought same course name or code
exports.changeCourseEnrollment = async (req, res) => {
    try {
        const { fromCourseId, toCourseId } = req.body;
        const userId = req.user.id;

        if (!fromCourseId || !toCourseId) {
            return res
                .status(400)
                .json({ message: "Both fromCourseId and toCourseId are required" });
        }

        // 1. Remove student from old course
        const fromCourse = await Course.findById(fromCourseId);
        if (!fromCourse) {
            return res.status(404).json({ message: "Source course not found" });
        }

        fromCourse.students = fromCourse.students.filter(
            (id) => id.toString() !== userId
        );
        await fromCourse.save();

        // 2. Add student to new course
        const toCourse = await Course.findById(toCourseId);
        if (!toCourse) {
            return res.status(404).json({ message: "Target course not found" });
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
    } catch (err) {
        res.status(500).json({ message: "Failed to change enrollment" });
    }
};
