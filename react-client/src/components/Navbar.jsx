import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Student & Course System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center">

            {!user && (
              <Nav.Link as={Link} to="/">Login</Nav.Link>
            )}

            {user && (
              <>
                <Badge bg={user.role === "admin" ? "danger" : "primary"} className="me-3">
                  {user.role.toUpperCase()} MODE
                </Badge>

                {user.role === "admin" && (
                  <NavDropdown title="Management" id="admin-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/students">
                      Students Directory
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/courses">
                      Course Catalog
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                <Nav.Link as={Link} to="/student/courses">My Courses</Nav.Link>
                <Nav.Link as={Link} to="/student/profile">My Profile</Nav.Link>
                <Nav.Link onClick={logout} className="text-warning">Logout</Nav.Link>
              </>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
