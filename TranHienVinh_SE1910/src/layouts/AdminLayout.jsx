import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaTachometerAlt, FaList, FaNewspaper, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { dataService } from '../services/dataService';

const AdminLayout = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = dataService.getCurrentUser();

  const handleLogout = () => {
    dataService.logout();
    setAuth(false);
    navigate('/');
  };

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/admin/categories', name: 'Category', icon: <FaList /> },
    { path: '/admin/news', name: 'News', icon: <FaNewspaper /> },
    { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Header */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/admin/dashboard" className="d-flex align-items-center fw-bold text-uppercase tracking-wider">
             <img src="/logo.jpg" alt="FUNews Logo" height="30" className="me-2 rounded" />
             <span className="text-primary">FUNews</span> <span className="ms-1">Admin</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
             <Navbar.Text className="me-3">
               Signed in as: <span className="fw-bold text-white">{currentUser?.username}</span>
             </Navbar.Text>
             <Button variant="outline-light" size="sm" onClick={handleLogout}>
               <FaSignOutAlt className="me-1" /> Logout
             </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Sidebar */}
        <div className="bg-white border-end shadow-sm" style={{ width: '250px', flexShrink: 0 }}>
          <Nav className="flex-column p-3 h-100">
            {navItems.map((item) => (
              <Nav.Link 
                key={item.path} 
                as={Link} 
                to={item.path} 
                className={`mb-2 rounded px-3 py-2 ${location.pathname.startsWith(item.path) ? 'bg-primary text-white' : 'text-dark hover-bg-light'}`}
                style={{ transition: 'all 0.2s' }}
              >
                <span className="me-2">{item.icon}</span>
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow-1 p-4 overflow-auto bg-light">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
