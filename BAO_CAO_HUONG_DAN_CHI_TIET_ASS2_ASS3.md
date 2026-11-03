# TRƯỜNG ĐẠI HỌC FPT CẦN THƠ
## BỘ MÔN CÔNG NGHỆ THÔNG TIN - KỸ THUẬT PHẦN MỀM
### BÁO CÁO TỔNG HỢP & HƯỚNG DẪN CHI TIẾT ASSIGNMENT 02 VÀ ASSIGNMENT 03
**Môn học:** SBA301 - Integrate Single Page Application with Spring Boot  
**Sinh viên thực hiện:** Trần Hiển Vinh  
**Mã số sinh viên (MSSV):** CE190881  
**Lớp chuyên ngành:** SE1910  

---

## 📌 BẢNG THÔNG TIN ĐỊNH DANH HỌC PHẦN & DỰ ÁN

| Thông tin định danh | Chi tiết cấu hình sinh viên & học phần |
| :--- | :--- |
| **Họ và tên sinh viên** | **Trần Hiển Vinh** |
| **Mã số sinh viên (MSSV)** | **CE190881** |
| **Lớp chuyên ngành** | **SE1910** |
| **Học phần / Khóa học** | SBA301 - Integrate Single Page Application with Spring Boot |
| **Cơ sở đào tạo** | Trường Đại học FPT - Phân hiệu Cần Thơ |
| **Assignment 02 Project** | [`A2TranHienVinh_SE1910`](A2TranHienVinh_SE1910) (FUNewsManagementSystem RESTful API & ReactJS) |
| **Assignment 03 Project** | [`A3TranHienVinh_SE1910`](A3TranHienVinh_SE1910) (FUMiniHotelSystem Spring Security & JWT) |
| **Hệ quản trị cơ sở dữ liệu** | Microsoft SQL Server 2022 (Databases: `A2TranHienVinh_SE1910` & `A3TranHienVinh_SE1910`) |
| **Công nghệ nền tảng** | Java 21 LTS, Spring Boot 3.2.x, NodeJS 20+, ReactJS 18+ (Vite), JJWT 0.12.6 |

---

## 📑 BẢNG SO SÁNH TỔNG QUAN ASSIGNMENT 01, 02 VÀ 03

| Tiêu chí so sánh | Assignment 01 | Assignment 02 | Assignment 03 |
| :--- | :--- | :--- | :--- |
| **Tên hệ thống** | FUNews Management (Frontend) | FUNews Management (Full-Stack) | FU Mini Hotel System |
| **Phạm vi kiến trúc** | Single Page Application (Chỉ Frontend) | Full-Stack (Backend API + React SPA) | Full-Stack (Secured API + React SPA) |
| **Công nghệ Backend** | Không có (Mock Data / LocalStorage) | Spring Boot 3, 3-Layer Architecture, Spring Data JPA | Spring Boot 3, Spring Security 6, JJWT 0.12.6 |
| **Cơ sở dữ liệu** | Mock JSON Data | MS SQL Server (`A2TranHienVinh_SE1910`) | MS SQL Server (`A3TranHienVinh_SE1910`) |
| **Cơ chế xác thực** | Client mock authentication | REST Login (`SystemAccount` DTO) | Stateless JSON Web Token (JWT Bearer) |
| **Nguồn tài khoản Staff**| Dữ liệu hardcoded trong client | Bảng `SystemAccount` trong Database | **Lấy trực tiếp từ `application.properties`** |
| **Quy tắc nghiệp vụ cốt lõi** | CRUD cơ bản Category, News, User | Chặn xóa Account/Category đã có bài viết (409 Conflict) | **Phòng đã có đơn: Soft delete (`RoomStatus = 0`); Chưa có đơn: Hard delete** |
| **Tính năng đặc thù** | Template layout & modal | Gán nhiều Tags, lọc tin Active, xem lịch sử Staff | **Đặt phòng online đa phòng (Multi-room), tự tính đêm & tiền** |

---

# PHẦN I: ASSIGNMENT 02 - FUNEWS MANAGEMENT SYSTEM

## 1. Đề bài & Yêu cầu nghiệp vụ (Requirements)

