/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { bookingApi } from '../api/bookingApi';
import ConfirmModal from '../components/ConfirmModal';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cancel Modal
  const [cancelId, setCancelId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMsg) {
      setSuccess(location.state.successMsg);
    }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingApi.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải lịch sử đặt phòng.');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleOpenCancel = (id) => {
    setCancelId(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setCancelling(true);
    setError(null);
    try {
      const res = await bookingApi.cancelMyBooking(cancelId);
      setSuccess(res.message || 'Đã hủy đơn đặt phòng thành công.');
      setShowCancelModal(false);
      loadBookings();
    } catch (err) {
      setError(err.message || 'Hủy đơn đặt phòng thất bại.');
    } finally {
      setCancelling(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold mb-1 text-primary">
            <i className="bi bi-clock-history me-2"></i>
            Lịch Sử Đặt Phòng Của Tôi
          </h2>
          <p className="text-muted mb-0">Theo dõi toàn bộ các giao dịch đặt phòng và chi tiết lưu trú của bạn</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={loadBookings}>
          <i className="bi bi-arrow-clockwise me-1"></i> Làm Mới
        </Button>
      </div>

      {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Đang tải lịch sử đặt phòng...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x text-muted display-4"></i>
              <h5 className="mt-3 text-muted">Bạn chưa có đơn đặt phòng nào</h5>
              <p className="small text-muted">Khám phá các phòng nghỉ và trải nghiệm dịch vụ của FU Mini Hotel ngay hôm nay!</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Mã Đơn</th>
                  <th>Ngày Đặt</th>
                  <th>Số Phòng Đặt</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th className="text-end">Hành Động</th>
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
                          <i className="bi bi-check-circle me-1"></i> Đã Xác Nhận
                        </Badge>
                      ) : (
                        <Badge bg="secondary" className="px-2 py-1">
                          <i className="bi bi-x-circle me-1"></i> Đã Hủy
                        </Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => openDetails(b)}>
                          <i className="bi bi-eye me-1"></i> Chi Tiết
                        </Button>
                        {b.bookingStatus === 1 && (
                          <Button variant="outline-danger" size="sm" onClick={() => handleOpenCancel(b.bookingReservationID)}>
                            <i className="bi bi-trash me-1"></i> Hủy Đơn
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Booking Details Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        {selectedBooking && (
          <>
            <Modal.Header closeButton className="bg-dark text-white">
              <Modal.Title className="fs-5 d-flex align-items-center gap-2">
                <i className="bi bi-receipt text-warning"></i>
                <span>Chi Tiết Đơn Đặt Phòng #RES-{selectedBooking.bookingReservationID}</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div className="row mb-3 bg-light p-3 rounded">
                <div className="col-md-4">
                  <small className="text-muted d-block">Ngày đặt đơn:</small>
                  <strong>{selectedBooking.bookingDate}</strong>
                </div>
                <div className="col-md-4">
                  <small className="text-muted d-block">Trạng thái:</small>
                  {selectedBooking.bookingStatus === 1 ? (
                    <Badge bg="success">Đã Xác Nhận</Badge>
                  ) : (
                    <Badge bg="secondary">Đã Hủy</Badge>
                  )}
                </div>
                <div className="col-md-4 text-md-end">
                  <small className="text-muted d-block">Tổng thanh toán:</small>
                  <strong className="text-danger fs-5">{formatCurrency(selectedBooking.totalPrice)}</strong>
                </div>
              </div>

              <h6 className="fw-bold mb-3">Danh sách các phòng trong đơn:</h6>
              <Table responsive bordered hover size="sm" className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Số Phòng</th>
                    <th>Hạng Phòng</th>
                    <th>Nhận Phòng</th>
                    <th>Trả Phòng</th>
                    <th>Thời Gian</th>
                    <th className="text-end">Giá Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBooking.bookingDetails?.map((detail, index) => (
                    <tr key={index}>
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

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đặt phòng"
        message={`Bạn có chắc chắn muốn hủy đơn đặt phòng #RES-${cancelId}? Thao tác này sẽ cập nhật trạng thái đơn thành Đã Hủy.`}
        confirmText="Xác nhận hủy"
        confirmVariant="danger"
        loading={cancelling}
      />
    </Container>
  );
};

export default MyBookingsPage;

