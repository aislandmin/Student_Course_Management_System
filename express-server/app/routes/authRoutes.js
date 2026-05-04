const router = require("express").Router();
const { login, logout, getMe } = require("../controllers/authController");
const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const auth = require("../middleware/authMiddleware");

router.post(
    "/login",
    [
        body("studentNumber").notEmpty().withMessage("Student number is required"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    validate,
    login
);

router.post("/logout", logout);
router.get("/me", auth, getMe);

module.exports = router;
