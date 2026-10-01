import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Modal, InputGroup, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { dataService } from '../services/dataService';
import ConfirmDialog from '../components/ConfirmDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: '', username: '', password: '', role: 2, status: 1 });
  const [formError, setFormError] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(dataService.getUsers());
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const openAddModal = () => {
    setCurrentUser({ id: '', username: '', password: '', role: 2, status: 1 });
    setIsEditMode(false);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!currentUser.username.trim() || (!isEditMode && !currentUser.password)) {
      setFormError('Username and password are required');
      return;
    }
    // Simple unique check
    const existing = users.find(u => u.username.toLowerCase() === currentUser.username.toLowerCase() && u.id !== currentUser.id);
    if (existing) {
      setFormError('Username already exists');
      return;
    }

    if (isEditMode) {
      dataService.updateUser(currentUser.id, currentUser);
    } else {
      const newId = 'u' + Date.now();
      dataService.addUser({ ...currentUser, id: newId });
    }
    setShowModal(false);
    loadData();
  };

  const confirmDelete = (id) => {
    // Prevent deleting self (assuming id 'u1' is the initial admin for simplicity, or we can check with current session)
    const activeUserId = dataService.getCurrentUser()?.id;
    if (id === activeUserId) {
      alert("You cannot delete your own account.");
      return;
    }
    setUserToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    dataService.deleteUser(userToDelete);
    setShowConfirm(false);
    loadData();
  };

  return (
    <div>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">User Management</h4>
            <Button variant="primary" onClick={openAddModal} className="rounded-3">
              <FaPlus className="me-2" /> Add User
            </Button>
          </div>

          <InputGroup className="mb-4 w-50">
            <InputGroup.Text className="bg-white"><FaSearch className="text-muted"/></InputGroup.Text>
            <Form.Control
              placeholder="Search users by username..."
              value={searchTerm}
              onChange={handleSearch}
              className="border-start-0 ps-0"
            />
          </InputGroup>

          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td className="fw-semibold">{u.username}</td>
                    <td>
                      <Badge bg={u.role === 1 ? 'danger' : 'info'} pill>
                        {u.role === 1 ? 'Admin' : 'Staff'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={u.status === 1 ? 'success' : 'secondary'} pill>
                        {u.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm" className="me-2 rounded-circle" onClick={() => openEditModal(u)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => confirmDelete(u.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">No users found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="text-danger mb-3 small">{formError}</div>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={currentUser.username} 
                onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>{isEditMode ? 'Password (leave blank to keep current)' : 'Password *'}</Form.Label>
              <Form.Control 
                type="password" 
                value={currentUser.password} 
                placeholder={isEditMode ? "********" : ""}
                onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select 
                    value={currentUser.role} 
                    onChange={(e) => setCurrentUser({...currentUser, role: parseInt(e.target.value)})}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Staff</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={currentUser.status} 
                    onChange={(e) => setCurrentUser({...currentUser, status: parseInt(e.target.value)})}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <ConfirmDialog 
        show={showConfirm} 
        onHide={() => setShowConfirm(false)} 
        onConfirm={handleDelete}
        title="Delete User"
        body="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserManagement;
