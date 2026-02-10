import { useEffect, useState } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner
} from "react-bootstrap";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);        // student's enrolled courses
  const [allCourses, setAllCourses] = useState([]);  // all available courses

  const [selectedCourse, setSelectedCourse] = useState(""); // for Add
  const [sectionTargets, setSectionTargets] = useState({}); // per-course new section
  const [editingCourseId, setEditingCourseId] = useState(null); // which course is in "update section" mode

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [changingId, setChangingId] = useState(null); // which course is being saved
  const [error, setError] = useState("");

  // Load student's courses
  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/courses/my/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  // Load all courses
  const loadAll = async () => {
    try {
      const res = await api.get("/courses");
      setAllCourses(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load available courses.");
    }
  };

  useEffect(() => {
    loadCourses();
    loadAll();
  }, []);

  // Add a new course
  const handleAdd = async () => {
    if (!selectedCourse) {
      setError("Please select a course to add.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      await api.post(`/courses/${selectedCourse}/add`);
      setSelectedCourse("");
      loadCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to add course.");
    } finally {
      setAdding(false);
    }
  };

  // Drop a course
  const handleDrop = async (id) => {
    if (!window.confirm("Are you sure you want to drop this course?")) return;

    try {
      setDropping(true);
      setError("");
      await api.delete(`/courses/${id}/drop`);
      loadCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to drop course.");
    } finally {
      setDropping(false);
    }
  };

  // Change section: move between two offerings of the same courseCode
  const handleChangeSection = async (fromCourse) => {
    const fromCourseId = fromCourse._id;
    const toCourseId = sectionTargets[fromCourseId];

    if (!toCourseId) {
      setError("Please select a new section for this course.");
      return;
    }

    try {
      setChangingId(fromCourseId);
      setError("");
      await api.post("/courses/changeEnrollment", {
        fromCourseId,
        toCourseId
      });

      // Clear selection + editing state for this course
      setSectionTargets((prev) => ({
        ...prev,
        [fromCourseId]: ""
      }));
      setEditingCourseId(null);

      // Reload student's list
      loadCourses();
    } catch (err) {
      console.error(err);
      setError("Failed to change section.");
    } finally {
      setChangingId(null);
    }
  };

  const handleStartEditSection = (course, otherSections) => {
    // If no other sections, nothing to edit
    if (otherSections.length === 0) return;

    setEditingCourseId(course._id);

    // Ensure we have a default value for this course's selection
    setSectionTargets((prev) => ({
      ...prev,
      [course._id]: prev[course._id] || ""
    }));
  };

  const handleCancelEditSection = (courseId) => {
    setEditingCourseId(null);
    // optional: clear selection for this course
    setSectionTargets((prev) => ({
      ...prev,
      [courseId]: ""
    }));
  };

  // Helper: other sections of same courseCode
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

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

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

        {/* 2) Student's Enrolled Courses (with Update Section flow) */}
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

                      {/* Update Section UI */}
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
