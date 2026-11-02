import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await login(email.trim(), password.trim());
      if (data.role === 'STAFF') {
        navigate('/staff/rooms');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillCredentials = (testEmail, testPass) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 rounded-4 overflow-hidden">
            <div className="bg-dark text-warning p-4 text-center border-bottom border-warning">
              <i className="bi bi-buildings-fill display-4 mb-2"></i>
              <h3 className="fw-bold mb-1">Đăng Nhập Hệ Thống</h3>
              <p className="text-light small mb-0">Hệ thống Quản lý Khách sạn FU Mini Hotel</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

              {/* Quick Fill Buttons for Grading / Testing */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <span className="small fw-bold text-secondary d-block mb-2">
                  <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Tài khoản kiểm thử nhanh (1-Click Fill):
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="text-dark fw-semibold"
                    onClick={() => fillCredentials('staff@fuminhotel.com', '@1')}
                  >
                    👑 Staff (application.properties)
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => fillCredentials('an.nguyen@fuminhotel.com', '@1')}
                  >
                    👤 Khách hàng (An Nguyễn)
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => fillCredentials('mai.tran@fuminhotel.com', '@1')}
                  >
                    👤 Khách hàng (Mai Trần)
                  </Button>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-envelope me-1"></i> Địa chỉ Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-key me-1"></i> Mật khẩu
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="lg"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 fw-bold shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Đăng Nhập
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-muted">Chưa có tài khoản khách hàng? </span>
                <Link to="/register" className="fw-bold text-decoration-none">
                  Đăng ký tài khoản mới ngay
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

