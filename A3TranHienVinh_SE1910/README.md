# FU Mini Hotel Management System - Assignment 03 (SBA301)

> **Môn học:** SBA301 - Integrate Single Page Application with Spring Boot  
> **Sinh viên:** Trần Hiển Vinh (MSSV: CE190881)  
> **Lớp:** SE1910  
> **Chủ đề:** Assignment 03 - Securing REST Services with Spring Boot & JSON Web Token (JWT)  
> **Database:** `A3TranHienVinh_SE1910`  

---

## 📌 Tổng quan dự án (Project Overview)

Hệ thống **FUMiniHotelSystem** là giải pháp quản lý khách sạn và đặt phòng trực tuyến hiện đại được xây dựng theo chuẩn Full-Stack:
- **Backend:** Spring Boot 3.2.x RESTful API áp dụng kiến trúc 3-Layer Architecture (Controller, Service, Repository, DTO, Entity).
- **Security & JWT:** Tích hợp Spring Security 6 và JSON Web Token (JJWT 0.12.6) để bảo mật toàn diện các RESTful API.
- **Cấu hình tài khoản Staff:** Tài khoản quản trị nhân viên (Staff) được cấu hình trực tiếp từ file `application.properties` theo đúng yêu cầu đề bài.
- **Database:** Microsoft SQL Server với cơ sở dữ liệu `A3TranHienVinh_SE1910` gồm các bảng: `RoomType`, `RoomInformation`, `Customer`, `BookingReservation`, `BookingDetail`.
- **Frontend:** Single Page Application (SPA) xây dựng trên nền **ReactJS (Vite)** kết hợp **React-Bootstrap**, **Bootstrap Icons**, **Axios** và **React Router DOM**.
- **Quy tắc nghiệp vụ đặc thù (Business Rule):** Khi xóa phòng, nếu phòng đã từng phát sinh giao dịch đặt phòng (`BookingDetail`), hệ thống sẽ tự động chuyển trạng thái phòng sang Không hoạt động (`RoomStatus = 0`) thay vì xóa khỏi cơ sở dữ liệu; nếu phòng chưa từng có giao dịch, hệ thống sẽ xóa vĩnh viễn (Hard delete).

---

## 🏗 Kiến trúc hệ thống (Architecture)

```
[Khách vãng lai / Public]    [Khách hàng / Customer]     [Nhân viên / Staff]
          │                            │                          │
          └────────────────────────────┼──────────────────────────┘
                                       ▼
                     [ReactJS Client (Port 5173)]
                  (Vite + React-Bootstrap + Axios)
                                       │
                         HTTP REST Requests + JWT Bearer
                                       │
                                       ▼
                  [Spring Boot 3 RESTful API (Port 8080)]
                   ├── Security Filter Chain & JWT Filter
                   ├── Controller Layer (Endpoints & Validation)
                   ├── Service Layer (Business Rules & Logic)
                   └── Repository Layer (Spring Data JPA)
                                       │
                                       ▼
                   [MS SQL Server: A3TranHienVinh_SE1910]
           (RoomType, RoomInformation, Customer, BookingReservation, BookingDetail)
```

---

## 🔑 Tài khoản thử nghiệm (Test Credentials)

| Phân hệ / Vai trò | Tên tài khoản | Email đăng nhập | Mật khẩu | Nguồn tài khoản | Quyền hạn chính |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Staff (Admin)** | Staff Administrator | `staff@fuminhotel.com` | `@1` | `application.properties` | Quản lý toàn diện: Phòng, Khách hàng, Đơn đặt phòng |
| **Customer** | Nguyễn Văn An | `an.nguyen@fuminhotel.com` | `@1` | Database (`Customer`) | Đặt phòng online, Lịch sử đặt phòng, Quản lý hồ sơ |
| **Customer** | Trần Thị Mai | `mai.tran@fuminhotel.com` | `@1` | Database (`Customer`) | Đặt phòng online, Lịch sử đặt phòng, Quản lý hồ sơ |
| **Customer** | Lê Hoàng Nam | `nam.le@fuminhotel.com` | `@1` | Database (`Customer`) | Đặt phòng online, Lịch sử đặt phòng, Quản lý hồ sơ |
| **Customer** | Phạm Quỳnh Trang | `trang.pham@fuminhotel.com` | `@1` | Database (`Customer`) | Đặt phòng online, Lịch sử đặt phòng, Quản lý hồ sơ |
| **Public / Guest** | Khách xem phòng | *(Không cần đăng nhập)* | *(None)* | Public Endpoints | Xem danh sách phòng Active, tìm kiếm, xem chi tiết phòng |

