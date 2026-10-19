import { Container, Nav, Navbar, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/orchids" className="fw-bold d-flex align-items-center gap-2">
          🌸 Orchid Management
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/orchids">Orchids</Nav.Link>
        </Nav>
        <div className="d-flex align-items-center">
          <Badge bg="success">Slot 23 - Chapter 15 Part B</Badge>
        </div>
      </Container>
    </Navbar>
  );
}
