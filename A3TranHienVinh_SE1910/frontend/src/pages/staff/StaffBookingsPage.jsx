/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Row, Col, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { bookingApi } from '../../api/bookingApi';
import { customerApi } from '../../api/customerApi';
import { roomApi } from '../../api/roomApi';
import ConfirmModal from '../../components/ConfirmModal';

const StaffBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search & Filter
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Details Modal
  const [detailBooking, setDetailBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Delete Modal
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Create Walk-in Booking Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const getToday = () => new Date().toISOString().split('T')[0];
  const getTomorrow = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  };
  const [createData, setCreateData] = useState({
    customerID: '',
    startDate: getToday(),
    endDate: getTomorrow(),
    selectedRooms: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, customersData, roomsData] = await Promise.all([
        bookingApi.getAllBookings(),
        customerApi.getAllCustomers(),
        roomApi.getPublicRooms(),
      ]);
      setBookings(bookingsData || []);
      setCustomers(customersData || []);
      setRooms(roomsData || []);
      if (customersData && customersData.length > 0) {
        setCreateData((prev) => ({ ...prev, customerID: customersData[0].customerID }));
      }
    } catch (err) {
      setError(err.message || 'Không thể nạp dữ liệu quản lý đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await bookingApi.searchBookings(
        keyword.trim() || undefined,
        undefined,
        statusFilter !== '' ? parseInt(statusFilter, 10) : undefined
      );
      setBookings(data || []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tìm kiếm đơn đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setStatusFilter('');
    loadData();
  };

  const handleToggleRoom = (roomId) => {
    setCreateData((prev) => {
      const exists = prev.selectedRooms.includes(roomId);
      return {
        ...prev,
        selectedRooms: exists
          ? prev.selectedRooms.filter((id) => id !== roomId)
          : [...prev.selectedRooms, roomId],
      };
    });
  };

  const handleCreateWalkIn = async (e) => {
    e.preventDefault();
    if (!createData.customerID) {
      setError('Vui lòng chọn khách hàng.');
      return;
    }
    if (createData.selectedRooms.length === 0) {
      setError('Vui lòng chọn ít nhất một phòng.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const start = new Date(createData.startDate);
      const end = new Date(createData.endDate);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

      const payload = {
        customerID: parseInt(createData.customerID, 10),
        bookingDate: getToday(),
        bookingDetails: createData.selectedRooms.map((roomId) => {
          const room = rooms.find((r) => r.roomID === roomId);
          const price = Number(room.roomPricePerDay) * days;
          return {
            roomID: roomId,
            startDate: createData.startDate,
            endDate: createData.endDate,
            actualPrice: price,
          };
        }),
      };

      await bookingApi.createBooking(payload);
      setSuccess('Tạo đơn đặt phòng trực tiếp (Walk-in) thành công!');
      setShowCreateModal(false);
      setCreateData({
        customerID: customers[0]?.customerID || '',
        startDate: getToday(),
        endDate: getTomorrow(),
        selectedRooms: [],
      });
      loadData();
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo đơn đặt phòng.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await bookingApi.updateStatus(id, status);
      setSuccess(`Cập nhật trạng thái đơn #${id} thành công!`);
      loadData();
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật trạng thái đơn.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await bookingApi.deleteBooking(deletingId);
      setSuccess(res.message || 'Đã xóa đơn đặt phòng thành công.');
      setShowDeleteModal(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Lỗi khi xóa đơn đặt phòng.');
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
            <i className="bi bi-calendar-check-fill text-primary me-2"></i>
            Quản Lý Đặt Phòng (Booking Reservations)
          </h2>
          <p className="text-muted mb-0">Theo dõi, tạo đơn tại quầy, duyệt trạng thái và quản lý chi tiết đặt phòng</p>
        </div>
        <Button variant="success" className="fw-bold" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle me-2"></i> Tạo Đơn Đặt Tại Quầy (Walk-in)
        </Button>
      </div>

      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* Search & Filter */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <Row className="g-2">
              <Col md={7}>
                <Form.Control
                  type="text"
                  placeholder="Tìm theo tên khách hàng, email, hoặc mã đơn..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="1">Đã Xác Nhận (Active)</option>
                  <option value="0">Đã Hủy (Cancelled)</option>
                </Form.Select>
              </Col>
              <Col md={2} className="d-flex gap-2">
                <Button type="submit" variant="primary" className="flex-fill">
                  Tìm
                </Button>
                <Button type="button" variant="outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Bookings Table */}
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải danh sách đặt phòng...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted display-4"></i>
              <h5 className="mt-3 text-muted">Chưa có đơn đặt phòng nào</h5>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Mã Đơn</th>
                  <th>Ngày Đặt</th>
                  <th>Khách Hàng</th>
                  <th>Số Phòng</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th className="text-end">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingReservationID}>
                    <td>
                      <strong className="text-primary">#RES-{b.bookingReservationID}</strong>
                    </td>
                    <td>{b.bookingDate}</td>
                    <td>
                      <div>
                        <strong>{b.customerFullName}</strong>
                      </div>
                      <small className="text-muted">{b.customerEmail}</small>
                    </td>
                    <td>
                      <Badge bg="info" text="dark" className="px-2 py-1">
                        {b.bookingDetails?.length || 0} phòng
                      </Badge>
                    </td>
                    <td>
                      <strong className="text-danger">{formatCurrency(b.totalPrice)}</strong>
                    </td>
                    <td>
                      {b.bookingStatus === 1 ? (
                        <Badge bg="success" className="px-2 py-1">
                          Đã Xác Nhận
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="px-2 py-1">
                          Đã Hủy
                        </Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setDetailBooking(b);
                            setShowDetailModal(true);
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        {b.bookingStatus === 1 ? (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            title="Hủy đơn"
                            onClick={() => handleUpdateStatus(b.bookingReservationID, 0)}
                          >
                            <i className="bi bi-x-octagon"></i>
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            title="Kích hoạt lại"
                            onClick={() => handleUpdateStatus(b.bookingReservationID, 1)}
                          >
                            <i className="bi bi-check-circle"></i>
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          title="Xóa đơn"
                          onClick={() => {
                            setDeletingId(b.bookingReservationID);
                            setShowDeleteModal(true);
                          }}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        {detailBooking && (
          <>
            <Modal.Header closeButton className="bg-dark text-white">
              <Modal.Title className="fs-5 d-flex align-items-center gap-2">
                <i className="bi bi-receipt text-warning"></i>
                <span>Chi Tiết Đơn Đặt Phòng #RES-{detailBooking.bookingReservationID}</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Row className="mb-3 bg-light p-3 rounded">
                <Col md={6}>
                  <p className="mb-1">
                    <strong>Khách hàng:</strong> {detailBooking.customerFullName}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {detailBooking.customerEmail}
                  </p>
                  <p className="mb-0">
                    <strong>Số điện thoại:</strong> {detailBooking.customerPhone || 'Chưa cập nhật'}
                  </p>
                </Col>
                <Col md={6} className="text-md-end">
                  <p className="mb-1">
                    <strong>Ngày đặt:</strong> {detailBooking.bookingDate}
                  </p>
                  <p className="mb-1">
                    <strong>Trạng thái:</strong>{' '}
                    {detailBooking.bookingStatus === 1 ? (
                      <Badge bg="success">Đã Xác Nhận</Badge>
                    ) : (
                      <Badge bg="secondary">Đã Hủy</Badge>
                    )}
                  </p>
                  <p className="mb-0">
                    <strong>Tổng tiền:</strong>{' '}
                    <span className="text-danger fw-bold fs-5">{formatCurrency(detailBooking.totalPrice)}</span>
                  </p>
                </Col>
              </Row>

              <h6 className="fw-bold mb-3">Danh sách phòng ({detailBooking.bookingDetails?.length || 0}):</h6>
              <Table responsive bordered hover size="sm" className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Số Phòng</th>
                    <th>Hạng Phòng</th>
                    <th>Nhận Phòng</th>
                    <th>Trả Phòng</th>
                    <th>Số Đêm</th>
                    <th className="text-end">Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {detailBooking.bookingDetails?.map((detail, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{detail.roomNumber}</strong>
                      </td>
                      <td>{detail.roomTypeName}</td>
                      <td>{detail.startDate}</td>
                      <td>{detail.endDate}</td>
                      <td>{detail.totalDays} đêm</td>
                      <td className="text-end text-danger fw-semibold">{formatCurrency(detail.actualPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Create Walk-In Booking Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fs-5 d-flex align-items-center gap-2">
            <i className="bi bi-calendar-plus"></i>
            <span>Tạo Đơn Đặt Phòng Tại Quầy (Walk-in Booking)</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateWalkIn}>
          <Modal.Body className="p-4">
            <Row className="g-3 mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Chọn khách hàng <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={createData.customerID}
                    onChange={(e) => setCreateData({ ...createData, customerID: e.target.value })}
                    required
                  >
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map((c) => (
                      <option key={c.customerID} value={c.customerID}>
                        #{c.customerID} - {c.customerFullName} ({c.emailAddress})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Ngày nhận phòng</Form.Label>
                  <Form.Control
                    type="date"
                    value={createData.startDate}
                    onChange={(e) => setCreateData({ ...createData, startDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Ngày trả phòng</Form.Label>
                  <Form.Control
                    type="date"
                    min={createData.startDate}
                    value={createData.endDate}
                    onChange={(e) => setCreateData({ ...createData, endDate: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Label className="fw-semibold">
              Chọn phòng (Có thể chọn nhiều phòng) <span className="text-danger">*</span>:
            </Form.Label>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }} className="border rounded p-2 mb-3 bg-light">
              {rooms.map((room) => {
                const checked = createData.selectedRooms.includes(room.roomID);
                return (
                  <div
                    key={room.roomID}
                    className={`p-2 border-bottom d-flex justify-content-between align-items-center ${
                      checked ? 'bg-white shadow-sm' : ''
                    }`}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`walkin-room-${room.roomID}`}
                      label={
                        <span>
                          <strong>{room.roomNumber}</strong> - {room.roomTypeName} ({room.roomMaxCapacity} người)
                        </span>
                      }
                      checked={checked}
                      onChange={() => handleToggleRoom(room.roomID)}
                    />
                    <strong className="text-danger">{formatCurrency(room.roomPricePerDay)} / đêm</strong>
                  </div>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button variant="success" type="submit" disabled={submitting || createData.selectedRooms.length === 0}>
              {submitting ? 'Đang tạo...' : 'Xác Nhận Tạo Đơn'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title={`Xác nhận xóa đơn đặt phòng #RES-${deletingId}`}
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn đơn đặt phòng #RES-${deletingId} khỏi cơ sở dữ liệu?`}
        confirmText="Xác nhận xóa"
        confirmVariant="danger"
        loading={deleting}
      />
    </Container>
  );
};

export default StaffBookingsPage;