Hệ thống **FUNewsManagementSystem** là phần mềm quản lý, biên tập và xuất bản tin tức phục vụ nội bộ trường đại học (University FU). Ứng dụng xây dựng theo mô hình Full-Stack chuẩn mực:

> [!IMPORTANT]
> **Quy chuẩn đặt tên và các ràng buộc bắt buộc (Assignment 02):**
> - Tên Database: `A2StudentName_ClassCode` -> `A2TranHienVinh_SE1910`.
> - Tên Project Spring Boot: `A2TranHienVinh_SE1910` (nằm trong thư mục `backend`).
> - Tên Project ReactJS: `A2TranHienVinh_SE1910` (nằm trong thư mục `frontend`).
> - Kiến trúc Backend: 3-Layer Architecture kết hợp Repository Pattern.
> - Thao tác Thêm mới và Cập nhật: Bắt buộc dùng **Popup Dialog Modal**.
> - Thao tác Xóa: Bắt buộc có **Confirmation Modal** xác nhận an toàn.

### Chi tiết các phân hệ chức năng:
1. **Phân hệ Độc giả / Public (Không cần đăng nhập):**
   - Xem toàn bộ danh sách bài viết tin tức đang hoạt động (`NewsStatus = 1`).
   - Tìm kiếm bài viết theo tiêu đề, tóm tắt hoặc nội dung.
   - Lọc bài viết theo danh mục (`Category`).
   - Xem chi tiết bài viết qua Modal Popup: hiển thị ảnh minh họa từ thư mục `images/`, tiêu đề, tác giả, ngày đăng, nội dung chi tiết và danh sách thẻ tags.
2. **Phân hệ Quản trị viên (Admin - Role = 1):**
   - Quản lý tài khoản (Account Management): CRUD & Tìm kiếm tài khoản.
   - **Quy tắc nghiệp vụ cốt lõi 1 (Business Rule 1):** Nếu tài khoản đã từng tạo bất kỳ bài viết tin tức nào (`NewsArticle.CreatedByID = AccountID`), hệ thống **tuyệt đối không cho phép xóa** và trả về mã lỗi 409 Conflict: *"Cannot delete this account because it has created one or more news articles."*
3. **Phân hệ Nhân viên (Staff - Role = 2):**
   - Quản lý danh mục (Category Management): CRUD danh mục tin tức, hỗ trợ phân cấp Parent Category.
   - **Quy tắc nghiệp vụ cốt lõi 2 (Business Rule 2):** Nếu danh mục đang chứa một hoặc nhiều bài viết tin tức (`NewsArticle.CategoryID = CategoryID`), hệ thống **tuyệt đối không cho phép xóa** và trả về mã lỗi 409 Conflict: *"Cannot delete this category because it is already associated with one or more news articles."*
   - Quản lý bài viết tin tức (News Article Management): CRUD bài viết, chọn Category, gán nhiều Tags (quan hệ Many-to-Many qua bảng `NewsTag`), chọn ảnh thumbnail.
   - Quản lý hồ sơ cá nhân (Staff Profile): Cập nhật họ tên, đổi mật khẩu.
   - Lịch sử bài viết của tôi (My News History): Xem danh sách các bài viết do chính Staff đang đăng nhập sáng tác (`CreatedByID = current staff id`).

---

## 2. Solution & Hướng tiếp cận kỹ thuật (Architecture & Design)

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
                  [Spring Boot 3 RESTful API (Port 8080)]
                   ├── Controller Layer (Endpoints & Validation)
                   ├── Service Layer (Business Rules & Logic)
                   └── Repository Layer (Spring Data JPA)
                                     │
                                     ▼
                  [MS SQL Server: A2TranHienVinh_SE1910]
                   (Category, NewsArticle, Tag, SystemAccount)
