import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { roomApi } from '../api/roomApi';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected room for detail modal
  const [detailRoom, setDetailRoom] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { isAuthenticated, isCustomer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoomTypes();
    fetchRooms();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const data = await roomApi.getPublicRoomTypes();
      setRoomTypes(data || []);
    } catch (err) {
      console.error('Failed to load room types:', err);
    }
  };

  const fetchRooms = async (searchKeyword = keyword, typeId = selectedType) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchKeyword.trim() || typeId) {
        data = await roomApi.searchPublicRooms(
          searchKeyword.trim() || undefined,
          typeId ? parseInt(typeId, 10) : undefined
        );
      } else {
        data = await roomApi.getPublicRooms();
      }
      setRooms(data || []);
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách phòng.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(keyword, selectedType);
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedType('');
    fetchRooms('', '');
  };

  const openDetail = (room) => {
    setDetailRoom(room);
    setShowDetailModal(true);
  };

  const handleBookNow = (room) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isCustomer) {
      navigate('/book', { state: { preSelectedRoomId: room.roomID } });
    } else {
      alert('Tài khoản Staff vui lòng sử dụng chức năng Quản Lý Đặt Phòng.');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <Container className="py-4">
      {/* Hero Banner */}
      <div className="hotel-hero text-center">
        <h1 className="fw-bold mb-3">Chào mừng đến với FU Mini Hotel</h1>
        <p className="lead mb-4 mx-auto" style={{ maxWidth: '750px' }}>
          Trải nghiệm kỳ nghỉ tuyệt vời với không gian sang trọng, dịch vụ chuẩn mực và giá cả ưu đãi nhất. Khám phá các hạng phòng của chúng tôi ngay hôm nay!
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="warning" size="lg" className="fw-bold px-4" onClick={() => navigate('/book')}>
            <i className="bi bi-calendar-check me-2"></i> Đặt Phòng Ngay
          </Button>
          {!isAuthenticated && (
            <Button variant="outline-light" size="lg" className="px-4" onClick={() => navigate('/register')}>
              <i className="bi bi-person-plus me-2"></i> Trở Thành Khách Hàng
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-3">
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md={5}>
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  <i className="bi bi-search me-1"></i> Tìm kiếm theo số phòng hoặc mô tả:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập số phòng (VD: STD-101, Deluxe, Suite...)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  <i className="bi bi-tag me-1"></i> Hạng phòng:
                </Form.Label>
                <Form.Select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    fetchRooms(keyword, e.target.value);
                  }}
                >
                  <option value="">Tất cả các hạng phòng</option>
                  {roomTypes.map((t) => (
                    <option key={t.roomTypeID} value={t.roomTypeID}>
                      {t.roomTypeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3} className="d-flex gap-2">
                <Button type="submit" variant="primary" className="flex-fill">
                  <i className="bi bi-search me-1"></i> Tìm Kiếm
                </Button>
                <Button type="button" variant="outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Room Listing */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 text-dark">
          <i className="bi bi-door-closed text-primary me-2"></i>
          Danh Sách Phòng Đang Mở Đón Khách ({rooms.length})
        </h4>
        <span className="text-muted small">
          <i className="bi bi-check-circle-fill text-success me-1"></i> Chỉ hiển thị các phòng hoạt động (Active)
        </span>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Đang tải danh sách phòng...</p>
        </div>
      ) : rooms.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <i className="bi bi-inbox text-muted display-4"></i>
            <h5 className="mt-3 text-muted">Không tìm thấy phòng nào phù hợp</h5>
            <Button variant="outline-primary" size="sm" className="mt-2" onClick={handleReset}>
              Xem tất cả các phòng
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {rooms.map((room) => (
            <Col key={room.roomID}>
              <Card className="room-card h-100">
                <div
                  style={{
                    height: '180px',
                    background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    position: 'relative',
                  }}
                >
                  <div className="text-center">
                    <i className="bi bi-door-open fs-1 mb-1"></i>
                    <h4 className="fw-bold mb-0">{room.roomNumber}</h4>
                  </div>
                  <Badge
                    bg="warning"
                    text="dark"
                    className="position-absolute top-0 end-0 m-3 px-3 py-2 fw-semibold"
                  >
                    {room.roomTypeName || 'Tiêu chuẩn'}
                  </Badge>
                </div>

                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small">
                      <i className="bi bi-people-fill text-primary me-1"></i> Sức chứa: <strong>{room.roomMaxCapacity} người</strong>
                    </span>
                    <Badge bg="success" className="px-2 py-1">
                      Hoạt động
                    </Badge>
                  </div>

                  <Card.Text className="text-secondary small flex-grow-1" style={{ minHeight: '48px' }}>
                    {room.roomDetailDescription || 'Phòng đầy đủ tiện nghi tiêu chuẩn cao cấp, dịch vụ dọn phòng hàng ngày.'}
                  </Card.Text>

                  <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted small d-block">Giá mỗi đêm</span>
                      <strong className="text-danger fs-5">{formatCurrency(room.roomPricePerDay)}</strong>
                    </div>
                    <div className="d-flex gap-2">
                      <Button variant="outline-secondary" size="sm" onClick={() => openDetail(room)}>
                        <i className="bi bi-info-circle"></i> Chi Tiết
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleBookNow(room)}>
                        <i className="bi bi-bookmark-check"></i> Đặt Phòng
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Room Detail Dialog Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg">
        {detailRoom && (
          <>
            <Modal.Header closeButton className="bg-primary text-white">
              <Modal.Title className="fs-5 d-flex align-items-center gap-2">
                <i className="bi bi-door-open-fill"></i>
                <span>Chi Tiết Phòng {detailRoom.roomNumber} - {detailRoom.roomTypeName}</span>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div
                    style={{
                      height: '220px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #2c3e50, #3498db)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <i className="bi bi-buildings fs-1 mb-2"></i>
                    <h3 className="fw-bold">{detailRoom.roomNumber}</h3>
                    <Badge bg="warning" text="dark" className="px-3 py-1 fs-6">
                      {detailRoom.roomTypeName}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="fw-bold text-primary mb-3">Thông Tin Chi Tiết</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Số phòng:</strong> <span className="ms-2">{detailRoom.roomNumber}</span>
                    </li>
                    <li className="mb-2">
                      <strong>Hạng phòng:</strong> <span className="ms-2">{detailRoom.roomTypeName}</span>
                    </li>
                    <li className="mb-2">
                      <strong>Sức chứa tối đa:</strong> <span className="ms-2">{detailRoom.roomMaxCapacity} khách</span>
                    </li>
                    <li className="mb-2">
                      <strong>Giá thuê ngày:</strong>{' '}
                      <span className="ms-2 text-danger fw-bold fs-5">{formatCurrency(detailRoom.roomPricePerDay)}</span>
                    </li>
                    <li className="mb-2">
                      <strong>Trạng thái:</strong>{' '}
                      <Badge bg="success" className="ms-2">
                        Đang hoạt động (Sẵn sàng phục vụ)
                      </Badge>
                    </li>
                  </ul>
                  <div className="bg-light p-3 rounded">
                    <strong className="d-block mb-1 text-secondary">Mô tả tiện nghi phòng:</strong>
                    <p className="small mb-0 text-muted">
                      {detailRoom.roomDetailDescription || 'Phòng nghỉ với nội thất tiêu chuẩn quốc tế, máy lạnh hai chiều, minibar, TV thông minh, WiFi tốc độ cao và dịch vụ dọn phòng.'}
                    </p>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setShowDetailModal(false);
                  handleBookNow(detailRoom);
                }}
              >
                <i className="bi bi-bookmark-check me-1"></i> Đặt Phòng Này Ngay
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default HomePage;

