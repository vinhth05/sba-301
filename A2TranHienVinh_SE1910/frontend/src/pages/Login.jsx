import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const loggedUser = await login(email.trim(), password.trim());
      if (loggedUser.accountRole === 1) {
        navigate('/admin/accounts');
      } else {
        navigate('/staff/news');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <div
                className="p-4 text-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center text-white fw-bold rounded-4 mb-3 shadow"
                  style={{
                    width: '54px',
                    height: '54px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    fontSize: '1.6rem',
                  }}
                >
                  FU
                </div>
                <h3 className="fw-bold mb-1">FUNews Management</h3>
                <p className="text-secondary small mb-0">Sign in with your Staff or Administrator account</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="rounded-3 shadow-sm py-2">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small text-muted">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="e.g. SteveParis@FUNewsManagement.org"
                      className="py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small text-muted">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      className="py-2"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-semibold rounded-3 shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                      </>
                    )}
                  </Button>
                </Form>

                {/* Quick Fill Credentials helper */}
                <div className="mt-4 pt-3 border-top text-center">
                  <div className="text-muted small fw-semibold mb-2">QUICK TEST ACCOUNTS:</div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => handleQuickFill('SteveParis@FUNewsManagement.org', '@1')}
                    >
                      <i className="bi bi-shield-lock me-1"></i> Admin (Steve Paris)
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => handleQuickFill('EmmaWilliam@FUNewsManagement.org', '@1')}
                    >
                      <i className="bi bi-person me-1"></i> Staff (Emma William)
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-decoration-none small text-muted">
                    <i className="bi bi-arrow-left me-1"></i> Back to Public News
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