```

### Danh sách RESTful API Endpoints (Assignment 02):

| Method | Endpoint | Quyền hạn | Mô tả chức năng & Quy tắc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Đăng nhập hệ thống (kiểm tra email, password, trả về Role) |
| `GET` | `/api/news-articles/public/active` | Public | Lấy toàn bộ tin tức có trạng thái Active (`NewsStatus=1`) |
| `GET` | `/api/news-articles/public/search` | Public | Tìm kiếm tin tức public theo từ khóa và danh mục |
| `GET` | `/api/news-articles/public/{id}` | Public | Xem chi tiết bài viết kèm danh sách tags |
| `GET` | `/api/categories` | Public/Staff | Lấy danh sách tất cả các danh mục tin tức |
| `POST` | `/api/categories` | Staff | Thêm mới danh mục qua popup dialog modal |
| `PUT` | `/api/categories/{id}` | Staff | Cập nhật danh mục qua popup dialog modal |
| `DELETE` | `/api/categories/{id}` | Staff | **Xóa danh mục: Chặn xóa nếu danh mục đang chứa bài viết (409)** |
| `GET` | `/api/news-articles` | Staff | Lấy danh sách bài viết cho trang quản trị Staff |
| `POST` | `/api/news-articles` | Staff | Tạo bài viết mới (chọn Category, gán nhiều Tags, chọn ảnh) |
| `PUT` | `/api/news-articles/{id}` | Staff | Cập nhật bài viết qua popup dialog modal |
| `DELETE` | `/api/news-articles/{id}` | Staff | Xóa bài viết kết hợp popup xác nhận an toàn |
| `GET` | `/api/news-articles/history/{staffId}` | Staff | Xem lịch sử bài viết do chính Staff đang đăng nhập tạo ra |
| `GET` | `/api/accounts` | Admin | Lấy danh sách tài khoản, tìm kiếm theo tên/email |
| `POST` | `/api/accounts` | Admin | Thêm mới tài khoản qua popup dialog modal |
| `PUT` | `/api/accounts/{id}` | Admin | Cập nhật tài khoản qua popup dialog modal |
| `DELETE` | `/api/accounts/{id}` | Admin | **Xóa tài khoản: Chặn xóa nếu tài khoản đã từng tạo bài viết (409)** |
| `GET` | `/api/tags` | Staff | Lấy danh sách tags phục vụ việc gắn thẻ cho bài viết |

---

## 3. Hướng dẫn Demo & Kịch bản kiểm thử (Demo Guide)

### Khởi chạy hệ thống:
```powershell
# 1. Khởi tạo Cơ sở dữ liệu MS SQL Server
sqlcmd -S localhost -U sa -P 123456 -i "d:\KY7\SBA301\SBA\A2TranHienVinh_SE1910\database\A2TranHienVinh_SE1910.sql"

# 2. Chạy Backend Spring Boot 3 (Port 8080)
cd "d:\KY7\SBA301\SBA\A2TranHienVinh_SE1910\backend"
mvn spring-boot:run

# 3. Chạy Frontend ReactJS (Port 5173)
cd "d:\KY7\SBA301\SBA\A2TranHienVinh_SE1910\frontend"
npm run dev
```

### Bảng tài khoản thử nghiệm nhanh (1-Click Fill):
| Vai trò (Role) | Họ tên tài khoản | Email đăng nhập | Mật khẩu | Quyền hạn chính |
| :--- | :--- | :--- | :--- | :--- |
| **Admin (Role = 1)** | Steve Paris | `SteveParis@FUNewsManagement.org` | `@1` | Quản lý Account, test chặn xóa tài khoản |
| **Staff (Role = 2)** | Emma William | `EmmaWilliam@FUNewsManagement.org` | `@1` | Quản lý Category, News, Profile, My History |
| **Public / Guest** | Khách xem tin | *(Không cần đăng nhập)* | *(None)* | Xem tin active, tìm kiếm, xem modal chi tiết |

### Kịch bản Demo thực tế:
1. **Demo Public:** Mở trình duyệt `http://localhost:5173`, thấy ngay cổng tin tức active. Nhập từ khóa tìm kiếm, lọc theo danh mục, bấm "Chi tiết" để mở Modal xem bài viết và ảnh.
2. **Demo Admin & Business Rule 1:** Đăng nhập `SteveParis@FUNewsManagement.org`. Vào "Quản Lý Tài Khoản". Bấm "Xóa" tài khoản Steve Paris (ID 1) -> Hệ thống từ chối xóa và hiển thị thông báo lỗi 409: *"Cannot delete this account because it has created one or more news articles."*
3. **Demo Staff & Business Rule 2:** Đăng nhập `EmmaWilliam@FUNewsManagement.org`. Vào "Quản Lý Danh Mục". Bấm "Xóa" danh mục đang chứa tin tức -> Hệ thống chặn và trả về lỗi 409. Tạo mới 1 danh mục trống rồi xóa -> Xóa thành công có modal xác nhận.
4. **Demo Staff News & History:** Vào "Quản Lý Tin Tức" -> Bấm "Thêm Tin Mới" -> Dialog hiện ra cho phép chọn Category, gán nhiều Tags và ảnh. Vào "Lịch Sử Của Tôi" -> Xem toàn bộ tin do chính Emma William tạo ra.

