import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Modal, InputGroup, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { dataService } from '../services/dataService';
import ConfirmDialog from '../components/ConfirmDialog';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ id: '', name: '', status: 1 });
  const [formError, setFormError] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCategories(dataService.getCategories());
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const openAddModal = () => {
    setCurrentCategory({ id: '', name: '', status: 1 });
    setIsEditMode(false);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setCurrentCategory({ ...category });
    setIsEditMode(true);
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!currentCategory.name.trim()) {
      setFormError('Category name is required');
      return;
    }
    if (isEditMode) {
      dataService.updateCategory(currentCategory.id, currentCategory);
    } else {
      const newId = 'c' + Date.now();
      dataService.addCategory({ ...currentCategory, id: newId });
    }
    setShowModal(false);
    loadData();
  };

  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setShowConfirm(true);
  };

  const handleDelete = () => {
    dataService.deleteCategory(categoryToDelete);
    setShowConfirm(false);
    loadData();
  };

  return (
    <div>
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Category Management</h4>
            <Button variant="primary" onClick={openAddModal} className="rounded-3">
              <FaPlus className="me-2" /> Add Category
            </Button>
          </div>

          <InputGroup className="mb-4 w-50">
            <InputGroup.Text className="bg-white"><FaSearch className="text-muted"/></InputGroup.Text>
            <Form.Control
              placeholder="Search categories by name..."
              value={searchTerm}
              onChange={handleSearch}
              className="border-start-0 ps-0"
            />
          </InputGroup>

          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(cat => (
                  <tr key={cat.id}>
                    <td className="text-muted">{cat.id}</td>
                    <td className="fw-semibold">{cat.name}</td>
                    <td>
                      <Badge bg={cat.status === 1 ? 'success' : 'secondary'} pill>
                        {cat.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button variant="outline-primary" size="sm" className="me-2 rounded-circle" onClick={() => openEditModal(cat)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-circle" onClick={() => confirmDelete(cat.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">No categories found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="text-danger mb-3 small">{formError}</div>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={currentCategory.name} 
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select 
                value={currentCategory.status} 
                onChange={(e) => setCurrentCategory({...currentCategory, status: parseInt(e.target.value)})}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Form.Select>
            </Form.Group>
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
        title="Delete Category"
        body="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
};

export default CategoryManagement;
