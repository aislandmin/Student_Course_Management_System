import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Student & Course System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">

            {!user && (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}

            {user?.role === "student" && (
              <>
                <Nav.Link as={Link} to="/student/courses">My Courses</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <Nav.Link as={Link} to="/admin/students">Students</Nav.Link>
                <Nav.Link as={Link} to="/admin/courses">Courses</Nav.Link>
                <Nav.Link as={Link} to="/student/courses">My Courses</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