---

## 4. Giải thích mã nguồn chi tiết (Code Walkthrough - Ass 2)

### a. Thực thi Business Rule chặn xóa Account (`SystemAccountServiceImpl.java`):
```java
@Override
@Transactional
public void deleteAccount(Short accountId) {
    SystemAccount account = accountRepo.findById(accountId)
        .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));

    // QUY TẮC NGHIỆP VỤ: Kiểm tra tài khoản đã từng tạo bài viết chưa
    boolean hasArticles = newsRepo.existsByCreatedBy_AccountID(accountId);
    if (hasArticles) {
        throw new BusinessConflictException(
            "Cannot delete this account because it has created one or more news articles."
        );
    }
    accountRepo.delete(account);
}
```
*Giải thích:* Phương thức `existsByCreatedBy_AccountID` truy vấn bảng `NewsArticle`. Nếu trả về `true`, ném `BusinessConflictException` (HTTP 409 Conflict) thay vì xóa, bảo toàn lịch sử tác giả.

### b. Thực thi Business Rule chặn xóa Category (`CategoryServiceImpl.java`):
```java
@Override
@Transactional
public void deleteCategory(Short categoryId) {
    Category category = categoryRepo.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));

    // QUY TẮC NGHIỆP VỤ: Kiểm tra danh mục có đang chứa bài viết không
    boolean hasNews = newsRepo.existsByCategory_CategoryID(categoryId);
    if (hasNews) {
        throw new BusinessConflictException(
            "Cannot delete this category because it is already associated with one or more news articles."
        );
    }
    categoryRepo.delete(category);
}
```
*Giải thích:* Ngăn chặn hành vi xóa danh mục mồ côi (orphaned foreign key), bảo vệ toàn vẹn dữ liệu cho các bài viết hiện hữu.

---

# PHẦN II: ASSIGNMENT 03 - FUMINI HOTEL SYSTEM (SPRING SECURITY & JWT)

## 1. Đề bài & Yêu cầu nghiệp vụ (Requirements)

Hệ thống **FUMiniHotelSystem** là ứng dụng quản lý khách sạn và giao dịch đặt phòng trực tuyến. Trọng tâm của đồ án là bảo mật hệ thống RESTful API bằng Spring Security 6 và JSON Web Token (JWT).

> [!IMPORTANT]
> **Quy chuẩn đặt tên và các ràng buộc bắt buộc (Assignment 03):**
> - Tên Database: `A3StudentName_ClassCode` -> `A3TranHienVinh_SE1910`.
> - Tên Project Spring Boot: `A3TranHienVinh_SE1910` (nằm trong thư mục `backend`).
> - Tên Project ReactJS: `A3TranHienVinh_SE1910` (nằm trong thư mục `frontend`).
> - **Cấu hình tài khoản Staff:** BẮT BUỘC lấy từ file `application.properties` (`hotel.staff.email`, `hotel.staff.password`).
> - **Xác thực Customer:** Xác thực bằng Email và Password từ bảng `Customer` trong Database.
> - **Quy tắc nghiệp vụ xóa phòng (Room Deletion Rule):** Nếu phòng đã từng có giao dịch trong bảng `BookingDetail`, hệ thống **chỉ được chuyển trạng thái sang Inactive (`RoomStatus = 0`)** chứ không được xóa khỏi database. Nếu phòng chưa từng có giao dịch nào, hệ thống thực hiện **xóa vĩnh viễn (Hard delete)**.
> - **Đặt phòng trực tuyến (Online Booking):** Hỗ trợ khách hàng đặt **một hoặc nhiều phòng cùng lúc (Multi-room)** trong một đơn đặt phòng, tự động tính tổng tiền theo số đêm lưu trú.

