# FUNews Management System - Assignment 02 (SBA301)

> **Môn học:** SBA301 - Integrate Single Page Application with Spring Boot  
> **Sinh viên:** Trần Hiển Vinh (MSSV: CE190881)  
> **Lớp:** SE1910  
> **Chủ đề:** Assignment 02 - Implement CRUD Application with RESTful Web Service and ReactJS  
> **Database:** `A2TranHienVinh_SE1910` (hoặc `FUNewsManagementSBA301`)  

---

## 📌 Tổng quan dự án (Project Overview)

Hệ thống **FUNewsManagementSystem** là ứng dụng quản lý, biên tập và xuất bản tin tức dành cho trường đại học (University FU), xây dựng theo mô hình Full-Stack chuẩn mực:
- **Backend:** Spring Boot 3.2.x RESTful API áp dụng kiến trúc 3-Layer (Controller, Service, Repository, DTO, Entity, Exception Handling, CORS).
- **Database:** Microsoft SQL Server với cơ chế quan hệ chặt chẽ giữa `Category`, `NewsArticle`, `Tag`, `NewsTag`, và `SystemAccount`.
- **Frontend:** ReactJS (Vite) + Axios + React-Bootstrap + Bootstrap Icons với giao diện phong cách hiện đại, responsive, dialog popup (modal) và modal xác nhận khi xóa.
- **Tài nguyên hình ảnh:** Toàn bộ bộ sưu tập hình ảnh (`images/`) đã được tích hợp trực tiếp vào ứng dụng và phục vụ làm thumbnail, ảnh minh họa cho các bài viết tin tức.

---

## 🏗 Kiến trúc hệ thống (Architecture)

```
[Khách / Độc giả / Public]   [Nhân viên / Staff]   [Quản trị / Admin]
           │                         │                     │
           └─────────────────────────┼─────────────────────┘
                                     ▼
                   [ReactJS Frontend (Port 5173)]
                  (Vite + React-Bootstrap + Axios)
                                     │
                             HTTP REST Requests
                                     │
                                     ▼
                  [Spring Boot 3 RESTful Web Service (Port 8080)]
                   ├── Controller Layer (Endpoints & Validation)
                   ├── Service Layer (Business Rules & Logic)
                   └── Repository Layer (Spring Data JPA)
                                     │
                                     ▼
                  [MS SQL Server: A2TranHienVinh_SE1910]
                   (Category, NewsArticle, Tag, SystemAccount)
```

---

## 🔑 Tài khoản thử nghiệm (Test Credentials)

| Vai trò (Role) | Họ tên (Account Name) | Email đăng nhập | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- | :--- |
| **Admin (Role = 1)** | Steve Paris | `SteveParis@FUNewsManagement.org` | `@1` | Quản lý tài khoản (Account CRUD, Search, Business Rules) |
| **Staff (Role = 2)** | Emma William | `EmmaWilliam@FUNewsManagement.org` | `@1` | Quản lý bài viết tin tức, Quản lý danh mục, Profile, Lịch sử |
| **Staff (Role = 2)** | Olivia James | `OliviaJames@FUNewsManagement.org` | `@1` | Thao tác tin tức & danh mục |
| **Staff (Role = 2)** | Isabella David | `IsabellaDavid@FUNewsManagement.org` | `@1` | Thao tác tin tức & danh mục |
| **Staff (Role = 2)** | Michael Charlotte | `MichaelCharlotte@FUNewsManagement.org` | `@1` | Thao tác tin tức & danh mục |
| **Guest / Public** | Khách xem tin | *(Không cần đăng nhập)* | *(None)* | Xem toàn bộ bài viết tin tức đang hoạt động (Active) |

> 💡 **Tính năng tiện lợi:** Trang Login có sẵn nút **"Quick Test Accounts"**, bấm vào là tự động điền tài khoản Admin hoặc Staff để đăng nhập ngay mà không cần gõ phím.

---

## 🎯 Các tính năng & Quy tắc nghiệp vụ (Features & Business Rules)

### 1. Phân hệ Độc giả / Khách (Public News Portal)
- Không cần xác thực (No authentication required) vẫn xem được danh sách tin tức đang kích hoạt (`NewsStatus = 1`).
- Tìm kiếm tin tức theo tiêu đề, tóm tắt hoặc nội dung.
- Lọc tin tức theo danh mục (`Category`).
- Xem chi tiết bài viết qua Dialog Modal: hiển thị đầy đủ hình ảnh minh họa từ `images/`, tiêu đề, tác giả, ngày đăng, nội dung chi tiết, nguồn và danh sách tags liên quan.

### 2. Phân hệ Quản trị viên (Admin Role = 1)
- **Account Management (CRUD & Search):**
  - Xem danh sách tài khoản, tìm kiếm theo tên hoặc email.
  - Thêm mới tài khoản bằng Popup Dialog Modal (validate email, mật khẩu, role).
  - Cập nhật tài khoản bằng Popup Dialog Modal.
  - **Quy tắc nghiệp vụ cốt lõi (Business Rule theo đề):** Nếu tài khoản đã từng tạo bất kỳ bài viết tin tức nào (`NewsArticle.CreatedByID = AccountID`), hệ thống **khóa nút xóa hoặc từ chối xóa** và trả về thông báo lỗi 409 Conflict: *"Cannot delete this account because it has created one or more news articles."*

