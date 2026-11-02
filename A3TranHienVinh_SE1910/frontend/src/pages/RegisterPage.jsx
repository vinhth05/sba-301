import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng nhập lại.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        customerFullName: formData.customerFullName.trim(),
        telephone: formData.telephone.trim(),
        emailAddress: formData.emailAddress.trim(),
        customerBirthday: formData.customerBirthday || null,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 rounded-4 overflow-hidden">
            <div className="bg-primary text-white p-4 text-center">
              <i className="bi bi-person-plus-fill display-5 mb-2"></i>
              <h3 className="fw-bold mb-1">Đăng Ký Tài Khoản Khách Hàng</h3>
              <p className="small mb-0 opacity-75">Tạo tài khoản để đặt phòng trực tuyến và xem lịch sử đặt phòng</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-person me-1"></i> Họ và tên <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="customerFullName"
                    placeholder="Nguyễn Văn A"
                    value={formData.customerFullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-envelope me-1"></i> Địa chỉ Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="emailAddress"
                    placeholder="name@example.com"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-telephone me-1"></i> Số điện thoại
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="telephone"
                        placeholder="0901234567"
                        value={formData.telephone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-calendar-event me-1"></i> Ngày sinh
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="customerBirthday"
                        value={formData.customerBirthday}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-lock me-1"></i> Mật khẩu <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={2}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-lock-fill me-1"></i> Xác nhận mật khẩu <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  className="w-100 fw-bold shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang xử lý đăng ký...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Đăng Ký Tài Khoản
                    </>
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-muted">Đã có tài khoản? </span>
                <Link to="/login" className="fw-bold text-decoration-none">
                  Đăng nhập tại đây
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;

