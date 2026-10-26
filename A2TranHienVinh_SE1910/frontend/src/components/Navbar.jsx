import React from 'react';
import { Navbar as BsNavbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, isAdmin, isStaff, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2" style={{ backgroundColor: '#0f172a' }}>
      <Container fluid className="px-4">
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center text-white fw-bold rounded-3 shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              fontSize: '1.2rem',
            }}
          >
            FU
          </div>
          <div>
            <div className="fw-bold fs-5 text-white lh-1">FUNews Management</div>
            <small className="text-secondary" style={{ fontSize: '0.72rem' }}>Assignment 02 • SBA301</small>
          </div>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar-nav" />

        <BsNavbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto my-2 my-lg-0 align-items-lg-center">
            {/* Public News is available to all */}
            <Nav.Link as={Link} to="/" className={`px-3 ${isActive('/') ? 'fw-bold text-warning' : 'text-light'}`}>
              <i className="bi bi-newspaper me-1"></i> Public News
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link as={Link} to="/dashboard" className={`px-3 ${isActive('/dashboard') ? 'fw-bold text-warning' : 'text-light'}`}>
                <i className="bi bi-grid-1x2-fill me-1"></i> Dashboard
              </Nav.Link>
            )}

            {/* Admin Functions */}
            {isAdmin && (
              <Nav.Link as={Link} to="/admin/accounts" className={`px-3 ${isActive('/admin/accounts') ? 'fw-bold text-warning' : 'text-light'}`}>
                <i className="bi bi-people-fill me-1"></i> Account Management
              </Nav.Link>
            )}

            {/* Staff Functions */}
            {isStaff && (
              <>
                <Nav.Link as={Link} to="/staff/categories" className={`px-3 ${isActive('/staff/categories') ? 'fw-bold text-warning' : 'text-light'}`}>
                  <i className="bi bi-tags-fill me-1"></i> Category Management
                </Nav.Link>
                <Nav.Link as={Link} to="/staff/news" className={`px-3 ${isActive('/staff/news') ? 'fw-bold text-warning' : 'text-light'}`}>
                  <i className="bi bi-file-earmark-text-fill me-1"></i> News Management
                </Nav.Link>
                <Nav.Link as={Link} to="/staff/my-history" className={`px-3 ${isActive('/staff/my-history') ? 'fw-bold text-warning' : 'text-light'}`}>
                  <i className="bi bi-clock-history me-1"></i> My News History
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {isAuthenticated ? (
              <NavDropdown
                align="end"
                title={
                  <span className="d-inline-flex align-items-center gap-2 text-white">
                    <span
                      className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: isAdmin ? '#dc2626' : '#2563eb',
                        fontSize: '0.85rem',
                      }}
                    >
                      {user.accountName ? user.accountName.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="fw-semibold">{user.accountName}</span>
                    <Badge bg={isAdmin ? 'danger' : 'primary'} pill>
                      {user.roleName}
                    </Badge>
                  </span>
                }
                id="user-nav-dropdown"
              >
                <div className="px-3 py-2 border-bottom">
                  <div className="fw-bold">{user.accountName}</div>
                  <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                    {user.accountEmail}
                  </div>
                </div>

                {isStaff && (
                  <NavDropdown.Item as={Link} to="/staff/profile">
                    <i className="bi bi-person-circle me-2 text-primary"></i> My Profile
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-2"></i> Log Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button as={Link} to="/login" variant="warning" className="fw-semibold px-4 text-dark shadow-sm">
                <i className="bi bi-box-arrow-in-right me-1"></i> Staff / Admin Login
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default AppNavbar;
