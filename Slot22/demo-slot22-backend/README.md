# SBA301 - Slot 22 - Chapter 15 Part A: CRUD Backend

## 📌 Tổng quan dự án (Project Overview)
Dự án được xây dựng theo giáo trình **SBA301 – Slot 22 – Chapter 15 Part A: Implement CRUD Application with RESTful Web Service and ReactJS (Part A: CRUD Backend)**.
Áp dụng mô hình kiến trúc chuẩn 3 tầng: **Controller → Service → Repository → Spring Data JPA / Hibernate → SQL Server**.

---

## 🛠 Công nghệ & Môi trường (Prerequisites & Tech Stack)
- **Java**: OpenJDK 21 (hoặc tương thích Java 21+)
- **Build Tool**: Apache Maven 3.9+
- **Spring Boot**: 3.2.5 (Spring Web, Spring Data JPA, Spring Validation)
- **Database**: Microsoft SQL Server (Port 1433, Database `FUNewsManagementSBA301`)
- **API Documentation**: OpenAPI 3 / Swagger UI (`springdoc-openapi`)
- **Testing**: JUnit 5, Mockito, MockMvc, PowerShell Automated Test Suite

---

## 🏗 Kiến trúc & Mental Model

```
HTTP Client (Postman / Swagger / React Frontend)
    │
    ▼ (HTTP Request: Method, URI, JSON Body)
DispatcherServlet / HandlerMapping
    │
    ▼
REST Controller (CategoryController: HTTP Boundary, Binding, @Valid)
    │
    ▼ (DTOs: CategoryRequest, CategoryResponse)
Application Service (CategoryServiceImpl: Business rules, @Transactional)
    │
    ▼ (Domain Entity: Category, NewsArticle)
Spring Data JPA Repository (CategoryRepository, NewsArticleRepository)
    │
    ▼ (EntityManager / Hibernate ORM: Dirty Checking, Persistence Context)
JDBC Driver (mssql-jdbc)
    │
    ▼ (Generated SQL: SELECT, INSERT, UPDATE, DELETE)
Microsoft SQL Server (FUNewsManagementSBA301)
```

---

## 🗄 Cấu trúc Database (`FUNewsManagementSBA301`)

