import { useEffect, useState, useCallback } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Spinner,
    Row,
    Col,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import StudentForm from "../components/StudentForm";
import AppPagination from "../components/AppPagination";

export default function AdminStudents() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [students, setStudents] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalStudents: 0 });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
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
        },
    });

    const loadStudents = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await api.get(`/students?page=${page}&limit=10`);
            setStudents(res.data.students);
            setPagination({
                currentPage: res.data.currentPage,
                totalPages: res.data.totalPages,
                totalStudents: res.data.totalStudents
            });
        } catch (err) {
            console.error(err);
            showToast("Failed to load students.", "danger");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    const onSubmit = async (data) => {
        try {
            setSaving(true);
            const payload = { ...data };

            if (editingStudentId && !payload.password) {
                delete payload.password;
            }

            if (editingStudentId) {
                await api.put(`/students/${editingStudentId}`, payload);
                showToast("Student updated successfully!", "success");
            } else {
                await api.post("/students", payload);
                showToast("Student created successfully!", "success");
            }

            reset();
            setEditingStudentId(null);
            loadStudents(pagination.currentPage);
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Failed to save student.";
            showToast(message, "danger");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = async (studentId) => {
        try {
            const res = await api.get(`/students/${studentId}`);
            const s = res.data;
            reset({
                studentNumber: s.studentNumber,
                password: "",
                firstName: s.firstName,
                lastName: s.lastName,
                address: s.address,
                city: s.city,
                phoneNumber: s.phoneNumber,
                email: s.email,
                program: s.program,
                favoriteTopic: s.favoriteTopic,
                strongestSkill: s.strongestSkill,
                role: s.role,
            });
            setEditingStudentId(studentId);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            console.error(err);
            showToast("Failed to load student details.", "danger");
        }
    };

    const handleCancelEdit = () => {
        setEditingStudentId(null);
        reset();
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/students/${studentId}`);
            showToast("Student deleted successfully.", "success");
            loadStudents(pagination.currentPage);
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || "Failed to delete student.";
            showToast(message, "danger");
        }
    };

    return (
        <>
            <Navbar />
            <Container className="mt-4">
                <h2 className="mb-4">Admin – Students Management</h2>

                <Card className="shadow-sm mb-4 p-3">
                    <h4 className="mb-3">{editingStudentId ? "Edit Student" : "Add Student"}</h4>
                    <StudentForm 
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        errors={errors}
                        saving={saving}
                        editingStudentId={editingStudentId}
                        handleCancelEdit={handleCancelEdit}
                        currentUserId={user?.id}
                    />
                </Card>

                <Card className="shadow-sm p-3">
                    <h4>All Students</h4>
                    {loading ? (
                        <div className="text-center my-3"><Spinner animation="border" size="sm" /> Loading...</div>
                    ) : students.length === 0 ? (
                        <p className="mt-3">No students found.</p>
                    ) : (
                        <>
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
                                            <td>{s.firstName} {s.lastName}</td>
                                            <td>{s.email}</td>
                                            <td>{s.program}</td>
                                            <td>{s.role}</td>
                                            <td>
                                                <Row className="g-2">
                                                    <Col xs={6}><Button variant="warning" size="sm" className="w-100" onClick={() => handleEdit(s._id)}>Edit</Button></Col>
                                                    <Col xs={6}>
                                                        {user?.id !== s._id && (
                                                            <Button variant="danger" size="sm" className="w-100" onClick={() => handleDelete(s._id)}>Delete</Button>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <AppPagination 
                                currentPage={pagination.currentPage} 
                                totalPages={pagination.totalPages} 
                                onPageChange={loadStudents} 
                            />
                        </>
                    )}
                </Card>
            </Container>
        </>
    );
}
