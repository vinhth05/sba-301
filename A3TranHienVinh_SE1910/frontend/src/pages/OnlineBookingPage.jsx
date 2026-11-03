/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { bookingApi } from '../api/bookingApi';
import { useAuth } from '../context/AuthContext';

const OnlineBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const preSelectedId = location.state?.preSelectedRoomId;

  const getToday = () => new Date().toISOString().split('T')[0];
  const getTomorrow = () => {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return tmr.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getToday());
  const [endDate, setEndDate] = useState(getTomorrow());
  const [rooms, setRooms] = useState([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState(preSelectedId ? [preSelectedId] : []);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomApi.getPublicRooms();
      setRooms(data || []);
      if (preSelectedId && !selectedRoomIds.includes(preSelectedId)) {
        setSelectedRoomIds([preSelectedId]);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách phòng.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRoomSelection = (roomId) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalNights = calculateDays();

  const selectedRoomsList = rooms.filter((r) => selectedRoomIds.includes(r.roomID));

  const totalPrice = selectedRoomsList.reduce((sum, r) => {
    return sum + Number(r.roomPricePerDay) * totalNights;
  }, 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedRoomIds.length === 0) {
      setError('Vui lòng chọn ít nhất một phòng để đặt.');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Ngày trả phòng (Check-out) phải sau ngày nhận phòng (Check-in).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookingDate: getToday(),
        bookingDetails: selectedRoomIds.map((roomId) => {
          const room = rooms.find((r) => r.roomID === roomId);
          const price = Number(room.roomPricePerDay) * totalNights;
          return {
            roomID: roomId,
            startDate,
            endDate,
            actualPrice: price,
          };
        }),
      };

      await bookingApi.createBooking(payload);
      navigate('/my-bookings', { state: { successMsg: 'Đặt phòng thành công! Đơn đặt của bạn đã được ghi nhận.' } });
    } catch (err) {
      setError(err.message || 'Đặt phòng thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold mb-1 text-primary">
            <i className="bi bi-calendar-plus me-2"></i>
            Đặt Phòng Trực Tuyến
          </h2>
          <p className="text-muted mb-0">Chọn khoảng thời gian lưu trú và một hoặc nhiều phòng bạn yêu thích</p>
        </div>
        <Badge bg="light" text="dark" className="border px-3 py-2 fs-6">
          Khách hàng: <strong>{user?.fullName || user?.email}</strong>
        </Badge>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Form onSubmit={handleBookingSubmit}>
        <Row className="g-4">
          {/* Left Column: Date Range & Room Selection */}
          <Col lg={8}>
            {/* Step 1: Select Stay Dates */}
            <Card className="shadow-sm border-0 mb-4 rounded-3">
              <Card.Header className="bg-primary text-white fw-semibold">
                <i className="bi bi-1-circle-fill me-2"></i> Bước 1: Chọn ngày nhận và trả phòng
              </Card.Header>
              <Card.Body className="p-3">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-calendar-event me-1"></i> Ngày nhận phòng (Check-in):
                      </Form.Label>
                      <Form.Control
                        type="date"
                        min={getToday()}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-calendar-check me-1"></i> Ngày trả phòng (Check-out):
                      </Form.Label>
                      <Form.Control
                        type="date"
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-2 text-primary small fw-semibold">
                  <i className="bi bi-moon-stars-fill me-1"></i> Tổng số đêm lưu trú: <strong>{totalNights} đêm</strong>
                </div>
              </Card.Body>
            </Card>

            {/* Step 2: Select Rooms */}
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Header className="bg-primary text-white fw-semibold d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-2-circle-fill me-2"></i> Bước 2: Chọn phòng (Có thể chọn nhiều phòng)
                </span>
                <span className="badge bg-warning text-dark">
                  Đã chọn: {selectedRoomIds.length} phòng
                </span>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Đang tải danh sách phòng...</p>
                  </div>
                ) : (
                  <Table responsive hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>Chọn</th>
                        <th>Số Phòng</th>
                        <th>Hạng Phòng</th>
                        <th>Sức Chứa</th>
                        <th>Giá / Đêm</th>
                        <th>Thành Tiền ({totalNights} đêm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((room) => {
                        const isSelected = selectedRoomIds.includes(room.roomID);
                        return (
                          <tr
                            key={room.roomID}
                            onClick={() => toggleRoomSelection(room.roomID)}
                            style={{ cursor: 'pointer' }}
                            className={isSelected ? 'table-primary' : ''}
                          >
                            <td className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // Handled by tr onClick
                              />
                            </td>
                            <td>
                              <strong className="text-dark">{room.roomNumber}</strong>
                            </td>
                            <td>
                              <Badge bg="secondary">{room.roomTypeName}</Badge>
                            </td>
                            <td>
                              <i className="bi bi-person-fill text-muted me-1"></i>
                              {room.roomMaxCapacity} người
                            </td>
                            <td>
                              <span className="text-danger fw-semibold">{formatCurrency(room.roomPricePerDay)}</span>
                            </td>
                            <td>
                              <strong className="text-success">
                                {formatCurrency(Number(room.roomPricePerDay) * totalNights)}
                              </strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Reservation Summary */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 rounded-3 sticky-top" style={{ top: '80px' }}>
              <Card.Header className="bg-dark text-white fw-bold py-3">
                <i className="bi bi-receipt me-2 text-warning"></i> Tóm Tắt Đơn Đặt Phòng
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-muted">Nhận phòng:</span>
                    <strong>{startDate}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-1 small">
                    <span className="text-muted">Trả phòng:</span>
                    <strong>{endDate}</strong>
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Thời gian:</span>
                    <strong>{totalNights} đêm</strong>
                  </div>
                </div>

                <h6 className="fw-bold mb-2">Các phòng đã chọn ({selectedRoomsList.length}):</h6>
                {selectedRoomsList.length === 0 ? (
                  <p className="small text-muted fst-italic">Chưa có phòng nào được chọn.</p>
                ) : (
                  <ul className="list-unstyled mb-3 pb-3 border-bottom small">
                    {selectedRoomsList.map((r) => (
                      <li key={r.roomID} className="d-flex justify-content-between mb-1">
                        <span>
                          <strong>{r.roomNumber}</strong> ({r.roomTypeName})
                        </span>
                        <span className="text-secondary">
                          {formatCurrency(Number(r.roomPricePerDay) * totalNights)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5">Tổng cộng:</span>
                  <span className="text-danger fw-bold fs-4">{formatCurrency(totalPrice)}</span>
                </div>

                <Button
                  variant="warning"
                  type="submit"
                  size="lg"
                  className="w-100 fw-bold shadow text-dark"
                  disabled={submitting || selectedRoomIds.length === 0}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang xử lý đơn đặt...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      Xác Nhận Đặt Phòng
                    </>
                  )}
                </Button>

                <p className="text-center text-muted small mt-3 mb-0">
                  <i className="bi bi-shield-check text-success me-1"></i> Miễn phí hủy trước ngày nhận phòng
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default OnlineBookingPage;

