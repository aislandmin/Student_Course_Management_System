import { useEffect, useState, useCallback } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Spinner,
    Row,
    Col,
    Pagination,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import CourseForm from "../components/CourseForm";
import AppPagination from "../components/AppPagination";

export default function AdminCourses() {
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCourses: 0 });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseStudents, setCourseStudents] = useState([]);

    const [loadingCourses, setLoadingCourses] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            courseCode: "",
            courseName: "",
            section: "",
            semester: "",
        },
    });

    const loadCourses = useCallback(async (page = 1) => {
        try {
            setLoadingCourses(true);
            const res = await api.get(`/courses?page=${page}&limit=10`);
            setCourses(res.data.courses);
            setPagination({
                currentPage: res.data.currentPage,
                totalPages: res.data.totalPages,
                totalCourses: res.data.totalCourses
            });
        } catch (err) {
            console.error(err);
            showToast("Failed to load courses.", "danger");
        } finally {
            setLoadingCourses(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const onSubmit = async (data) => {
        try {
            setSaving(true);
            if (editingCourseId) {
                await api.put(`/courses/${editingCourseId}`, data);
                showToast("Course updated successfully!", "success");
            } else {
                await api.post("/courses", data);
                showToast("Course created successfully!", "success");
            }
            reset();
            setEditingCourseId(null);
            loadCourses(pagination.currentPage);
        } catch (err) {
            console.error(err);
            showToast("Failed to save course.", "danger");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourseId(course._id);
        reset({
            courseCode: course.courseCode,
            courseName: course.courseName,
            section: course.section,
            semester: course.semester,
        });
    };

    const handleCancelEdit = () => {
        setEditingCourseId(null);
        reset();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await api.delete(`/courses/${id}`);
            showToast("Course deleted successfully.", "success");
            loadCourses(pagination.currentPage);
            if (selectedCourse?._id === id) {
                setSelectedCourse(null);
                setCourseStudents([]);
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to delete course.", "danger");
        }
    };

    const handleViewStudents = async (courseId) => {
        const course = courses.find((c) => c._id === courseId) || null;
        setSelectedCourse(course);
        try {
            setLoadingStudents(true);
            const res = await api.get(`/courses/${courseId}/students`);
            setCourseStudents(res.data);
        } catch (err) {
            console.error(err);
            showToast("Failed to load students for this course.", "danger");
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

                <Card className="shadow-sm mb-4 p-3">
                    <Card.Title>{editingCourseId ? "Edit Course" : "Add Course"}</Card.Title>
                    <CourseForm 
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        errors={errors}
                        saving={saving}
                        editingCourseId={editingCourseId}
                        handleCancelEdit={handleCancelEdit}
                    />
                </Card>

                <Card className="shadow-sm mb-4 p-3">
                    <Card.Title>All Courses</Card.Title>
                    {loadingCourses ? (
                        <div className="text-center my-3"><Spinner animation="border" size="sm" /> Loading...</div>
                    ) : courses.length === 0 ? (
                        <p className="mt-3">No courses found.</p>
                    ) : (
                        <>
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
                                                    <Col xs={12} sm={4} md={5}><Button variant="primary" size="sm" className="w-100" onClick={() => handleViewStudents(course._id)}>View Students</Button></Col>
                                                    <Col xs={6} sm={3} md={3}><Button variant="warning" size="sm" className="w-100" onClick={() => handleEdit(course)}>Edit</Button></Col>
                                                    <Col xs={6} sm={3} md={3}><Button variant="danger" size="sm" className="w-100" onClick={() => handleDelete(course._id)}>Delete</Button></Col>
                                                </Row>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <AppPagination 
                                currentPage={pagination.currentPage} 
                                totalPages={pagination.totalPages} 
                                onPageChange={loadCourses} 
                            />
                        </>
                    )}
                </Card>

                <Card className="shadow-sm p-3">
                    <Card.Title>Students Taking {selectedCourse ? `${selectedCourse.courseCode} – ${selectedCourse.courseName}` : "Selected Course"}</Card.Title>
                    {selectedCourse && <Card.Subtitle className="text-muted mb-2">Section {selectedCourse.section} · {selectedCourse.semester}</Card.Subtitle>}
                    {!selectedCourse ? (
                        <p className="mt-3">Select a course above and click <strong>View Students</strong>.</p>
                    ) : loadingStudents ? (
                        <div className="text-center my-3"><Spinner animation="border" size="sm" /> Loading...</div>
                    ) : courseStudents.length === 0 ? (
                        <p className="mt-3">No students enrolled.</p>
                    ) : (
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
                                        <td>{s.firstName} {s.lastName}</td>
                                        <td>{s.email}</td>
                                        <td>{s.program}</td>
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
