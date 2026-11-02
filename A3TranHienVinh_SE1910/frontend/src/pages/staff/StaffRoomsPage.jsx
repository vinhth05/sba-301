import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { roomApi } from '../../api/roomApi';
import ConfirmModal from '../../components/ConfirmModal';

const StaffRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search & Filter state
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal: Create or Edit Room
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeID: 1,
    roomStatus: 1,
    roomPricePerDay: 500000,
  });
  const [submitting, setSubmitting] = useState(false);

  // Modal: Delete Confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchTypes();
    fetchRooms();
  }, []);

  const fetchTypes = async () => {
    try {
      const data = await roomApi.getPublicRoomTypes();
      setRoomTypes(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, roomTypeID: data[0].roomTypeID }));
      }
    } catch (err) {
      console.error('Failed to load room types:', err);
    }
  };

  const fetchRooms = async (searchKw = keyword, typeId = typeFilter, statusVal = statusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomApi.searchRooms(
        searchKw.trim() || undefined,
        typeId ? parseInt(typeId, 10) : undefined,
        statusVal !== '' ? parseInt(statusVal, 10) : undefined
      );
      setRooms(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách phòng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(keyword, typeFilter, statusFilter);
  };

  const handleReset = () => {
    setKeyword('');
    setTypeFilter('');
    setStatusFilter('');
    fetchRooms('', '', '');
  };

  // Open Create Dialog
  const handleOpenCreate = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeID: roomTypes.length > 0 ? roomTypes[0].roomTypeID : 1,
      roomStatus: 1,
      roomPricePerDay: 500000,
    });
    setShowFormModal(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity,
      roomTypeID: room.roomTypeID,
      roomStatus: room.roomStatus,
      roomPricePerDay: room.roomPricePerDay,
    });
    setShowFormModal(true);
  };

  // Submit Form (Create or Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingRoom) {
        await roomApi.updateRoom(editingRoom.roomID, formData);
        setSuccess(`Cập nhật thông tin phòng ${formData.roomNumber} thành công!`);
      } else {
        await roomApi.createRoom(formData);
        setSuccess(`Tạo phòng mới ${formData.roomNumber} thành công!`);
      }
      setShowFormModal(false);
      fetchRooms();
    } catch (err) {
      setError(err.message || 'Không thể lưu thông tin phòng.');
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Dialog
  const handleOpenDelete = (room) => {
    setDeletingRoom(room);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingRoom) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await roomApi.deleteRoom(deletingRoom.roomID);
      setSuccess(res.message || 'Thao tác xóa phòng hoàn tất.');
      setShowDeleteModal(false);
      fetchRooms();
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa phòng.');
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <Container className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3 gap-2">
        <div>
          <h2 className="fw-bold mb-1 text-dark">
            <i className="bi bi-grid-fill text-primary me-2"></i>
            Quản Lý Phòng Khách Sạn
          </h2>
          <p className="text-muted mb-0">Xem, tìm kiếm, thêm mới, sửa và xóa phòng theo quy tắc nghiệp vụ</p>
        </div>
        <Button variant="success" className="fw-bold" onClick={handleOpenCreate}>
          <i className="bi bi-plus-circle me-2"></i> Thêm Phòng Mới
        </Button>
      </div>

      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* Filter & Search Bar */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md={4}>
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  <i className="bi bi-search me-1"></i> Số phòng hoặc từ khóa:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số phòng..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  <i className="bi bi-tag me-1"></i> Hạng phòng:
                </Form.Label>
                <Form.Select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    fetchRooms(keyword, e.target.value, statusFilter);
                  }}
                >
                  <option value="">Tất cả hạng phòng</option>
                  {roomTypes.map((t) => (
                    <option key={t.roomTypeID} value={t.roomTypeID}>
                      {t.roomTypeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  <i className="bi bi-toggle-on me-1"></i> Trạng thái:
                </Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    fetchRooms(keyword, typeFilter, e.target.value);
                  }}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="1">Hoạt động (Active)</option>
                  <option value="0">Không hoạt động (Inactive)</option>
                </Form.Select>
              </Col>
              <Col md={2} className="d-flex gap-2">
                <Button type="submit" variant="primary" className="flex-fill">
                  Lọc
                </Button>
                <Button type="button" variant="outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải danh sách phòng...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted display-4"></i>
              <h5 className="mt-3 text-muted">Không tìm thấy phòng nào</h5>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Số Phòng</th>
                  <th>Hạng Phòng</th>
                  <th>Sức Chứa</th>
                  <th>Giá Thuê / Ngày</th>
                  <th>Trạng Thái</th>
                  <th>Giao Dịch</th>
                  <th className="text-end">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.roomID}>
                    <td>#{room.roomID}</td>
                    <td>
                      <strong className="text-primary">{room.roomNumber}</strong>
                    </td>
                    <td>
                      <Badge bg="secondary">{room.roomTypeName}</Badge>
                    </td>
                    <td>{room.roomMaxCapacity} khách</td>
                    <td>
                      <strong className="text-danger">{formatCurrency(room.roomPricePerDay)}</strong>
                    </td>
                    <td>
                      {room.roomStatus === 1 ? (
                        <Badge bg="success" className="px-2 py-1">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="px-2 py-1">
                          Không hoạt động
                        </Badge>
                      )}
                    </td>
                    <td>
                      {room.hasBookings ? (
                        <span className="badge bg-info text-dark" title="Phòng đã có khách đặt trước đây">
                          <i className="bi bi-bookmark-fill me-1"></i> Đã có đơn
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted border">
                          Chưa có đơn
                        </span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => handleOpenEdit(room)}>
                          <i className="bi bi-pencil-square me-1"></i> Sửa
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleOpenDelete(room)}>
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

      {/* Popup Dialog Form Modal (Create / Update) */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered backdrop="static">
        <Modal.Header closeButton className={editingRoom ? 'bg-primary text-white' : 'bg-success text-white'}>
          <Modal.Title className="fs-5 d-flex align-items-center gap-2">
            <i className={editingRoom ? 'bi bi-pencil-square' : 'bi bi-plus-circle'}></i>
            <span>{editingRoom ? `Cập Nhật Phòng ${editingRoom.roomNumber}` : 'Thêm Phòng Khách Sạn Mới'}</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleFormSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Số phòng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="VD: STD-105"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Hạng phòng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={formData.roomTypeID}
                    onChange={(e) => setFormData({ ...formData, roomTypeID: parseInt(e.target.value, 10) })}
                    required
                  >
                    {roomTypes.map((t) => (
                      <option key={t.roomTypeID} value={t.roomTypeID}>
                        {t.roomTypeName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Sức chứa tối đa (người) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={20}
                    value={formData.roomMaxCapacity}
                    onChange={(e) => setFormData({ ...formData, roomMaxCapacity: parseInt(e.target.value, 10) })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Giá thuê mỗi ngày (VND) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="1000"
                    min="1"
                    value={formData.roomPricePerDay}
                    onChange={(e) => setFormData({ ...formData, roomPricePerDay: parseFloat(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Trạng thái phòng</Form.Label>
                  <Form.Select
                    value={formData.roomStatus}
                    onChange={(e) => setFormData({ ...formData, roomStatus: parseInt(e.target.value, 10) })}
                  >
                    <option value={1}>Hoạt động (Active - 1)</option>
                    <option value={0}>Không hoạt động (Inactive - 0)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Mô tả tiện nghi chi tiết</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Mô tả các tiện nghi, hướng view ban công..."
                    value={formData.roomDetailDescription}
                    onChange={(e) => setFormData({ ...formData, roomDetailDescription: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFormModal(false)} disabled={submitting}>
              Hủy Bỏ
            </Button>
            <Button variant={editingRoom ? 'primary' : 'success'} type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : editingRoom ? 'Lưu Thay Đổi' : 'Tạo Mới Phòng'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal with Business Rule Notice */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={`Xác nhận xóa phòng ${deletingRoom?.roomNumber}`}
        message={
          deletingRoom?.hasBookings
            ? `Phòng ${deletingRoom?.roomNumber} đã từng phát sinh giao dịch đặt phòng. Theo đúng quy tắc nghiệp vụ của đề bài: Hệ thống sẽ chuyển trạng thái phòng sang Không hoạt động (Inactive - 0) để bảo toàn dữ liệu lịch sử đặt phòng!`
            : `Bạn có chắc chắn muốn xóa vĩnh viễn phòng ${deletingRoom?.roomNumber}? Phòng này chưa từng có giao dịch nào nên sẽ được xóa khỏi cơ sở dữ liệu.`
        }
        confirmText={deletingRoom?.hasBookings ? 'Chuyển sang Inactive' : 'Xóa vĩnh viễn'}
        confirmVariant="danger"
        loading={deleting}
      />
    </Container>
  );
};

export default StaffRoomsPage;