### Chi tiết các phân hệ chức năng:
1. **Phân hệ Khách vãng lai / Public:**
   - Xem toàn bộ danh sách phòng đang đón khách (`RoomStatus = 1`) mà không cần xác thực.
   - Tìm kiếm theo số phòng, từ khóa và lọc theo Hạng phòng (`RoomType`).
   - Xem chi tiết thông số tiện nghi phòng qua Modal Popup.
2. **Phân hệ Nhân viên (Staff Role):**
   - Quản lý phòng: CRUD phòng, áp dụng quy tắc xóa phòng thông minh (Soft-delete sang Inactive nếu đã từng được đặt, Hard delete nếu chưa từng có giao dịch).
   - Quản lý khách hàng: CRUD và tìm kiếm khách hàng, vô hiệu hóa tài khoản an toàn.
   - Quản lý đặt phòng: Xem chi tiết toàn bộ các đơn đặt phòng, tạo đơn tại quầy (Walk-in), cập nhật trạng thái đơn (Xác nhận / Đã hủy).
3. **Phân hệ Khách hàng (Customer Role):**
   - Đăng ký tài khoản thành viên mới (kiểm tra tính duy nhất của email).
   - Đăng nhập hệ thống nhận JSON Web Token (Bearer Token).
   - Đặt phòng trực tuyến: Chọn ngày Check-in, Check-out, tích chọn nhiều phòng cùng lúc, tự động tính tổng tiền theo số đêm.
   - Lịch sử đặt phòng: Xem danh sách các đơn đã đặt và chi tiết phòng tương ứng, hỗ trợ hủy đơn đặt phòng.
   - Quản lý hồ sơ cá nhân: Cập nhật thông tin cá nhân và đổi mật khẩu an toàn.

---

## 2. Solution & Hướng tiếp cận kỹ thuật (Architecture & Design)

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

### Danh sách RESTful API Endpoints (Assignment 03):

| Method | Endpoint | Phân quyền (Role) | Mô tả chức năng & Quy tắc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Đăng nhập xác thực kép (Staff từ properties hoặc Customer từ DB) |
| `POST` | `/api/auth/register` | Public | Đăng ký tài khoản khách hàng mới |
| `GET` | `/api/rooms/public` | Public | Lấy danh sách các phòng đang Active (`RoomStatus = 1`) |
| `GET` | `/api/rooms/public/search` | Public | Tìm kiếm phòng public theo từ khóa và hạng phòng |
| `GET` | `/api/room-types/public` | Public | Lấy danh mục các hạng phòng khách sạn |
| `GET` | `/api/customer/profile` | Customer | Xem thông tin hồ sơ cá nhân của khách hàng đăng nhập |
| `PUT` | `/api/customer/profile` | Customer | Cập nhật họ tên, số điện thoại, ngày sinh |
| `PUT` | `/api/customer/change-password` | Customer | Đổi mật khẩu tài khoản khách hàng |
| `POST` | `/api/bookings` | Customer/Staff | Tạo đơn đặt phòng (chọn nhiều phòng, tính tổng tiền tự động) |
| `GET` | `/api/customer/bookings` | Customer | Xem lịch sử các đơn đặt phòng của chính khách hàng |
| `PUT` | `/api/customer/bookings/{id}/cancel` | Customer | Hủy đơn đặt phòng của chính mình |
| `GET` | `/api/rooms` | Staff | Lấy danh sách toàn bộ phòng phục vụ trang quản trị Staff |
| `POST` | `/api/rooms` | Staff | Thêm mới phòng qua popup modal |
| `PUT` | `/api/rooms/{id}` | Staff | Cập nhật thông tin phòng qua popup modal |
| `DELETE` | `/api/rooms/{id}` | Staff | **XÓA PHÒNG: Đã có đơn -> Status=0; Chưa có đơn -> Hard delete** |
| `GET` | `/api/customers` | Staff | Lấy danh sách khách hàng, tìm kiếm |
| `POST` | `/api/customers` | Staff | Tạo mới tài khoản khách hàng |
| `PUT` | `/api/customers/{id}` | Staff | Cập nhật thông tin khách hàng |
| `DELETE` | `/api/customers/{id}` | Staff | Vô hiệu hóa hoặc xóa khách hàng |
| `GET` | `/api/bookings/all` | Staff | Xem danh sách toàn bộ đơn đặt phòng trong khách sạn |
| `PUT` | `/api/bookings/{id}/status` | Staff | Cập nhật trạng thái đơn (Xác nhận / Hủy) |
| `DELETE` | `/api/bookings/{id}` | Staff | Xóa đơn đặt phòng |

