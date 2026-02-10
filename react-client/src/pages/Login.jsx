
import { useState } from "react";
import { Card, Button, Form, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const role = await login(studentNumber, password);
      console.log(role)

      // redirect based on role if you want
      if (role === "admin") {
        navigate("/admin/students");
      } else {
        navigate("/student/courses");
      }
    } catch (err) {
      console.log(err)
      alert("Login failed");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={5}>
          <Card className="shadow-sm" style={{ minWidth: "320px" }}>
            <Card.Body>
              <h3
                className="text-center mb-4"
                // 👇 force normal horizontal text, no weird word-break
                style={{
                  wordBreak: "normal",
                  whiteSpace: "normal",
                  writingMode: "horizontal-tb",
                }}
              >
                Student Login
              </h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="Enter student number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
