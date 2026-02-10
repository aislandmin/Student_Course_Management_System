const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/courseController");

// student actions first

router.get("/my/courses", auth, controller.getMyCourses);
router.post("/:id/add", auth, controller.addCourseForStudent);
router.delete("/:id/drop", auth, controller.dropCourseForStudent);
router.post("/changeEnrollment", auth, controller.changeCourseEnrollment);

// CRUD – admin
router.post("/", auth, role("admin"), controller.createCourse);
router.get("/", auth, controller.getAllCourses);
router.get("/:id", auth, controller.getCourseById);
router.put("/:id", auth, role("admin"), controller.updateCourse);
router.delete("/:id", auth, role("admin"), controller.deleteCourse);

// admin: list students in course
router.get("/:id/students", auth, role("admin"), controller.getStudentsInCourse);

module.exports = router;
