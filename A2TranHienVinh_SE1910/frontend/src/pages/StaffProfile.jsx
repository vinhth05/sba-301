import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { accountApi } from '../api/accountApi';

const StaffProfile = () => {
  const { user, updateUser } = useAuth();

  const [accountName, setAccountName] = useState(user?.accountName || '');
  const [accountEmail] = useState(user?.accountEmail || '');
  const [accountPassword, setAccountPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (accountPassword && accountPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        accountName: accountName.trim(),
        accountEmail: accountEmail.trim(),
        accountRole: user?.accountRole || 2,
        accountPassword: accountPassword ? accountPassword.trim() : '@1',
      };

      const res = await accountApi.update(user.accountID, payload);
      updateUser({ accountName: res.accountName });
      setSuccess('Profile updated successfully!');
      setAccountPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '720px' }}>
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div
          className="p-4 text-white"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
        >
          <div className="d-flex align-items-center gap-3">
            <span
              className="rounded-circle bg-white text-primary d-inline-flex align-items-center justify-content-center fw-bold fs-3 shadow"
              style={{ width: '60px', height: '60px' }}
            >
              {user?.accountName ? user.accountName.charAt(0).toUpperCase() : 'S'}
            </span>
            <div>
              <h3 className="fw-bold mb-0">{user?.accountName}</h3>
              <div className="small text-light-50" style={{ color: '#bfdbfe' }}>
                {user?.accountEmail} • <Badge bg="light" text="dark" pill>{user?.roleName}</Badge>
              </div>
            </div>
          </div>
        </div>

        <Card.Body className="p-4 p-md-5">
          <h5 className="fw-bold mb-3">Edit Profile Information</h5>
          <p className="text-muted small mb-4">
            Staff role: Update your display name and change your password.
          </p>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')} className="rounded-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess('')} className="rounded-3">
              <i className="bi bi-check-circle-fill me-2"></i> {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Account ID</Form.Label>
                  <Form.Control type="text" value={`#${user?.accountID}`} disabled className="bg-light" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Email Address</Form.Label>
                  <Form.Control type="email" value={accountEmail} disabled className="bg-light" />
                  <Form.Text className="text-muted">Email address cannot be changed directly.</Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="pt-2">
                <Button variant="primary" type="submit" disabled={loading} className="px-4 py-2 rounded-3">
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Changes...
                    </>
                  ) : (
                    'Save Profile Changes'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffProfile;
