import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HeaderNav = () => {
  const { user, isAuthenticated, isStaff, isCustomer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center gap-2 text-warning">
          <i className="bi bi-buildings-fill fs-4"></i>
          <span>FU Mini Hotel System</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              <i className="bi bi-door-open me-1"></i> Danh Sách Phòng
            </Nav.Link>

            {isStaff && (
              <>
                <Nav.Link as={Link} to="/staff/rooms" active={location.pathname === '/staff/rooms'}>
                  <i className="bi bi-grid me-1"></i> Quản Lý Phòng
                </Nav.Link>
                <Nav.Link as={Link} to="/staff/customers" active={location.pathname === '/staff/customers'}>
                  <i className="bi bi-people me-1"></i> Quản Lý Khách Hàng
                </Nav.Link>
                <Nav.Link as={Link} to="/staff/bookings" active={location.pathname === '/staff/bookings'}>
                  <i className="bi bi-calendar2-check me-1"></i> Quản Lý Đặt Phòng
                </Nav.Link>
              </>
            )}

            {isCustomer && (
              <>
                <Nav.Link as={Link} to="/book" active={location.pathname === '/book'}>
                  <i className="bi bi-bookmark-plus me-1"></i> Đặt Phòng Trực Tuyến
                </Nav.Link>
                <Nav.Link as={Link} to="/my-bookings" active={location.pathname === '/my-bookings'}>
                  <i className="bi bi-clock-history me-1"></i> Lịch Sử Đặt Phòng
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" active={location.pathname === '/profile'}>
                  <i className="bi bi-person-circle me-1"></i> Hồ Sơ Cá Nhân
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="text-light d-flex align-items-center gap-2 me-2">
                  <Badge bg={isStaff ? 'warning' : 'info'} text={isStaff ? 'dark' : 'white'} className="px-2 py-1">
                    {isStaff ? 'STAFF (Admin)' : 'CUSTOMER'}
                  </Badge>
                  <span className="fw-semibold small">{user?.fullName || user?.email}</span>
                </div>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i> Đăng Xuất
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-warning" size="sm">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập
                </Button>
                <Button as={Link} to="/register" variant="warning" size="sm">
                  <i className="bi bi-person-plus me-1"></i> Đăng Ký
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderNav;

