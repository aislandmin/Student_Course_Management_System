const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/studentController");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");

const studentValidation = [
    body("studentNumber").notEmpty().withMessage("Student number is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").if(body("password").exists()).isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

// Validation for student profile updates (skip studentNumber as it's immutable)
const profileValidation = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").optional({ checkFalsy: true }).isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

// All student management is admin-only
router.post("/", auth, role("admin"), studentValidation, validate, controller.createStudent);
router.get("/", auth, role("admin"), controller.getAllStudents);

// Self-profile management (Student role)
router.put("/me", auth, role("student"), profileValidation, validate, controller.updateMe);

router.get("/:id", auth, role("admin"), controller.getStudentById);
router.put("/:id", auth, role("admin"), studentValidation, validate, controller.updateStudent);
router.delete("/:id", auth, role("admin"), controller.deleteStudent);

module.exports = router;