---

## 3. Hướng dẫn Demo & Kịch bản kiểm thử (Demo Guide)

### Khởi chạy hệ thống:
```powershell
# 1. Khởi tạo Cơ sở dữ liệu MS SQL Server
sqlcmd -S localhost -U sa -P 123456 -i "d:\KY7\SBA301\SBA\A3TranHienVinh_SE1910\database\A3TranHienVinh_SE1910.sql"

# 2. Chạy Backend Spring Boot 3 Security JWT (Port 8080)
cd "d:\KY7\SBA301\SBA\A3TranHienVinh_SE1910\backend"
mvn spring-boot:run

# 3. Chạy Frontend ReactJS (Port 5173)
cd "d:\KY7\SBA301\SBA\A3TranHienVinh_SE1910\frontend"
npm run dev
```

### Bảng tài khoản kiểm thử:
| Phân hệ / Vai trò | Họ tên tài khoản | Email đăng nhập | Mật khẩu | Nguồn tài khoản |
| :--- | :--- | :--- | :--- | :--- |
| **Staff (Admin)** | Staff Administrator | `staff@fuminhotel.com` | `@1` | **`application.properties`** |
| **Customer** | Nguyễn Văn An | `an.nguyen@fuminhotel.com` | `@1` | Cơ sở dữ liệu (`Customer`) |
| **Customer** | Trần Thị Mai | `mai.tran@fuminhotel.com` | `@1` | Cơ sở dữ liệu (`Customer`) |
| **Public / Guest** | Khách xem phòng | *(Không cần đăng nhập)* | *(None)* | Public Endpoints |

### Kịch bản Demo thực tế:
1. **Demo Public:** Mở trình duyệt `http://localhost:5173`, xem danh sách phòng active, lọc theo RoomType (Standard, Deluxe, Suite, Family, Penthouse), mở popup modal xem tiện nghi.
2. **Demo Đăng nhập Staff từ properties:** Bấm nút tiện ích **"👑 Staff (application.properties)"** trên màn hình Login -> Đăng nhập thành công, thanh Navbar hiển thị huy hiệu cam `STAFF (Admin)` và mở 3 menu quản lý phòng, khách hàng, đặt phòng.
3. **Demo Quy tắc xóa phòng cốt lõi:**
   - *Trường hợp phòng đã từng được đặt (RoomID = 3 DLX-201):* Bấm "Xóa" -> Hộp thoại xác nhận hiển thị thông báo nghiệp vụ -> Xác nhận xóa -> Phòng không bị mất mà trạng thái chuyển sang `Không hoạt động (Inactive - 0)`.
   - *Trường hợp phòng chưa từng có đơn (RoomID = 9 STD-103):* Bấm "Xóa" -> Xác nhận -> Phòng được xóa vĩnh viễn (Hard delete) khỏi database.
4. **Demo Đặt phòng online đa phòng (Customer):** Đăng nhập Customer `an.nguyen@fuminhotel.com`. Vào menu "Đặt Phòng Trực Tuyến". Chọn Check-in và Check-out (3 đêm). Tích chọn cùng lúc 2 phòng -> Hệ thống tự động tính tổng tiền = (500,000 + 520,000) * 3 = 3,060,000 VND. Bấm "Xác Nhận Đặt Phòng" -> Đặt thành công và chuyển sang xem danh sách phòng trong đơn tại trang Lịch sử đặt phòng.
5. **Demo Postman & Automated Test:** Chạy Postman collection `A3TranHienVinh_SE1910.postman_collection.json` gồm 19 kịch bản test và chạy `mvn test` -> Tất cả đều PASS 100%.

