import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, InputGroup, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import { categoryApi } from '../api/categoryApi';
import ConfirmationModal from '../components/ConfirmationModal';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    categoryID: '',
    categoryName: '',
    categoryDesciption: '',
    parentCategoryID: '',
    isActive: true,
  });

  // Delete State
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryApi.getAll(query);
      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCategories(searchTerm);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      categoryID: '',
      categoryName: '',
      categoryDesciption: '',
      parentCategoryID: '',
      isActive: true,
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setFormData({
      categoryID: cat.categoryID,
      categoryName: cat.categoryName || '',
      categoryDesciption: cat.categoryDesciption || '',
      parentCategoryID: cat.parentCategoryID || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      categoryName: formData.categoryName.trim(),
      categoryDesciption: formData.categoryDesciption.trim(),
      parentCategoryID: formData.parentCategoryID ? Number(formData.parentCategoryID) : null,
      isActive: Boolean(formData.isActive),
    };

    try {
      if (isEditing) {
        await categoryApi.update(formData.categoryID, payload);
        setSuccess(`Category '${payload.categoryName}' updated successfully!`);
      } else {
        await categoryApi.create(payload);
        setSuccess(`Category '${payload.categoryName}' created successfully!`);
      }
      setShowModal(false);
      fetchCategories(searchTerm);
    } catch (err) {
      setError(err.message || 'Error occurred while saving category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCategory) return;
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await categoryApi.delete(deleteCategory.categoryID);
      setSuccess(`Category '${deleteCategory.categoryName}' deleted successfully.`);
      setDeleteCategory(null);
      fetchCategories(searchTerm);
    } catch (err) {
      setError(err.message || 'Cannot delete category due to associated news articles.');
      setDeleteCategory(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-tags-fill text-success me-2"></i> Category Management
          </h2>
          <p className="text-muted small mb-0">
            Staff role: Manage news categories. Categories containing news articles cannot be deleted as per business rules.
          </p>
        </div>
        <Button variant="success" className="rounded-pill px-4 shadow-sm fw-semibold" onClick={openCreateModal}>
          <i className="bi bi-plus-circle me-1"></i> Add New Category
        </Button>
      </div>

      {/* Notifications */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-3 shadow-sm">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')} className="rounded-3 shadow-sm">
          <i className="bi bi-check-circle-fill me-2"></i> {success}
        </Alert>
      )}

      {/* Search Bar */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-0">
                <i className="bi bi-search text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search categories by name..."
                className="bg-light border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="success" type="submit" className="px-4">
                Search
              </Button>
              {searchTerm && (
                <Button
                  variant="light"
                  onClick={() => {
                    setSearchTerm('');
                    fetchCategories('');
                  }}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {/* Category Table */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <div className="mt-2 text-muted">Loading categories...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-folder-x display-4"></i>
              <div className="mt-2 fw-semibold">No categories found</div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Parent ID</th>
                    <th>Status</th>
                    <th>Deletion Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.categoryID}>
                      <td className="ps-4 fw-bold text-muted">#{cat.categoryID}</td>
                      <td>
                        <span className="fw-bold text-dark">{cat.categoryName}</span>
                      </td>
                      <td className="text-muted small" style={{ maxWidth: '320px' }}>
                        {cat.categoryDesciption}
                      </td>
                      <td>
                        {cat.parentCategoryID ? (
                          <Badge bg="light" text="dark" className="border">
                            Parent #{cat.parentCategoryID}
                          </Badge>
                        ) : (
                          <span className="text-muted small">None (Root)</span>
                        )}
                      </td>
                      <td>
                        {cat.isActive ? (
                          <Badge bg="success" pill>Active</Badge>
                        ) : (
                          <Badge bg="secondary" pill>Inactive</Badge>
                        )}
                      </td>
                      <td>
                        {cat.canDelete ? (
                          <Badge bg="success-subtle" text="success" className="border border-success">
                            <i className="bi bi-check2-circle me-1"></i> Can Delete
                          </Badge>
                        ) : (
                          <Badge bg="warning-subtle" text="danger" className="border border-warning" title="Category contains news articles and cannot be deleted">
                            <i className="bi bi-lock-fill me-1"></i> In Use (Articles Exist)
                          </Badge>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 rounded-3"
                          onClick={() => openEditModal(cat)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </Button>
                        <Button
                          variant={cat.canDelete ? 'outline-danger' : 'light'}
                          size="sm"
                          className="rounded-3"
                          disabled={!cat.canDelete}
                          title={!cat.canDelete ? 'Cannot delete category because it contains news articles' : 'Delete category'}
                          onClick={() => setDeleteCategory(cat)}
                        >
                          <i className="bi bi-trash3 me-1"></i> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create / Edit Popup Dialog Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-5">
            {isEditing ? (
              <>
                <i className="bi bi-pencil-square text-primary me-2"></i> Edit Category #{formData.categoryID}
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle text-success me-2"></i> Create New Category
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Category Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Academic News"
                value={formData.categoryName}
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Description <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Brief description of articles that belong here..."
                value={formData.categoryDesciption}
                onChange={(e) => setFormData({ ...formData, categoryDesciption: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Parent Category</Form.Label>
              <Form.Select
                value={formData.parentCategoryID}
                onChange={(e) => setFormData({ ...formData, parentCategoryID: e.target.value })}
              >
                <option value="">None (Top-Level Category)</option>
                {categories
                  .filter((c) => !isEditing || c.categoryID !== formData.categoryID)
                  .map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      #{c.categoryID} - {c.categoryName}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Check
                type="switch"
                id="category-active-switch"
                label="Active Status (Category will be available for article assignment)"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant={isEditing ? 'primary' : 'success'} type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Category'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={!!deleteCategory}
        onHide={() => setDeleteCategory(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteCategory?.categoryName}"? This action is permanent.`}
        confirmText="Confirm Delete"
        loading={deleting}
      />
    </Container>
  );
};

export default CategoryManagement;
