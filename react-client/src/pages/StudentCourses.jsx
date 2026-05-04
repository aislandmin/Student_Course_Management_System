import { useEffect, useState, useCallback } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Pagination
} from "react-bootstrap";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

export default function StudentCourses() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);        // student's enrolled courses
  const [allCourses, setAllCourses] = useState([]);  // all available courses
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const [selectedCourse, setSelectedCourse] = useState(""); // for Add
  const [sectionTargets, setSectionTargets] = useState({}); // per-course new section
  const [editingCourseId, setEditingCourseId] = useState(null); // which course is in "update section" mode

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [changingId, setChangingId] = useState(null); // which course is being saved

  // Load student's courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/my/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load your courses.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Load all courses with pagination
  const loadAll = useCallback(async (page = 1) => {
    try {
      const res = await api.get(`/courses?page=${page}&limit=100`); // Use a larger limit for the dropdown if needed, or implement search
      setAllCourses(res.data.courses);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to load available courses.", "danger");
    }
  }, [showToast]);

  useEffect(() => {
    loadCourses();
    loadAll();
  }, [loadAll]);

  // Add a new course
  const handleAdd = async () => {
    if (!selectedCourse) {
      showToast("Please select a course to add.", "warning");
      return;
    }

    try {
      setAdding(true);
      await api.post(`/courses/${selectedCourse}/add`);
      showToast("Course added successfully!", "success");
      setSelectedCourse("");
      loadCourses();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Failed to add course.";
      showToast(message, "danger");
    } finally {
      setAdding(false);
    }
  };

  // Drop a course
  const handleDrop = async (id) => {
    if (!window.confirm("Are you sure you want to drop this course?")) return;

    try {
      setDropping(true);
      await api.delete(`/courses/${id}/drop`);
      showToast("Course dropped successfully.", "success");
      loadCourses();
    } catch (err) {
      console.error(err);
      showToast("Failed to drop course.", "danger");
    } finally {
      setDropping(false);
    }
  };

  // Change section
  const handleChangeSection = async (fromCourse) => {
    const fromCourseId = fromCourse._id;
    const toCourseId = sectionTargets[fromCourseId];

    if (!toCourseId) {
      showToast("Please select a new section for this course.", "warning");
      return;
    }

    try {
      setChangingId(fromCourseId);
      await api.post("/courses/changeEnrollment", {
        fromCourseId,
        toCourseId
      });

      showToast("Section updated successfully!", "success");
      setSectionTargets((prev) => ({
        ...prev,
        [fromCourseId]: ""
      }));
      setEditingCourseId(null);
      loadCourses();
    } catch (err) {
      console.error(err);
      showToast("Failed to change section.", "danger");
    } finally {
      setChangingId(null);
    }
  };

  const handleStartEditSection = (course, otherSections) => {
    if (otherSections.length === 0) return;
    setEditingCourseId(course._id);
    setSectionTargets((prev) => ({
      ...prev,
      [course._id]: prev[course._id] || ""
    }));
  };

  const handleCancelEditSection = (courseId) => {
    setEditingCourseId(null);
    setSectionTargets((prev) => ({
      ...prev,
      [courseId]: ""
    }));
  };

  const getOtherSectionsForCourse = (course) => {
    return allCourses.filter(
      (c) =>
        c.courseCode === course.courseCode &&
        c._id !== course._id
    );
  };

  return (
    <>
      <Navbar />

      <Container className="mt-4">
        <h2 className="mb-4">My Courses</h2>

        {/* 1) Add Course */}
        <Card className="p-3 shadow-sm mb-4">
          <Card.Title>Add a Course</Card.Title>
          <Row className="align-items-center mt-2">
            <Col md={8}>
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a course to add...</option>
                {allCourses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.courseCode} - {c.courseName} ({c.section}, {c.semester})
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4} className="mt-2 mt-md-0">
              <Button className="w-100" onClick={handleAdd} disabled={adding}>
                {adding ? "Adding..." : "Add Course"}
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 2) Student's Enrolled Courses */}
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" size="sm" /> Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          <Row>
            {courses.map((course) => {
              const otherSections = getOtherSectionsForCourse(course);
              const selectedTarget = sectionTargets[course._id] || "";
              const isEditing = editingCourseId === course._id;

              return (
                <Col md={4} key={course._id}>
                  <Card className="shadow-sm mb-3">
                    <Card.Body>
                      <Card.Title>{course.courseCode}</Card.Title>
                      <Card.Subtitle className="text-muted mb-2">
                        {course.courseName}
                      </Card.Subtitle>

                      <p className="mb-1">Current Section: {course.section}</p>
                      <p className="mb-3">Semester: {course.semester}</p>

                      {otherSections.length > 0 ? (
                        <>
                          {!isEditing && (
                            <Button
                              variant="info"
                              className="w-100 mb-2"
                              onClick={() =>
                                handleStartEditSection(course, otherSections)
                              }
                            >
                              Update Section
                            </Button>
                          )}

                          {isEditing && (
                            <>
                              <Form.Group className="mb-2">
                                <Form.Label>Change to Section</Form.Label>
                                <Form.Select
                                  value={selectedTarget}
                                  onChange={(e) =>
                                    setSectionTargets((prev) => ({
                                      ...prev,
                                      [course._id]: e.target.value
                                    }))
                                  }
                                >
                                  <option value="">
                                    Select another section...
                                  </option>
                                  {otherSections.map((s) => (
                                    <option key={s._id} value={s._id}>
                                      {s.section} ({s.semester})
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>

                              <Row className="g-2 mb-2">
                                <Col xs={6}>
                                  <Button
                                    variant="success"
                                    className="w-100"
                                    onClick={() => handleChangeSection(course)}
                                    disabled={changingId === course._id}
                                  >
                                    {changingId === course._id
                                      ? "Saving..."
                                      : "Save"}
                                  </Button>
                                </Col>
                                <Col xs={6}>
                                  <Button
                                    variant="outline-secondary"
                                    className="w-100"
                                    onClick={() =>
                                      handleCancelEditSection(course._id)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </Col>
                              </Row>
                            </>
                          )}
                        </>
                      ) : (
                        <p className="text-muted">
                          No other sections available for this course.
                        </p>
                      )}

                      <Button
                        variant="danger"
                        className="w-100"
                        onClick={() => handleDrop(course._id)}
                        disabled={dropping}
                      >
                        {dropping ? "Dropping..." : "Drop Course"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </>
  );
}
