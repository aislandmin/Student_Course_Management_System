import { Row, Col, Form, Button } from "react-bootstrap";

export default function CourseForm({ register, handleSubmit, onSubmit, errors, saving, editingCourseId, handleCancelEdit }) {
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col md={3}>
                    <Form.Group className="mb-2">
                        <Form.Label>Course Code</Form.Label>
                        <Form.Control
                            {...register("courseCode", { required: "Course code is required" })}
                            isInvalid={!!errors.courseCode}
                        />
                        <Form.Control.Feedback type="invalid">{errors.courseCode?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control
                            {...register("courseName", { required: "Course name is required" })}
                            isInvalid={!!errors.courseName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.courseName?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group className="mb-2">
                        <Form.Label>Section</Form.Label>
                        <Form.Control {...register("section")} />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group className="mb-2">
                        <Form.Label>Semester</Form.Label>
                        <Form.Control {...register("semester")} />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={editingCourseId ? 6 : 12}>
                    <Button type="submit" className="w-100" disabled={saving}>
                        {saving ? "Saving..." : editingCourseId ? "Update Course" : "Add Course"}
                    </Button>
                </Col>
                {editingCourseId && (
                    <Col md={6} className="mt-2 mt-md-0">
                        <Button variant="secondary" className="w-100" type="button" onClick={handleCancelEdit}>
                            Cancel Edit
                        </Button>
                    </Col>
                )}
            </Row>
        </Form>
    );
}
