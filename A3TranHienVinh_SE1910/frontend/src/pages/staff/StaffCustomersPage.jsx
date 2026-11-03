/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { customerApi } from '../../api/customerApi';
import ConfirmModal from '../../components/ConfirmModal';

const StaffCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search
  const [keyword, setKeyword] = useState('');

  // Form Modal (Create / Edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (searchKw = keyword) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchKw.trim()) {
        data = await customerApi.searchCustomers(searchKw.trim());
      } else {
        data = await customerApi.getAllCustomers();
      }
      setCustomers(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(keyword);
  };

  const handleReset = () => {
    setKeyword('');
    fetchCustomers('');
  };

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setFormData({
      customerFullName: '',
      telephone: '',
      emailAddress: '',
      customerBirthday: '',
      customerStatus: 1,
      password: '@1',
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerFullName: customer.customerFullName,
      telephone: customer.telephone || '',
      emailAddress: customer.emailAddress,
      customerBirthday: customer.customerBirthday || '',
      customerStatus: customer.customerStatus,
      password: '', // Blank means keep existing password
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingCustomer) {
        await customerApi.updateCustomer(editingCustomer.customerID, formData);
        setSuccess(`Cập nhật khách hàng ${formData.customerFullName} thành công!`);
      } else {
        await customerApi.createCustomer(formData);
        setSuccess(`Tạo khách hàng mới ${formData.customerFullName} thành công!`);
      }
      setShowFormModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message || 'Lỗi khi lưu thông tin khách hàng.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDelete = (customer) => {
    setDeletingCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await customerApi.deleteCustomer(deletingCustomer.customerID);
      setSuccess(res.message || 'Xóa/Vô hiệu hóa khách hàng thành công.');
      setShowDeleteModal(false);
      fetchCustomers();
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa khách hàng.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3 gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-people-fill text-primary me-2"></i>
            Quản Lý Khách Hàng
          </h2>
          <p className="text-muted mb-0">Xem, tìm kiếm, tạo mới và quản lý thông tin khách hàng của khách sạn</p>
        </div>
        <Button variant="success" className="fw-bold" onClick={handleOpenCreate}>
          <i className="bi bi-person-plus-fill me-2"></i> Thêm Khách Hàng
        </Button>
      </div>

      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* Search Bar */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <Row className="g-2">
              <Col md={10}>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo họ tên, email hoặc số điện thoại..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Col>
              <Col md={2} className="d-flex gap-2">
                <Button type="submit" variant="primary" className="flex-fill">
                  <i className="bi bi-search me-1"></i> Tìm
                </Button>
                <Button type="button" variant="outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Customers Table */}
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải danh sách khách hàng...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted display-4"></i>
              <h5 className="mt-3 text-muted">Không tìm thấy khách hàng nào</h5>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Họ Và Tên</th>
                  <th>Email Đăng Nhập</th>
                  <th>Số Điện Thoại</th>
                  <th>Ngày Sinh</th>
                  <th>Đơn Đặt</th>
                  <th>Trạng Thái</th>
                  <th className="text-end">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.customerID}>
                    <td>#{c.customerID}</td>
                    <td>
                      <strong className="text-dark">{c.customerFullName}</strong>
                    </td>
                    <td>{c.emailAddress}</td>
                    <td>{c.telephone || 'Chưa cập nhật'}</td>
                    <td>{c.customerBirthday || 'Chưa cập nhật'}</td>
                    <td>
                      <Badge bg="info" text="dark" className="px-2 py-1">
                        {c.totalBookings} đơn
                      </Badge>
                    </td>
                    <td>
                      {c.customerStatus === 1 ? (
                        <Badge bg="success" className="px-2 py-1">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="px-2 py-1">
                          Đã khóa
                        </Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => handleOpenEdit(c)}>
                          <i className="bi bi-pencil-square me-1"></i> Sửa
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleOpenDelete(c)}>
                          <i className="bi bi-trash me-1"></i> Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Form Modal (Create / Update Customer) */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered backdrop="static">
        <Modal.Header closeButton className={editingCustomer ? 'bg-primary text-white' : 'bg-success text-white'}>
          <Modal.Title className="fs-5 d-flex align-items-center gap-2">
            <i className={editingCustomer ? 'bi bi-pencil-square' : 'bi bi-person-plus'}></i>
            <span>{editingCustomer ? `Sửa Khách Hàng #${editingCustomer.customerID}` : 'Thêm Mới Khách Hàng'}</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Họ và tên <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.customerFullName}
                onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Địa chỉ Email <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="0901234567"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.customerBirthday}
                    onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Trạng thái tài khoản</Form.Label>
                  <Form.Select
                    value={formData.customerStatus}
                    onChange={(e) => setFormData({ ...formData, customerStatus: parseInt(e.target.value, 10) })}
                  >
                    <option value={1}>Hoạt động (Active - 1)</option>
                    <option value={0}>Không hoạt động (Inactive - 0)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    {editingCustomer ? 'Mật khẩu mới (Bỏ trống nếu giữ nguyên)' : 'Mật khẩu khởi tạo'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={editingCustomer ? 'Giữ nguyên mật khẩu' : 'Mật khẩu'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingCustomer}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFormModal(false)} disabled={submitting}>
              Hủy Bỏ
            </Button>
            <Button variant={editingCustomer ? 'primary' : 'success'} type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : editingCustomer ? 'Lưu Thay Đổi' : 'Tạo Khách Hàng'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={`Xác nhận xóa khách hàng ${deletingCustomer?.customerFullName}`}
        message={
          deletingCustomer?.totalBookings > 0
            ? `Khách hàng ${deletingCustomer?.customerFullName} đã có ${deletingCustomer?.totalBookings} đơn đặt phòng trong hệ thống. Để đảm bảo tính toàn vẹn dữ liệu, tài khoản sẽ được chuyển sang trạng thái Vô hiệu hóa (Inactive).`
            : `Bạn có chắc chắn muốn xóa khách hàng ${deletingCustomer?.customerFullName}? Khách hàng này chưa có đơn đặt phòng nào.`
        }
        confirmText={deletingCustomer?.totalBookings > 0 ? 'Vô hiệu hóa tài khoản' : 'Xóa vĩnh viễn'}
        confirmVariant="danger"
        loading={deleting}
      />
    </Container>
  );
};

export default StaffCustomersPage;