---

## 4. Giải thích mã nguồn chi tiết (Code Walkthrough - Ass 3)

### a. Cấu hình Staff lấy từ `application.properties` (`StaffProperties.java`):
```properties
# backend/src/main/resources/application.properties
hotel.staff.email=staff@fuminhotel.com
hotel.staff.password=@1
hotel.staff.fullName=Staff Administrator
hotel.staff.telephone=0900000000
```
```java
@Configuration
@ConfigurationProperties(prefix = "hotel.staff")
public class StaffProperties {
    private String email;
    private String password;
    private String fullName = "Staff Administrator";
    private String telephone = "0900000000";
    // Getters and Setters...
}
```
*Giải thích:* Thay vì lưu trong DB, Spring Boot đọc trực tiếp các trường `hotel.staff.*` từ file properties và map vào bean `StaffProperties`.

### b. Xác thực kép trong `CustomUserDetailsService.java`:
```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private StaffProperties staffProps;
    @Autowired private CustomerRepository customerRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Kiểm tra tài khoản Staff cấu hình trong application.properties
        if (staffProps.getEmail() != null && staffProps.getEmail().equalsIgnoreCase(email.trim())) {
            String pass = staffProps.getPassword();
            String encodedPass = pass.startsWith("$2a$") ? pass : passwordEncoder.encode(pass);
            return UserPrincipal.createStaff(staffProps.getEmail(), encodedPass, staffProps.getFullName());
        }

        // 2. Kiểm tra tài khoản Customer trong cơ sở dữ liệu SQL Server
        Customer customer = customerRepo.findByEmailAddress(email.trim())
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        boolean isActive = customer.getCustomerStatus() != null && customer.getCustomerStatus() == 1;
        return UserPrincipal.createCustomer(customer.getCustomerID(), customer.getEmailAddress(),
                                           customer.getPassword(), customer.getCustomerFullName(), isActive);
    }
}
```
*Giải thích:* Khi nhận yêu cầu đăng nhập, hệ thống kiểm tra email có khớp với email của Staff trong file properties hay không. Nếu có, cấp quyền `ROLE_STAFF`; nếu không, tiếp tục tìm trong bảng `Customer` và cấp quyền `ROLE_CUSTOMER`.

### c. Thực thi quy tắc xóa phòng (`RoomServiceImpl.java`):
```java
@Override
@Transactional
public ApiResponse deleteRoom(Integer id) {
    RoomInformation room = roomRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));

    // Kiểm tra xem phòng đã từng phát sinh giao dịch đặt phòng nào chưa
    boolean isRented = bookingDetailRepository.existsById_RoomID(id);

    if (isRented) {
        // ĐÃ CÓ GIAO DỊCH: Soft delete chuyển trạng thái sang Inactive (0)
        room.setRoomStatus(0);
        roomRepository.save(room);
        return ApiResponse.success(
            "Phòng đã từng có giao dịch đặt phòng, hệ thống đã tự động chuyển trạng thái " +
            "sang Không hoạt động (Inactive - 0) thay vì xóa vĩnh viễn.",
            mapToResponse(room)
        );
    } else {
        // CHƯA CÓ GIAO DỊCH: Xóa vĩnh viễn khỏi Database
        roomRepository.delete(room);
        return ApiResponse.success("Đã xóa vĩnh viễn phòng thành công.");
    }
}
```
*Giải thích:* Đây là quy tắc nghiệp vụ cốt lõi của đề tài. Nhờ phương thức `existsById_RoomID`, hệ thống kiểm tra nhanh trong bảng `BookingDetail` để quyết định chuyển trạng thái sang 0 hay xóa thực sự.

