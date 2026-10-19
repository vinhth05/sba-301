import { Container, Nav, Navbar, Badge } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function AppNavBar() {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm border-bottom border-secondary">
      <Container>
        <Navbar.Brand as={Link} to="/categories" className="fw-bold d-flex align-items-center gap-2">
          <span className="bg-primary text-white px-2 py-1 rounded fs-6">FUNews</span>
          <span>Management System</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/categories"
              className={location.pathname.startsWith("/categories") ? "active fw-semibold text-primary" : ""}
            >
              📂 Categories
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center text-light small gap-2">
            <Badge bg="secondary" className="px-2 py-1">Slot 23 - Chapter 15 Part B</Badge>
            <span className="text-secondary">|</span>
            <span className="text-info fw-semibold">React CRUD Client</span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
