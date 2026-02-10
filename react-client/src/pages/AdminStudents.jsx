import { useEffect, useState } from "react";
import {
    Container,
    Card,
    Button,
    Form,
    Table,
    Alert,
    Spinner,
    Row,
    Col,
} from "react-bootstrap";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function AdminStudents() {
    const [students, setStudents] = useState([]);

    const [form, setForm] = useState({
        studentNumber: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phoneNumber: "",
        email: "",
        program: "",
        favoriteTopic: "",
        strongestSkill: "",
        role: "student",
    });

    const [editingStudentId, setEditingStudentId] = useState(null); // null = add mode
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Load all students (admin-only)
    const loadStudents = async () => {
        try {
            setError("");
            setLoading(true);
            const res = await api.get("/students"); // GET /api/students
            setStudents(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load students. Make sure you are logged in as admin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Add or update student
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setSaving(true);

            // Build payload
            const payload = { ...form };

            // If in edit mode and password is empty, don't send password (so it won't be reset)
            if (editingStudentId && !payload.password) {
                delete payload.password;
            }

            if (editingStudentId) {
                // UPDATE existing student -> PUT /students/:id
                await api.put(`/students/${editingStudentId}`, payload);
            } else {
                // CREATE new student -> POST /students
                await api.post("/students", payload);
            }

            // Reset form + mode
            setForm({
                studentNumber: "",
                password: "",
                firstName: "",
                lastName: "",
                address: "",
                city: "",
                phoneNumber: "",
                email: "",
                program: "",
                favoriteTopic: "",
                strongestSkill: "",
                role: "student",
            });
            setEditingStudentId(null);

            // Reload list
            await loadStudents();
        } catch (err) {
            console.error(err);
            setError("Failed to save student.");
        } finally {
            setSaving(false);
        }
    };

    // Click on "Edit" for a row
    const handleEdit = async (studentId) => {
        try {
            setError("");
            // You *can* use the list data directly, but since you have GET /students/:id,
            // let's use that to show you are using the API:
            const res = await api.get(`/students/${studentId}`); // GET /students/:id
            const s = res.data;

            setForm({
                studentNumber: s.studentNumber || "",
                password: "", // leave empty; only change if admin types a new one
                firstName: s.firstName || "",
                lastName: s.lastName || "",
                address: s.address || "",
                city: s.city || "",
                phoneNumber: s.phoneNumber || "",
                email: s.email || "",
                program: s.program || "",
                favoriteTopic: s.favoriteTopic || "",
                strongestSkill: s.strongestSkill || "",
                role: s.role || "student",
            });

            setEditingStudentId(studentId);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error(err);
            setError("Failed to load student details.");
        }
    };

    // Cancel edit mode
    const handleCancelEdit = () => {
        setEditingStudentId(null);
        setForm({
            studentNumber: "",
            password: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            phoneNumber: "",
            email: "",
            program: "",
            favoriteTopic: "",
            strongestSkill: "",
            role: "student",
        });
    };

    // Delete student
    const handleDelete = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        try {
            setError("");
            await api.delete(`/students/${studentId}`); // DELETE /students/:id
            await loadStudents();
        } catch (err) {
            console.error(err);
            setError("Failed to delete student.");
        }
    };

    return (
        <>
            <Navbar />

            <Container className="mt-4">
                <h2 className="mb-4">Admin – Students Management</h2>

                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                {/* Add / Edit Student Form */}
                <Card className="shadow-sm mb-4 p-3">
                    <h4 className="mb-3">
                        {editingStudentId ? "Edit Student" : "Add Student"}
                    </h4>

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Student Number</Form.Label>
                                    <Form.Control
                                        name="studentNumber"
                                        value={form.studentNumber}
                                        onChange={handleChange}
                                        required
                                        disabled={!!editingStudentId} // usually studentNumber should not change
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>
                                        Password{" "}
                                        {editingStudentId && (
                                            <small className="text-muted">(leave blank to keep)</small>
                                        )}
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required={!editingStudentId} // required when adding, optional when editing
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select
                                        name="role"
                                        value={form.role}
                                        onChange={handleChange}
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Program</Form.Label>
                                    <Form.Control
                                        name="program"
                                        value={form.program}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-2">
                                    <Form.Label>Favorite Topic</Form.Label>
                                    <Form.Control
                                        name="favoriteTopic"
                                        value={form.favoriteTopic}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Strongest Skill</Form.Label>
                                    <Form.Control
                                        name="strongestSkill"
                                        value={form.strongestSkill}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col md={editingStudentId ? 6 : 12}>
                                <Button
                                    type="submit"
                                    className="w-100"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingStudentId
                                            ? "Update Student"
                                            : "Add Student"}
                                </Button>
                            </Col>

                            {editingStudentId && (
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

                {/* Students table */}
                <Card className="shadow-sm p-3">
                    <h4>All Students</h4>

                    {loading ? (
                        <div className="text-center my-3">
                            <Spinner animation="border" size="sm" /> Loading students...
                        </div>
                    ) : students.length === 0 ? (
                        <p className="mt-3">No students found.</p>
                    ) : (
                        <Table striped bordered hover responsive className="mt-3">
                            <thead>
                                <tr>
                                    <th>Student #</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Program</th>
                                    <th>Role</th>
                                    <th style={{ width: "180px" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((s) => (
                                    <tr key={s._id}>
                                        <td>{s.studentNumber}</td>
                                        <td>
                                            {s.firstName} {s.lastName}
                                        </td>
                                        <td>{s.email}</td>
                                        <td>{s.program}</td>
                                        <td>{s.role}</td>
                                        <td>
                                            <Row className="g-2">
                                                <Col xs={6}>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="w-100"
                                                        onClick={() => handleEdit(s._id)}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Col>
                                                <Col xs={6}>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="w-100"
                                                        onClick={() => handleDelete(s._id)}
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
            </Container>
        </>
    );
}