### d. Logic Đặt phòng nhiều phòng cùng lúc (`BookingServiceImpl.java`):
```java
@Override
@Transactional
public BookingResponse createBooking(BookingCreateRequest request, String userEmail, boolean isStaff) {
    Customer customer = isStaff ? customerRepo.findById(request.getCustomerID()).orElseThrow(...)
                                : customerRepo.findByEmailAddress(userEmail).orElseThrow(...);

    BookingReservation reservation = new BookingReservation();
    reservation.setBookingDate(request.getBookingDate() != null ? request.getBookingDate() : LocalDate.now());
    reservation.setCustomer(customer);
    reservation.setBookingStatus(1);
    reservation = reservationRepo.save(reservation);

    BigDecimal totalPrice = BigDecimal.ZERO;
    List<BookingDetail> details = new ArrayList<>();

    // Duyệt qua từng phòng khách chọn
    for (BookingDetailItemRequest item : request.getBookingDetails()) {
        RoomInformation room = roomRepo.findById(item.getRoomID()).orElseThrow(...);
        long days = Math.max(1, ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate()));
        BigDecimal itemPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
        totalPrice = totalPrice.add(itemPrice);

        BookingDetail detail = new BookingDetail();
        detail.setId(new BookingDetailId(reservation.getBookingReservationID(), room.getRoomID()));
        detail.setBookingReservation(reservation);
        detail.setRoomInformation(room);
        detail.setStartDate(item.getStartDate());
        detail.setEndDate(item.getEndDate());
        detail.setActualPrice(itemPrice);
        details.add(detail);
    }

    reservation.setTotalPrice(totalPrice);
    detailRepo.saveAll(details);
    return mapToResponse(reservationRepo.save(reservation));
}
```
*Giải thích:* Khách hàng có thể tích chọn nhiều phòng cùng lúc. Hệ thống tính số đêm lưu trú qua `ChronoUnit.DAYS`, tính thành tiền của từng phòng và cộng dồn vào `totalPrice` của đơn đặt phòng.

### e. Axios Interceptor tự động gắn JWT Bearer Token (`axiosClient.js`):
```javascript
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 5. Kinh nghiệm đạt điểm tối đa khi bảo vệ (Defense & Grading Tips)

### Những câu hỏi vấn đáp thường gặp và cách trả lời:
1. **Câu hỏi:** *Tại sao tài khoản Staff không nằm trong Database mà lại lấy từ file properties?*  
   **Trả lời:** Dạ thưa Thầy/Cô, đây là yêu cầu nghiệp vụ bắt buộc của đề tài Assignment 03 (*"The Staff account will get from application.properties file"*). Em đã dùng `@ConfigurationProperties(prefix = "hotel.staff")` để inject thông tin vào Spring Context và xác thực trong `CustomUserDetailsService`.
2. **Câu hỏi:** *Khi xóa phòng đã có đơn thì hệ thống xử lý ra sao?*  
   **Trả lời:** Dạ theo đề bài, nếu phòng đã từng xuất hiện trong `BookingDetail`, hệ thống không được xóa mà chỉ chuyển `RoomStatus = 0` (Inactive) để giữ nguyên lịch sử giao dịch. Nếu phòng chưa từng có khách thuê, hệ thống mới gọi `delete()` xóa vĩnh viễn.
3. **Câu hỏi:** *Tại sao Assignment 02 chặn xóa Account và Category?*  
   **Trả lời:** Dạ để tránh việc một bài viết tin tức bị mất thông tin người tạo (`CreatedByID`) hoặc mất danh mục (`CategoryID`), tầng Service chủ động kiểm tra bằng `existsByCreatedBy_AccountID` và `existsByCategory_CategoryID`, nếu vi phạm sẽ ném lỗi 409 Conflict ra Client.
4. **Câu hỏi:** *Cơ chế xác thực JWT hoạt động thế nào?*  
   **Trả lời:** Dạ khi login thành công, Backend sinh chuỗi JWT ký HMAC-SHA512 chứa Email, Role và ID. Client lưu vào LocalStorage. Mọi request sau đó đều được Axios Interceptor gắn header `Authorization: Bearer <token>`. `JwtAuthenticationFilter` tại Backend sẽ thẩm định chữ ký và thiết lập danh tính vào `SecurityContextHolder`.
