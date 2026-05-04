import { useEffect, useState } from "react";
import { Container, Card, Form, Button, Row, Col, Spinner, InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/auth/me");
                reset({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    phoneNumber: res.data.phoneNumber,
                    address: res.data.address,
                    city: res.data.city,
                    program: res.data.program,
                    favoriteTopic: res.data.favoriteTopic,
                    strongestSkill: res.data.strongestSkill,
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                showToast("Failed to load profile.", "danger");
            }
        };
        loadProfile();
    }, [reset, showToast]);

    const onSubmit = async (data) => {
        try {
            setSaving(true);
            const payload = { ...data };
            if (!payload.password) delete payload.password;

            await api.put("/students/me", payload);
            showToast("Profile updated successfully!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to update profile.", "danger");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container className="text-center mt-5">
                    <Spinner animation="border" />
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container className="mt-4">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm p-4">
                            <h2 className="mb-4">My Profile</h2>
                            <p className="text-muted">
                                Update your personal information below. 
                                <br />
                                <strong>Student Number:</strong> {user?.studentNumber}
                            </p>
                            <hr />

                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                {...register("firstName", { required: "First name is required" })}
                                                isInvalid={!!errors.firstName}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
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
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                {...register("email", { required: "Email is required" })}
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control {...register("phoneNumber")} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control {...register("address")} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control {...register("city")} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Program</Form.Label>
                                            <Form.Control {...register("program")} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Favorite Topic</Form.Label>
                                            <Form.Control {...register("favoriteTopic")} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Strongest Skill</Form.Label>
                                            <Form.Control {...register("strongestSkill")} />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Change Password <small className="text-muted">(leave blank to keep current)</small></Form.Label>
                                            <InputGroup>
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    {...register("password", { minLength: { value: 6, message: "Min length 6 characters" } })}
                                                    isInvalid={!!errors.password}
                                                />
                                                <InputGroup.Text 
                                                    onClick={() => setShowPassword(!showPassword)} 
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </InputGroup.Text>
                                                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button type="submit" variant="primary" className="w-100" disabled={saving}>
                                    {saving ? "Saving Changes..." : "Update Profile"}
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
