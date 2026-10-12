# SBA301 - Lab 05: Orchid Management (Full-Stack SPA)

Dự án gồm 2 phần:
- **backend**: Spring Boot 3 RESTful API kết nối SQL Server qua Spring Data JPA (port 8080).
- **frontend**: ReactJS (Vite) + Bootstrap + Axios (port 5173).

---

## 1. Khởi chạy Backend

### Điều kiện:
- Microsoft SQL Server đang chạy tại `localhost:1433`.
- Đã tạo database `SBA301_OrchidDB` (hoặc cấu hình trong `backend/src/main/resources/application.properties`).

### Chạy Backend:
```bash
cd backend
mvn spring-boot:run
```
Backend API sẽ hoạt động tại: `http://localhost:8080/orchids`

---

## 2. Khởi chạy Frontend

### Cài đặt và chạy:
```bash
cd frontend
npm install
npm run dev
```
Mở trình duyệt: `http://localhost:5173`

---

## 3. Các tính năng đã hoàn thiện (CRUD Orchid)
- **Xem danh sách (GET /orchids/)**: Bảng hiển thị danh sách các loài lan.
- **Thêm mới (POST /orchids/)**: Form tạo lan mới, tự động refresh về danh sách.
- **Chỉnh sửa (PUT /orchids/{id})**: Form tải chi tiết lan theo id và cập nhật.
- **Xóa (DELETE /orchids/{id})**: Xóa bản ghi có dialog xác nhận và refresh lại dữ liệu.
- **Cấu hình CORS**: Đã cho phép `http://localhost:5173` gọi API từ backend.