> 💡 **Tiện ích 1-Click:** Trên giao diện Đăng nhập có sẵn các nút bấm **"👑 Staff"**, **"👤 Khách hàng"** để tự động điền tài khoản mẫu chỉ bằng 1 cú click!

---

## 🎯 Các chức năng & Quy tắc nghiệp vụ (Features & Business Rules)

### 1. Phân hệ Khách vãng lai (Public Room Portal)
- **Không yêu cầu xác thực** để xem danh sách phòng nghỉ (`RoomStatus = 1`).
- Tìm kiếm phòng theo số phòng, từ khóa mô tả hoặc lọc theo Hạng phòng (`RoomType`).
- Xem chi tiết thông số phòng (sức chứa, giá thuê/ngày, tiện nghi) thông qua Popup Modal.
- Nút "Đặt phòng ngay" tự động điều hướng sang đăng nhập nếu chưa đăng nhập.

### 2. Phân hệ Nhân viên (Staff Role)
- **Quản lý phòng (Room Information Management):**
  - Hiển thị danh sách tất cả các phòng kèm huy hiệu nhận biết phòng đã có lịch sử đặt hay chưa.
  - Thêm mới phòng và Cập nhật thông tin phòng bằng Popup Dialog Modal.
  - **Quy tắc nghiệp vụ cốt lõi (Business Rule theo đề bài):**
    - Nếu phòng **đã từng phát sinh giao dịch đặt phòng** (`BookingDetail`): Nút xóa sẽ hiển thị thông báo và chuyển trạng thái phòng sang `RoomStatus = 0` (Inactive/Không hoạt động), giữ nguyên lịch sử giao dịch.
    - Nếu phòng **chưa từng có giao dịch nào** (ví dụ phòng `STD-103`): Hệ thống thực hiện xóa vĩnh viễn (Hard delete).
- **Quản lý khách hàng (Customer Management):**
  - Xem danh sách khách hàng, tìm kiếm theo tên, email, số điện thoại.
  - Thêm mới & Cập nhật khách hàng bằng Popup Modal.
  - Vô hiệu hóa hoặc xóa khách hàng kèm xác nhận.
- **Quản lý đặt phòng (Booking Reservation Management):**
  - Xem danh sách toàn bộ các đơn đặt phòng kèm chi tiết các phòng, ngày check-in, check-out, thành tiền.
  - Tạo đơn đặt phòng trực tiếp tại quầy (Walk-in) cho khách hàng.
  - Cập nhật trạng thái đơn (Xác nhận / Đã hủy).

### 3. Phân hệ Khách hàng (Customer Role)
- **Đăng ký tài khoản mới:** Đăng ký thành viên với kiểm tra tính duy nhất của email, định dạng số điện thoại và mật khẩu.
- **Đặt phòng trực tuyến (Online Booking Reservation):**
  - Chọn ngày nhận phòng (Check-in) và ngày trả phòng (Check-out).
  - Tự động tính toán số đêm lưu trú.
  - Cho phép **chọn một hoặc nhiều phòng cùng lúc** trong một giao dịch.
  - Tự động tính tổng tiền theo đơn giá từng phòng và số đêm.
- **Quản lý hồ sơ cá nhân:** Xem thông tin cá nhân, cập nhật họ tên, số điện thoại, ngày sinh và đổi mật khẩu an toàn.
- **Lịch sử đặt phòng (Booking History):**
  - Xem danh sách các đơn đã đặt và chi tiết phòng tương ứng.
  - Hỗ trợ hủy đơn đặt phòng khi cần.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (How to Run)