Script khởi tạo sẵn tại file: [`schema.sql`](file:///d:/KY7/SBA301/SBA/Slot22/demo-slot22-backend/schema.sql)

- **Bảng `Category`**:
  - `CategoryID SMALLINT IDENTITY(1,1) PRIMARY KEY`
  - `CategoryName NVARCHAR(100) NOT NULL`
  - `CategoryDesciption NVARCHAR(250) NOT NULL` (lưu ý mapping đúng cột sai chính tả theo Assignment 02)
  - `ParentCategoryID SMALLINT NULL`
  - `IsActive BIT NULL`

- **Bảng `NewsArticle`**:
  - `NewsArticleID NVARCHAR(20) PRIMARY KEY`
  - `NewsTitle NVARCHAR(400) NULL`
  - `Headline NVARCHAR(150) NULL`
  - `CategoryID SMALLINT NULL` (Foreign Key tham chiếu `Category(CategoryID)`)
  - *Dùng để kiểm chứng nghiệp vụ Business Delete Rule (không cho phép xóa Category nếu đã có NewsArticle tham chiếu -> HTTP 409 Conflict).*

---

## 🚀 Hướng dẫn chạy và Demo (Run & Demo Instructions)

### 1. Khởi tạo Database
Chạy file script `schema.sql` vào SQL Server:
```powershell
sqlcmd -S localhost -U sa -P 123456 -i "d:\KY7\SBA301\SBA\Slot22\demo-slot22-backend\schema.sql"
```

### 2. Chạy ứng dụng Backend
```powershell
cd d:\KY7\SBA301\SBA\Slot22\demo-slot22-backend
mvn spring-boot:run
```
Ứng dụng sẽ khởi chạy tại cổng **8080**.

### 3. Xem Swagger UI trực quan
Truy cập trình duyệt:
👉 **[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)**

### 4. Chạy Automated Test Suite (12 test case chuẩn T01 - T12)
```powershell
powershell -ExecutionPolicy Bypass -File .\test_suite.ps1
```

---

## 📊 Bảng API Endpoints Contract

| Method | Endpoint | Query Param / Body | Mục đích | Expected HTTP Status |
|---|---|---|---|---|
| `GET` | `/api/categories` | `?keyword=&page=0&size=10&sort=categoryName,asc` | Lấy danh sách phân trang & tìm kiếm | **200 OK** |
| `GET` | `/api/categories/{id}` | - | Xem chi tiết 1 category theo ID | **200 OK** / **404 Not Found** |
| `POST` | `/api/categories` | JSON `CategoryRequest` | Tạo mới category | **201 Created** / **400 Bad Request** / **409 Conflict** |
| `PUT` | `/api/categories/{id}` | JSON `CategoryRequest` | Cập nhật category | **200 OK** / **400 Bad Request** / **404 Not Found** |
| `DELETE` | `/api/categories/{id}` | - | Xóa category (có kiểm tra FK) | **204 No Content** / **404 Not Found** / **409 Conflict** |

---

## 🧪 Test Matrix Bắt Buộc (Evidence T01 – T12)

| Mã test | Kịch bản / Request | Expected Status | Kết quả thực tế | DB State Verify |
|---|---|---|---|---|
| **T01** | `GET /api/categories?page=0&size=10` | `200 OK` | `200 OK` (3 items) | Không thay đổi dữ liệu |
| **T02** | `GET /api/categories/1` | `200 OK` | `200 OK` ("Academic news") | Trả đúng dòng ID=1 |
| **T03** | `GET /api/categories/32767` | `404 Not Found` | `404 Not Found` (`ApiError`) | Không tìm thấy |
| **T04** | `POST /api/categories` (body hợp lệ) | `201 Created` | `201 Created` (ID sinh tự động: 4) | Thêm mới 1 dòng vào DB |
| **T05** | `POST /api/categories` (body trống rỗng) | `400 Bad Request`| `400 Bad Request` (`VALIDATION_FAILED`)| Không tạo dòng mới trong DB |
| **T06** | `POST /api/categories` (trùng tên đã có) | `409 Conflict` | `409 Conflict` ("Category name already exists") | Không tạo duplicate |
| **T07** | `PUT /api/categories/1` (body hợp lệ) | `200 OK` | `200 OK` (Cập nhật tên mới) | Dòng ID=1 được UPDATE trong DB |
| **T08** | `PUT /api/categories/32767` (ID không tồn tại)| `404 Not Found` | `404 Not Found` | DB giữ nguyên |
| **T10** | `DELETE /api/categories/1` (Category đang có NewsArticle tham chiếu) | `409 Conflict` | `409 Conflict` ("Category is used by one or more news articles") | Dòng ID=1 **không bị xóa** |
| **T09** | `DELETE /api/categories/4` (Category chưa bị ai tham chiếu) | `204 No Content`| `204 No Content` | Dòng ID=4 bị xóa khỏi DB |
| **T11** | `GET /api/categories?keyword=academic` | `200 OK` | `200 OK` (chỉ trả về category khớp) | Đúng derived query |
| **T12** | `GET /api/categories?page=0&size=2` | `200 OK` | `200 OK` (`size=2, totalPages=2`)| Đúng giới hạn phân trang |

---

## 🔍 Execution Trace: POST /api/categories (End-to-End)

1. **Client** gửi HTTP request:
   - `POST /api/categories`
   - Header: `Content-Type: application/json`
   - Body: `{"categoryName": "Technology News", "categoryDescription": "...", "active": true}`
2. **Spring MVC DispatcherServlet**:
   - Nhận request, map handler tới `CategoryController.create(@Valid @RequestBody CategoryRequest request)`.
   - Jackson deserialize JSON body vào DTO `CategoryRequest`.
   - Hibernate Validator kích hoạt kiểm tra `@NotBlank`, `@Size`. Nếu vi phạm ném ra `MethodArgumentNotValidException` (map sang HTTP 400).
3. **CategoryServiceImpl.create**:
   - Bắt đầu Transaction boundary (`@Transactional`).
   - Gọi `repository.existsByCategoryNameIgnoreCase("Technology News")` để kiểm tra trùng tên.
   - Nếu tồn tại ném `BusinessConflictException` (map sang HTTP 409).
   - Khởi tạo entity mới `Category`, map dữ liệu từ request qua helper method `apply()`.
   - Gọi `repository.save(c)`.
4. **Spring Data JPA & Hibernate**:
   - `CategoryRepository.save` ủy thác cho `SimpleJpaRepository`.
   - EntityManager chuyển entity sang trạng thái **Managed**.
   - Flush sinh câu lệnh SQL `INSERT INTO Category (CategoryName, CategoryDesciption, ParentCategoryID, IsActive) VALUES (?, ?, ?, ?)`.
   - SQL Server thực thi, sinh ID tự tăng (`IDENTITY(1,1)`).
5. **Database Commit & HTTP Response**:
   - Transaction commit thành công.
   - Service map entity sang `CategoryResponse` DTO.
   - Controller trả về `ResponseEntity.status(HttpStatus.CREATED).body(created)` -> HTTP Status **201 Created** kèm JSON body có `categoryId`.

---

## 🛠 Break-It → Diagnose → Fix Note

- **Sự cố thực tế**: Cột mô tả trong schema database là `CategoryDesciption` (thiếu chữ 'r').
- **Triệu chứng (Break)**: Nếu cấu hình `@Column(name = "CategoryDescription")` với `spring.jpa.hibernate.ddl-auto=validate`, ứng dụng crash ngay lúc khởi động với lỗi:
  `SchemaManagementException: Schema-validation: missing column [CategoryDescription] in table [Category]`.
- **Chẩn đoán (Diagnose)**: Kiểm tra cấu trúc table trong SQL Server qua `INFORMATION_SCHEMA.COLUMNS` thấy tên cột thực tế là `CategoryDesciption`.
- **Khắc phục (Fix)**: Giữ nguyên property Java chuẩn `categoryDescription` nhưng cấu hình annotation rõ ràng:
  `@Column(name = "CategoryDesciption", nullable = false, length = 250)`.
  Nhờ đó, tầng Java code vẫn sạch đẹp, tuân thủ Java bean naming, trong khi ánh xạ cơ sở dữ liệu hoàn toàn tương thích và an toàn.
