import { useState } from "react";
import { Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function StudentForm({ register, handleSubmit, onSubmit, errors, saving, editingStudentId, handleCancelEdit, currentUserId }) {
    const [showPassword, setShowPassword] = useState(false);

    // Industry Level: Prevent an admin from demoting themselves accidentally
    const isSelfEdit = editingStudentId === currentUserId;

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>Student Number</Form.Label>
                        <Form.Control
                            {...register("studentNumber", { required: "Student number is required" })}
                            isInvalid={!!errors.studentNumber}
                            disabled={!!editingStudentId}
                        />
                        <Form.Control.Feedback type="invalid">{errors.studentNumber?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>
                            Password {editingStudentId && <small className="text-muted">(leave blank to keep)</small>}
                        </Form.Label>

                        <InputGroup hasValidation>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: !editingStudentId ? "Password is required" : false,
                                    minLength: { value: 6, message: "Min length 6 characters" }
                                })}
                                isInvalid={!!errors.password}
                            />

                            <InputGroup.Text
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ cursor: "pointer" }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>

                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>Role</Form.Label>
                        <Form.Select 
                            {...register("role")} 
                            disabled={isSelfEdit}
                            title={isSelfEdit ? "You cannot change your own role" : ""}
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
                            {...register("firstName", { required: "First name is required" })}
                            isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            {...register("lastName", { required: "Last name is required" })}
                            isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                            })}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control {...register("phoneNumber")} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-2">
                        <Form.Label>Program</Form.Label>
                        <Form.Control {...register("program")} />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Label>Favorite Topic</Form.Label>
                        <Form.Control 
                            {...register("favoriteTopic")} 
                            placeholder="e.g. React, Node.js, AI"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-2">
                        <Form.Label>Strongest Skill</Form.Label>
                        <Form.Control 
                            {...register("strongestSkill")} 
                            placeholder="e.g. Frontend, Database, Java"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col md={editingStudentId ? 6 : 12}>
                    <Button type="submit" className="w-100" disabled={saving}>
                        {saving ? "Saving..." : editingStudentId ? "Update Student" : "Add Student"}
                    </Button>
                </Col>
                {editingStudentId && (
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