### 1. Khởi tạo Cơ sở dữ liệu (Database Setup)
1. Đảm bảo dịch vụ SQL Server đang chạy.
2. Thực thi file SQL script tạo database và nạp dữ liệu mẫu:
   ```powershell
   sqlcmd -S localhost -U sa -P 123456 -i "d:\KY7\SBA301\SBA\A3TranHienVinh_SE1910\database\A3TranHienVinh_SE1910.sql"
   ```
3. Cấu hình kết nối nằm tại: `backend/src/main/resources/application.properties`.

### 2. Khởi chạy Backend (Spring Boot 3)
```powershell
cd d:\KY7\SBA301\SBA\A3TranHienVinh_SE1910\backend
mvn spring-boot:run
```
- RESTful API sẽ khởi chạy tại: `http://localhost:8080`
- Kiểm tra endpoint public: `http://localhost:8080/api/rooms/public`

### 3. Khởi chạy Frontend (ReactJS)
```powershell
cd d:\KY7\SBA301\SBA\A3TranHienVinh_SE1910\frontend
npm run dev
```
- Mở trình duyệt tại: `http://localhost:5173`

---

## 🧪 Kiểm thử với Postman

- File Postman Collection đã được cấu hình sẵn tại:  
  [`A3TranHienVinh_SE1910.postman_collection.json`](A3TranHienVinh_SE1910.postman_collection.json)
- Bộ kiểm thử bao gồm:
  1. `Authentication`: Login Staff (application.properties), Login Customer, Register.
  2. `Public Endpoints`: Danh sách phòng active, tìm kiếm phòng, chi tiết phòng, danh mục hạng phòng.
  3. `Customer Endpoints`: Xem profile, cập nhật profile, đổi mật khẩu, đặt nhiều phòng online, xem lịch sử đặt phòng, hủy đơn.
  4. `Staff Endpoints`: CRUD phòng, kiểm thử quy tắc xóa phòng (phòng có giao dịch -> chuyển Inactive, phòng chưa có -> xóa vĩnh viễn), CRUD khách hàng, quản lý đơn đặt phòng.

---

## 📁 Cấu trúc thư mục dự án

```
A3TranHienVinh_SE1910/
├── backend/                                       # Spring Boot 3 RESTful API
│   ├── pom.xml                                   # Web, JPA, Security, JJWT, MSSQL
│   └── src/
│       ├── main/
│       │   ├── java/com/fpt/sba301/a3/
│       │   │   ├── A3TranHienVinhApplication.java
│       │   │   ├── config/                       # SecurityConfig, StaffProperties, PasswordEncoderConfig
│       │   │   ├── controller/                   # Auth, PublicRoom, Room, Customer, Booking, CustomerSelf
│       │   │   ├── dto/                          # Request & Response DTOs
│       │   │   ├── entity/                       # RoomType, RoomInformation, Customer, BookingReservation, BookingDetail
│       │   │   ├── exception/                    # GlobalExceptionHandler, Custom Exceptions
│       │   │   ├── repository/                   # Spring Data JPA Repositories
│       │   │   ├── security/                     # JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService
│       │   │   └── service/                      # Services & Implementations
│       │   └── resources/
│       │       └── application.properties        # SQL Server & Staff Credentials config
│       └── test/                                 # Unit & Integration tests
├── frontend/                                      # ReactJS Vite Client
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/                                  # Axios client & endpoints (auth, room, customer, booking)
│       ├── components/                           # HeaderNav, Footer, ProtectedRoute, ConfirmModal
│       ├── context/                              # AuthContext (JWT, Login, Logout, User Roles)
│       ├── pages/                                # HomePage, LoginPage, RegisterPage, ProfilePage, OnlineBookingPage, MyBookingsPage
│       └── pages/staff/                          # StaffRoomsPage, StaffCustomersPage, StaffBookingsPage
├── database/
│   └── A3TranHienVinh_SE1910.sql                 # SQL Script tạo database & seed data
├── A3TranHienVinh_SE1910.postman_collection.json # Bộ Postman collection kiểm thử API
└── README.md                                      # Tài liệu dự án hoàn chỉnh
```

