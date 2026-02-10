import { useEffect, useState } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Alert,
    Spinner,
    Row,
    Col,
    Form,
} from "react-bootstrap";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseStudents, setCourseStudents] = useState([]);

    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // form for create/update course
    const [form, setForm] = useState({
        courseCode: "",
        courseName: "",
        section: "",
        semester: "",
    });
    const [editingCourseId, setEditingCourseId] = useState(null); // null = adding new

    // Load all courses when component mounts
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setError("");
                setLoadingCourses(true);
                const res = await api.get("/courses"); // GET /api/courses
                setCourses(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load courses. Make sure you are logged in as admin.");
            } finally {
                setLoadingCourses(false);
            }
        };

        loadCourses();
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit form: create OR update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setSaving(true);

            if (editingCourseId) {
                // UPDATE
                await api.put(`/courses/${editingCourseId}`, form);
            } else {
                // CREATE
                await api.post("/courses", form);
            }

            // Reset form
            setForm({
                courseCode: "",
                courseName: "",
                section: "",
                semester: "",
            });
            setEditingCourseId(null);

            // Reload courses
            const res = await api.get("/courses");
            setCourses(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to save course.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourseId(course._id);
        setForm({
            courseCode: course.courseCode || "",
            courseName: course.courseName || "",
            section: course.section || "",
            semester: course.semester || "",
        });
    };

    const handleCancelEdit = () => {
        setEditingCourseId(null);
        setForm({
            courseCode: "",
            courseName: "",
            section: "",
            semester: "",
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            setError("");
            await api.delete(`/courses/${id}`);
            setCourses((prev) => prev.filter((c) => c._id !== id));

            // If deleting selected course, clear students section
            if (selectedCourseId === id) {
                setSelectedCourseId(null);
                setSelectedCourse(null);
                setCourseStudents([]);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to delete course.");
        }
    };

    // When admin clicks "View Students" for a course
    const handleViewStudents = async (courseId) => {
        setSelectedCourseId(courseId);

        const course = courses.find((c) => c._id === courseId) || null;
        setSelectedCourse(course);

        try {
            setError("");
            setLoadingStudents(true);
            const res = await api.get(`/courses/${courseId}/students`); // GET /api/courses/:id/students
            setCourseStudents(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load students for this course. This action is admin-only.");
            setCourseStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    return (
        <>
            <Navbar />

            <Container className="mt-4">
                <h2 className="mb-4">Admin – Courses Management</h2>

                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                {/* Add / Edit Course Form */}
                <Card className="shadow-sm mb-4 p-3">
                    <Card.Title>{editingCourseId ? "Edit Course" : "Add Course"}</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Course Code</Form.Label>
                                    <Form.Control
                                        name="courseCode"
                                        value={form.courseCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Course Name</Form.Label>
                                    <Form.Control
                                        name="courseName"
                                        value={form.courseName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={2}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Section</Form.Label>
                                    <Form.Control
                                        name="section"
                                        value={form.section}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Semester</Form.Label>
                                    <Form.Control
                                        name="semester"
                                        value={form.semester}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col md={editingCourseId ? 6 : 12}>
                                <Button
                                    type="submit"
                                    className="w-100"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCourseId
                                            ? "Update Course"
                                            : "Add Course"}
                                </Button>
                            </Col>

                            {editingCourseId && (
                                <Col md={6} className="mt-2 mt-md-0">
                                    <Button
                                        variant="secondary"
                                        className="w-100"
                                        type="button"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel Edit
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Form>
                </Card>

                {/* All Courses List */}
                <Card className="shadow-sm mb-4 p-3">
                    <Card.Title>All Courses</Card.Title>
                    <Card.Text className="text-muted">
                        View all courses. You can edit, delete, or view enrolled students.
                    </Card.Text>

                    {loadingCourses ? (
                        <div className="text-center my-3">
                            <Spinner animation="border" size="sm" /> Loading courses...
                        </div>
                    ) : courses.length === 0 ? (
                        <p className="mt-3">
                            No courses found. Use the form above to add your first course.
                        </p>
                    ) : (
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Section</th>
                                    <th>Semester</th>
                                    <th style={{ width: "25%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id}>
                                        <td>{course.courseCode}</td>
                                        <td>{course.courseName}</td>
                                        <td>{course.section}</td>
                                        <td>{course.semester}</td>
                                        <td>
                                            <Row className="g-2">
                                                <Col xs={12} sm={4} md={5}>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="w-100"
                                                        onClick={() => handleViewStudents(course._id)}
                                                    >
                                                        View Students
                                                    </Button>
                                                </Col>
                                                <Col xs={6} sm={3} md={3}>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="w-100"
                                                        onClick={() => handleEdit(course)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Col>
                                                <Col xs={6} sm={3} md={3}>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="w-100"
                                                        onClick={() => handleDelete(course._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card>

                {/* Students in Selected Course */}
                <Row>
                    <Col md={12}>
                        <Card className="shadow-sm p-3">
                            <Card.Title>
                                Students Taking{" "}
                                {selectedCourse
                                    ? `${selectedCourse.courseCode} – ${selectedCourse.courseName}`
                                    : "Selected Course"}
                            </Card.Title>

                            {selectedCourse && (
                                <Card.Subtitle className="text-muted mb-2">
                                    Section {selectedCourse.section} · {selectedCourse.semester}
                                </Card.Subtitle>
                            )}

                            {!selectedCourseId && (
                                <p className="mt-3">
                                    Select a course above and click <strong>View Students</strong>{" "}
                                    to see who is enrolled.
                                </p>
                            )}

                            {selectedCourseId && loadingStudents && (
                                <div className="text-center my-3">
                                    <Spinner animation="border" size="sm" /> Loading students...
                                </div>
                            )}

                            {selectedCourseId &&
                                !loadingStudents &&
                                courseStudents.length === 0 && (
                                    <p className="mt-3">
                                        No students are currently enrolled in this course.
                                    </p>
                                )}

                            {selectedCourseId &&
                                !loadingStudents &&
                                courseStudents.length > 0 && (
                                    <Table striped bordered hover responsive className="mt-3">
                                        <thead>
                                            <tr>
                                                <th>Student Number</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Program</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courseStudents.map((s) => (
                                                <tr key={s._id}>
                                                    <td>{s.studentNumber}</td>
                                                    <td>
                                                        {s.firstName} {s.lastName}
                                                    </td>
                                                    <td>{s.email}</td>
                                                    <td>{s.program}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
