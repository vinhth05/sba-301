import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, InputGroup, Modal, Badge, Alert, Spinner } from 'react-bootstrap';
import { accountApi } from '../api/accountApi';
import ConfirmationModal from '../components/ConfirmationModal';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State for Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    accountID: '',
    accountName: '',
    accountEmail: '',
    accountRole: 2, // 1: Admin, 2: Staff
    accountPassword: '',
  });

  // Delete State
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await accountApi.getAll(query);
      setAccounts(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch accounts list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAccounts(searchTerm);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      accountID: '',
      accountName: '',
      accountEmail: '',
      accountRole: 2,
      accountPassword: '',
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (acc) => {
    setIsEditing(true);
    setFormData({
      accountID: acc.accountID,
      accountName: acc.accountName || '',
      accountEmail: acc.accountEmail || '',
      accountRole: acc.accountRole || 2,
      accountPassword: '', // keep blank if not changing
    });
    setError('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await accountApi.update(formData.accountID, {
          accountName: formData.accountName,
          accountEmail: formData.accountEmail,
          accountRole: Number(formData.accountRole),
          accountPassword: formData.accountPassword ? formData.accountPassword : '@1',
        });
        setSuccess(`Account '${formData.accountName}' updated successfully!`);
      } else {
        await accountApi.create({
          accountID: formData.accountID ? Number(formData.accountID) : null,
          accountName: formData.accountName,
          accountEmail: formData.accountEmail,
          accountRole: Number(formData.accountRole),
          accountPassword: formData.accountPassword || '@1',
        });
        setSuccess(`Account '${formData.accountName}' created successfully!`);
      }
      setShowModal(false);
      fetchAccounts(searchTerm);
    } catch (err) {
      setError(err.message || 'Error occurred while saving account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteAccount) return;
    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      await accountApi.delete(deleteAccount.accountID);
      setSuccess(`Account '${deleteAccount.accountName}' deleted successfully.`);
      setDeleteAccount(null);
      fetchAccounts(searchTerm);
    } catch (err) {
      setError(err.message || 'Cannot delete account due to business restrictions.');
      setDeleteAccount(null);
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
            <i className="bi bi-people-fill text-danger me-2"></i> Account Management
          </h2>
          <p className="text-muted small mb-0">
            Admin role: Manage System Accounts (CRUD & Search). Deleting accounts with created articles is restricted by rule.
          </p>
        </div>
        <Button variant="danger" className="rounded-pill px-4 shadow-sm fw-semibold" onClick={openCreateModal}>
          <i className="bi bi-person-plus-fill me-1"></i> Add New Account
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
                placeholder="Search accounts by name or email..."
                className="bg-light border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="primary" type="submit" className="px-4">
                Search
              </Button>
              {searchTerm && (
                <Button
                  variant="light"
                  onClick={() => {
                    setSearchTerm('');
                    fetchAccounts('');
                  }}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {/* Accounts Table */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <div className="mt-2 text-muted">Loading system accounts...</div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x display-4"></i>
              <div className="mt-2 fw-semibold">No accounts found</div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover align="middle" className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Account Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Deletion Status</th>
                    <th className="text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.accountID}>
                      <td className="ps-4 fw-bold text-muted">#{acc.accountID}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold"
                            style={{
                              width: '32px',
                              height: '32px',
                              backgroundColor: acc.accountRole === 1 ? '#ef4444' : '#3b82f6',
                              fontSize: '0.85rem',
                            }}
                          >
                            {acc.accountName ? acc.accountName.charAt(0).toUpperCase() : 'U'}
                          </span>
                          <span className="fw-semibold text-dark">{acc.accountName}</span>
                        </div>
                      </td>
                      <td className="text-muted">{acc.accountEmail}</td>
                      <td>
                        <Badge bg={acc.accountRole === 1 ? 'danger' : 'primary'} pill className="px-3 py-2">
                          {acc.roleName}
                        </Badge>
                      </td>
                      <td>
                        {acc.canDelete ? (
                          <Badge bg="success-subtle" text="success" className="border border-success">
                            <i className="bi bi-shield-check me-1"></i> Eligible for Deletion
                          </Badge>
                        ) : (
                          <Badge bg="warning-subtle" text="danger" className="border border-warning" title="Account created news articles and cannot be deleted">
                            <i className="bi bi-lock-fill me-1"></i> Locked (Created News)
                          </Badge>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 rounded-3"
                          onClick={() => openEditModal(acc)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </Button>
                        <Button
                          variant={acc.canDelete ? 'outline-danger' : 'light'}
                          size="sm"
                          className="rounded-3"
                          disabled={!acc.canDelete}
                          title={!acc.canDelete ? 'Cannot delete account because it created news articles' : 'Delete account'}
                          onClick={() => setDeleteAccount(acc)}
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
                <i className="bi bi-pencil-square text-primary me-2"></i> Edit Account #{formData.accountID}
              </>
            ) : (
              <>
                <i className="bi bi-person-plus-fill text-danger me-2"></i> Create New Account
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Full Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. John Doe"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email Address <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="e.g. johndoe@FUNewsManagement.org"
                value={formData.accountEmail}
                onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">System Role <span className="text-danger">*</span></Form.Label>
              <Form.Select
                value={formData.accountRole}
                onChange={(e) => setFormData({ ...formData, accountRole: Number(e.target.value) })}
              >
                <option value={2}>Staff (Category & News Management)</option>
                <option value={1}>Admin (System Account Management)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">
                Password {isEditing ? <span className="text-muted">(leave blank to keep current)</span> : <span className="text-danger">*</span>}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder={isEditing ? "Enter new password if changing" : "Enter account password"}
                value={formData.accountPassword}
                onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
                required={!isEditing}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant={isEditing ? 'primary' : 'danger'} type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Account'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={!!deleteAccount}
        onHide={() => setDeleteAccount(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete System Account"
        message={`Are you sure you want to permanently delete account "${deleteAccount?.accountName}" (${deleteAccount?.accountEmail})?`}
        confirmText="Confirm Delete"
        loading={deleting}
      />
    </Container>
  );
};

export default AccountManagement;
