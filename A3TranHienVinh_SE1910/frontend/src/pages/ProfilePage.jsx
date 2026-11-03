/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit profile form
  const [fullName, setFullName] = useState('');
  const [telephone, setTelephone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileErr, setProfileErr] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change password form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState(null);
  const [passErr, setPassErr] = useState(null);
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await authApi.getProfile();
      setProfile(data);
      setFullName(data.customerFullName || '');
      setTelephone(data.telephone || '');
      setBirthday(data.customerBirthday || '');
    } catch (err) {
      setProfileErr(err.message || 'Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);
    setUpdatingProfile(true);

    try {
      const updated = await authApi.updateProfile({
        customerFullName: fullName.trim(),
        telephone: telephone.trim(),
        customerBirthday: birthday || null,
      });
      setProfile(updated);
      updateUserProfile({
        fullName: updated.customerFullName,
        telephone: updated.telephone,
      });
      setProfileMsg('Cập nhật hồ sơ thành công!');
    } catch (err) {
      setProfileErr(err.message || 'Cập nhật hồ sơ thất bại.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    setPassErr(null);

    if (newPassword !== confirmPassword) {
      setPassErr('Mật khẩu mới và mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setUpdatingPass(true);
    try {
      const res = await authApi.changePassword({
        oldPassword,
        newPassword,
      });
      setPassMsg(res.message || 'Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassErr(err.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setUpdatingPass(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Đang tải thông tin cá nhân...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* Left Column: Profile Info & Update */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-primary text-white py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-person-lines-fill"></i>
                <span>Hồ Sơ Cá Nhân</span>
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              {profileMsg && <Alert variant="success" dismissible onClose={() => setProfileMsg(null)}>{profileMsg}</Alert>}
              {profileErr && <Alert variant="danger" dismissible onClose={() => setProfileErr(null)}>{profileErr}</Alert>}

              <Form onSubmit={handleUpdateProfile}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Mã khách hàng:</Form.Label>
                    <Form.Control type="text" value={`#CUST-${profile?.customerID}`} disabled className="bg-light" />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="fw-semibold">Email tài khoản:</Form.Label>
                    <Form.Control type="text" value={profile?.emailAddress || ''} disabled className="bg-light" />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Họ và tên <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                      <Form.Control
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Ngày sinh</Form.Label>
                      <Form.Control
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mb-3 text-muted small">
                  <i className="bi bi-check-circle-fill text-success me-1"></i>
                  Tổng số giao dịch đặt phòng đã thực hiện: <strong>{profile?.totalBookings || 0} đơn</strong>
                </div>

                <Button variant="primary" type="submit" disabled={updatingProfile} className="px-4 fw-semibold">
                  {updatingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Change Password */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-dark text-white py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <i className="bi bi-shield-lock-fill text-warning"></i>
                <span>Đổi Mật Khẩu</span>
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              {passMsg && <Alert variant="success" dismissible onClose={() => setPassMsg(null)}>{passMsg}</Alert>}
              {passErr && <Alert variant="danger" dismissible onClose={() => setPassErr(null)}>{passErr}</Alert>}

              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mật khẩu hiện tại</Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={2}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="warning" type="submit" disabled={updatingPass} className="w-100 fw-bold text-dark">
                  {updatingPass ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

