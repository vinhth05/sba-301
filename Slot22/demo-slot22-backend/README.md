# SBA301 - Slot 22 - Chapter 15 Part A: CRUD Backend

## 📌 Tổng quan dự án (Project Overview)
Dự án được xây dựng chuẩn theo giáo trình **SBA301 – Slot 22 – Chapter 15 Part A: Implement CRUD Application with RESTful Web Service and ReactJS (Part A: CRUD Backend)** (Mục 6.1 - Bài tập chủ đề: Xây dựng Category CRUD Backend).

Áp dụng mô hình chuẩn 3 tầng có ranh giới rõ ràng:
**HTTP Client (Postman) → REST Controller → Service (Business Rules, Transaction) → Repository (Spring Data JPA) → Hibernate / JDBC → SQL Server**.

---

## 🛠 Công nghệ & Môi trường (Tech Stack)
- **Java**: JDK 21
- **Build Tool**: Maven
- **Spring Boot**: 3.2.5
- **Dependencies**:
  - `spring-boot-starter-web`
  - `spring-boot-starter-data-jpa`
  - `spring-boot-starter-validation`
  - `mssql-jdbc`
- **Database**: Microsoft SQL Server (Database `FUNewsManagementSBA301`)

---

## 🏗 Cấu trúc Package (Package Structure)
```
src/main/java/com/fpt/sba301/slot22/
├─ Slot22Application.java
├─ controller/
│  └─ CategoryController.java
├─ dto/
│  ├─ CategoryRequest.java
│  └─ CategoryResponse.java
├─ entity/
│  └─ Category.java
├─ exception/
│  ├─ ResourceNotFoundException.java
│  ├─ BusinessConflictException.java
│  ├─ ApiError.java
│  └─ ApiExceptionHandler.java
├─ repository/
│  └─ CategoryRepository.java
└─ service/
   ├─ CategoryService.java
   └─ CategoryServiceImpl.java

src/main/resources/
└─ application.properties
```

---

## 🗄 Cấu trúc Database (`FUNewsManagementSBA301`)

Script SQL khởi tạo tại file [`schema.sql`](schema.sql):

- **Bảng `Category`**:
  - `CategoryID SMALLINT IDENTITY(1,1) PRIMARY KEY`
  - `CategoryName NVARCHAR(100) NOT NULL`
  - `CategoryDesciption NVARCHAR(250) NOT NULL` (ánh xạ đúng tên cột `CategoryDesciption` theo database assignment)
  - `ParentCategoryID SMALLINT NULL`
  - `IsActive BIT NULL`

---

## 🚀 Hướng dẫn thực thi (Execution Instructions)

### 1. Khởi tạo Database
Chạy file script `schema.sql` trong SQL Server Management Studio (SSMS) hoặc qua `sqlcmd`:
```powershell
sqlcmd -S localhost -U sa -P 123456 -i "schema.sql"
```

### 2. Biên dịch & Chạy Backend (Bỏ qua kiểm thử / Không mở test)
```powershell
# Biên dịch (skip test)
mvn -q -DskipTests compile

# Khởi chạy backend
mvn spring-boot:run
```
Ứng dụng sẽ chạy tại cổng **8080**.

---

## 📊 Bảng API Endpoints Contract

| Method | Endpoint | Query Param / Request Body | Mục đích | HTTP Status |
|---|---|---|---|---|
| `GET` | `/api/categories` | `?keyword=&page=0&size=10&sort=categoryName,asc` | Lấy danh sách phân trang & tìm kiếm theo tên | **200 OK** |
| `GET` | `/api/categories/{id}` | - | Lấy chi tiết category theo ID | **200 OK** / **404 Not Found** |
| `POST` | `/api/categories` | JSON `CategoryRequest` | Tạo mới category (kiểm tra trùng lặp tên) | **201 Created** / **400 Bad Request** / **409 Conflict** |
| `PUT` | `/api/categories/{id}` | JSON `CategoryRequest` | Cập nhật thông tin category theo ID | **200 OK** / **400 Bad Request** / **404 Not Found** |
| `DELETE` | `/api/categories/{id}` | - | Xóa category | **204 No Content** / **404 Not Found** |

---

## 📮 Postman Collection
Import file [`postman_collection.json`](postman_collection.json) vào Postman để kiểm thử toàn diện các endpoint trên.
