const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const controller = require("../controllers/studentController");

// All student management is admin-only
router.post("/", auth, role("admin"), controller.createStudent);
router.get("/", auth, role("admin"), controller.getAllStudents);
router.get("/:id", auth, role("admin"), controller.getStudentById);
router.put("/:id", auth, role("admin"), controller.updateStudent);
router.delete("/:id", auth, role("admin"), controller.deleteStudent);

module.exports = router;