### 3. Phân hệ Nhân viên (Staff Role = 2)
- **Category Management (CRUD & Search):**
  - Quản lý phân cấp danh mục (hỗ trợ chọn Parent Category).
  - Thêm mới và Sửa danh mục bằng Popup Dialog Modal.
  - **Quy tắc nghiệp vụ cốt lõi (Business Rule theo đề):** Nếu danh mục đã có bài viết tin tức thuộc về nó, hệ thống **tuyệt đối không cho phép xóa** và trả về lỗi 409 Conflict: *"Cannot delete this category because it is already associated with one or more news articles."*
- **News Article Management (CRUD & Search):**
  - Thêm mới bài viết bằng Popup Dialog Modal: chọn Category, chọn trạng thái Active, chọn gán nhiều Tags, chọn ảnh đại diện từ kho ảnh `images/`.
  - Cập nhật bài viết bằng Popup Dialog Modal.
  - Xóa bài viết kết hợp Confirmation Modal xác nhận an toàn.
  - Tìm kiếm theo từ khóa, lọc theo danh mục, lọc theo trạng thái Active/Inactive.
- **Staff Profile Management:**
  - Xem và cập nhật họ tên, đổi mật khẩu của chính Staff đang đăng nhập.
- **My News History:**
  - Xem lịch sử toàn bộ các bài viết do chính Staff đang đăng nhập sáng tác (`CreatedByID = current staff id`).

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (How to Run)

### 1. Khởi tạo Cơ sở dữ liệu (Database Setup)
1. Mở SQL Server Management Studio (SSMS) hoặc công cụ chạy SQL.
2. Mở và thực thi file:  
   `A2TranHienVinh_SE1910/database/A2TranHienVinh_SE1910.sql`  
   *(Script sẽ tự động tạo database `A2TranHienVinh_SE1910` cùng đầy đủ dữ liệu mẫu, ràng buộc khóa ngoại và bảng tin tức)*.
3. Kiểm tra cấu hình kết nối tại `backend/src/main/resources/application.properties` (username: `sa`, password: `123456`, port `1433`).

### 2. Chạy Backend (Spring Boot 3)
```bash
cd backend
mvn spring-boot:run
```
- Backend RESTful API sẽ khởi chạy tại: `http://localhost:8080`
- Kiểm tra thử endpoint Public News: `http://localhost:8080/api/news-articles/public/active`

### 3. Chạy Frontend (ReactJS)
```bash
cd frontend
npm install
npm run dev
```
- Mở trình duyệt tại: `http://localhost:5173`

---

## 🧪 Kiểm thử với Postman

- File collection đính kèm tại:  
  [`A2TranHienVinh_SE1910.postman_collection.json`](A2TranHienVinh_SE1910.postman_collection.json)
- Hỗ trợ đầy đủ các request test:
  1. `Authentication`: Login Admin, Login Staff.
  2. `Public News`: Xem tin active, tìm kiếm, xem chi tiết.
  3. `Staff Functions`: Lịch sử tạo tin, CRUD tin tức, CRUD danh mục, kiểm thử chặn xóa danh mục chứa bài viết.
  4. `Admin Functions`: CRUD tài khoản, kiểm thử chặn xóa tài khoản đã tạo bài viết.
  5. `Tags`: Danh sách tags.

---

## 📁 Cấu trúc thư mục dự án

```
A2TranHienVinh_SE1910/
├── backend/                                   # Spring Boot 3 RESTful API
│   ├── pom.xml                               # Dependencies: Web, JPA, Validation, MSSQL
│   └── src/main/
│       ├── java/com/fpt/sba301/a2/
│       │   ├── A2TranHienVinhApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── controller/                   # Auth, Category, News, Account, Tag
│       │   ├── dto/                          # Request / Response DTOs
│       │   ├── entity/                       # JPA Entities
│       │   ├── exception/                    # GlobalExceptionHandler, Custom Exceptions
│       │   ├── repository/                   # Spring Data JPA Repositories
│       │   └── service/                      # Interfaces & Implementations (Business Rules)
│       └── resources/application.properties  # SQL Server configuration
├── frontend/                                  # ReactJS Vite Client
│   ├── public/images/                         # Kho hình ảnh (3mau, 4n, alba, damari, hodiep...)
│   ├── src/
│   │   ├── api/                              # Axios API client modules
│   │   ├── components/                       # Navbar, Footer, ConfirmationModal, ProtectedRoute
│   │   ├── context/                          # AuthContext (User session & roles)
│   │   └── pages/                            # PublicNews, Login, Dashboard, News, Category, Account...
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── A2TranHienVinh_SE1910.sql             # SQL Script tạo database & seed data
├── images/                                    # Thư mục hình ảnh gốc
├── A2TranHienVinh_SE1910.postman_collection.json # Postman collection kiểm thử API
└── README.md                                  # Tài liệu hướng dẫn chi tiết
```
