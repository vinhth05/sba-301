# SBA301 - Slot 25: Chapter 16 Part B - Authentication & Authorization JWT Implementation (Lab 06)
**Student:** Trần Hiển Vinh (CE190881)  
**Class:** SE1910  
**Course Code:** SBA301  
**Subject:** Integrate Single Page Application with Spring Boot  
**Topic:** Full Implementation of Spring Security with JJWT 0.12.x, 3-Layer Architecture, Protected Endpoints & Automated Integration Tests

---

## I. Tổng Quan Dự Án & Công Nghệ

Dự án [`Slot25/slot25-security-jwt`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt) là sản phẩm hiện thực hóa trọn vẹn toàn bộ 21 bước kỹ thuật theo giáo trình Chapter 16 Part B và Lab 06:
- **Ngôn ngữ & Runtime:** Java 21 LTS (Oracle OpenJDK).
- **Framework:** Spring Boot 3.3.4 (Spring Framework 6.x, Spring Security 6.x).
- **Thư viện JWT:** JJWT (`io.jsonwebtoken:jjwt-api:0.12.6`, `jjwt-impl`, `jjwt-jackson`).
- **Lưu trữ dữ liệu:** Spring Data JPA, Hibernate ORM, Microsoft SQL Server driver (`mssql-jdbc`) cùng H2 In-Memory Database cho môi trường kiểm thử độc lập.
- **Bảo mật:** `BCryptPasswordEncoder`, `DaoAuthenticationProvider`, `JwtAuthenticationFilter`, `RestAuthenticationEntryPoint` (401 JSON) và `RestAccessDeniedHandler` (403 JSON).
- **Kiểm thử tự động:** JUnit 5, MockMvc, AssertJ, Spring Test (15 bài kiểm thử tự động đạt 100% PASS).

---

## II. Bản Đồ Triển Khai 21 Bước (Step 1 → Step 21)

| Bước | Thành phần | Lớp / Tệp tin mã nguồn | Trách nhiệm kỹ thuật |
| :---: | :--- | :--- | :--- |
| **Step 1** | Project Dependencies | [`pom.xml`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/pom.xml) | Cấu hình Spring Web, Security, Data JPA, Validation, SQL Server, H2 và bộ ba JJWT 0.12.6. |
| **Step 2** | Configuration | [`application.properties`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/resources/application.properties) | Thiết lập kết nối datasource, Base64 secret key 512 bits, expiration 900.000 ms (15 phút). |
| **Step 3** | User Entity | [`AppUser.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/entity/AppUser.java) | Entity bảng `AppUser` gồm `id`, `email` (unique), `password` (BCrypt hash), `role`, `enabled`. |
| **Step 4** | User Repository | [`AppUserRepository.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/repository/AppUserRepository.java) | Khai báo truy vấn `findByEmail(String email)` và `existsByEmail(String email)`. |
| **Step 5** | DTO & Records | [`dto/`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/dto) | `SignupRequest`, `LoginRequest`, `AuthResponse`, `UserResponse`, `OrchidRequest`, `OrchidResponse`. |
| **Step 6** | Password Encoder | [`SecurityConfig.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/config/SecurityConfig.java#L34-L37) | Đăng ký `@Bean PasswordEncoder` sử dụng thuật toán băm một chiều thích ứng `BCryptPasswordEncoder`. |
| **Step 7** | UserDetailsService | [`SecurityConfig.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/config/SecurityConfig.java#L39-L52) | Đăng ký `@Bean UserDetailsService` tìm kiếm theo email và chuyển đổi thành Spring Security `UserDetails`. |
| **Step 8** | Provider & Manager | [`SecurityConfig.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/config/SecurityConfig.java#L54-L68) | Cấu hình `DaoAuthenticationProvider` và `AuthenticationManager` từ `AuthenticationConfiguration`. |
| **Step 9** | Signup Service | [`AuthService.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/service/AuthService.java#L34-L47) | Kiểm tra trùng email (409 Conflict), hash mật khẩu bằng BCrypt, lưu tài khoản mặc định `USER`. |
| **Step 10** | JWT Service | [`JwtService.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/service/JwtService.java) | Ký token HMAC-SHA256, parse claims, extract username/roles, kiểm tra chữ ký và hạn hết hạn (`exp`). |
| **Step 11** | Login Service | [`AuthService.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/service/AuthService.java#L49-L62) | Xác thực danh tính qua `AuthenticationManager`, trích xuất principal và sinh access token. |
| **Step 12** | JWT Filter | [`JwtAuthenticationFilter.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/filter/JwtAuthenticationFilter.java) | `OncePerRequestFilter`: đọc `Authorization: Bearer <token>`, validate, đưa `Authentication` vào `SecurityContextHolder`. |
| **Step 13** | SecurityFilterChain | [`SecurityConfig.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/config/SecurityConfig.java#L70-L113) | Cấu hình CORS, tắt CSRF (stateless), phân luồng URL public/protected, chèn filter trước `UsernamePasswordAuthenticationFilter`. |
| **Step 14** | Auth Controller | [`AuthController.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/controller/AuthController.java) | REST endpoints `POST /auth/signup` (201 Created) và `POST /auth/login` (200 OK + Bearer token). |
| **Step 15** | `/users/me` Endpoint | [`UserController.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/controller/UserController.java#L25-L34) | Trả về thông tin principal (`username`, `authorities`, `authenticated: true`) từ token đang đăng nhập. |
| **Step 16** | `/users` & Orchids | [`UserController.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/controller/UserController.java#L36-L42), [`OrchidController.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/controller/OrchidController.java) | Danh sách người dùng được bảo vệ; API Hoa Lan: GET public, POST/PUT yêu cầu đăng nhập, DELETE chỉ dành cho `ADMIN`. |
| **Step 17** | Custom 401 & 403 JSON | [`RestAuthenticationEntryPoint.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/config/RestAuthenticationEntryPoint.java), [`RestAccessDeniedHandler.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/main/java/com/fpt/sba301/security/config/RestAccessDeniedHandler.java) | Ngăn Spring trả trang lỗi HTML mặc định; luôn trả JSON chuẩn `{status, error, message}`. |
| **Step 18** | Trace Login Request | [`slot24_text.txt`](file:///d:/KY7/SBA301/SBA/slot24_text.txt#L781-L792) | Truy vết cuộc gọi qua `AuthController` → `AuthService` → `AuthenticationManager` → `Provider` → `UserDetailsService` → `PasswordEncoder.matches`. |
| **Step 19** | Trace Protected Req | [`slot24_text.txt`](file:///d:/KY7/SBA301/SBA/slot24_text.txt#L793-L802) | Truy vết request có token qua `SecurityFilterChain` → `JwtAuthenticationFilter` → `JwtService.isValid` → `SecurityContextHolder` → `Controller`. |
| **Step 20** | Verification Matrix | Xem Mục IV bên dưới | Bộ ma trận 7 kịch bản bắt buộc theo chuẩn giáo trình. |
| **Step 21** | Automated Test Bridge | [`AuthFlowIntegrationTest.java`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt/src/test/java/com/fpt/sba301/security/AuthFlowIntegrationTest.java) | Bộ 15 bài kiểm thử tích hợp tự động với `MockMvc`, kiểm tra toàn diện kịch bản positive và negative. |

---

## III. Danh Mục REST API Endpoints Được Triển Khai

| Method | Endpoint | Quyền truy cập (Authorization) | Request Body | Response thành công |
| :---: | :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | **Public** (Không cần token) | `SignupRequest` (`email`, `password`) | `201 Created` (`UserResponse`) |
| `POST` | `/auth/login` | **Public** (Không cần token) | `LoginRequest` (`email`, `password`) | `200 OK` (`AuthResponse`: `accessToken`, `tokenType`, `expiresIn`) |
| `GET` | `/users/me` | **Authenticated** (Bất kỳ user nào có Bearer token hợp lệ) | None | `200 OK` (`username`, `authorities`, `authenticated`) |
| `GET` | `/users` | **Authenticated** | None | `200 OK` (Danh sách `UserResponse`) |
| `GET` | `/admin/dashboard` | **Role ADMIN** (`hasRole('ADMIN')`) | None | `200 OK` (Dashboard metrics) |
| `GET` | `/orchids` | **Public** (Cho phép khách xem danh mục hoa lan) | None | `200 OK` (Danh sách hoa lan) |
| `GET` | `/orchids/{id}` | **Public** | None | `200 OK` (Chi tiết hoa lan) |
| `POST` | `/orchids` | **Authenticated** (`ROLE_USER` hoặc `ROLE_ADMIN`) | `OrchidRequest` | `201 Created` (`OrchidResponse`) |
| `PUT` | `/orchids/{id}` | **Authenticated** (`ROLE_USER` hoặc `ROLE_ADMIN`) | `OrchidRequest` | `200 OK` (`OrchidResponse`) |
| `DELETE`| `/orchids/{id}` | **Role ADMIN** (`hasRole('ADMIN')`) | None | `204 No Content` |

---

## IV. Kết Quả Kiểm Thử Tự Động (Automated Integration Tests)

Thực hiện lệnh kiểm thử toàn diện bằng Maven:
```powershell
mvn clean test
```

### Kết quả thực tế từ Terminal:
```
[INFO] Running com.fpt.sba301.security.AuthFlowIntegrationTest
Hibernate: select ...
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 7.251 s -- in com.fpt.sba301.security.AuthFlowIntegrationTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

### Bảng Chi Tiết 15 Kịch Bản Kiểm Thử:
1. `T01: GET /users/me without token returns 401 Unauthorized` → **PASS** (trả JSON 401).
2. `T02: POST /auth/signup creates user and stores BCrypt hash` → **PASS** (mật khẩu trong DB bắt đầu `$2a$`, không phải plaintext).
3. `T03: POST /auth/signup duplicate email returns 409 Conflict` → **PASS** (bắt ngoại lệ và trả 409 Conflict).
4. `T04: POST /auth/login with valid credentials returns 200 and Bearer token` → **PASS** (trả JWT token hợp lệ).
5. `T05: POST /auth/login with invalid password returns 401 Unauthorized` → **PASS** (từ chối đăng nhập sai mật khẩu).
6. `T06: GET /users/me with valid Bearer token returns 200 and principal identity` → **PASS** (trả về đúng identity và quyền `ROLE_USER`).
7. `T07: GET /users with valid token returns list of users` → **PASS** (trả danh sách người dùng).
8. `T08: GET /admin/dashboard with USER role returns 403 Forbidden` → **PASS** (phân quyền vai trò: user thường bị chặn).
9. `T09: GET /admin/dashboard with ADMIN role returns 200 OK` → **PASS** (admin được cấp quyền truy cập).
10. `T10: GET /users/me with tampered token returns 401 Unauthorized` → **PASS** (chữ ký sai bị từ chối ngay lập tức).
11. `T11: GET /orchids is public and returns 200 without token` → **PASS** (route công khai hoạt động tốt).
12. `T12: POST /orchids without token returns 401 Unauthorized` → **PASS** (bảo vệ thao tác ghi dữ liệu).
13. `T13: POST /orchids with authenticated user returns 201 Created` → **PASS** (người dùng hợp lệ tạo hoa mới thành công).
14. `T14: DELETE /orchids/{id} with USER role returns 403 Forbidden` → **PASS** (user thường không được xóa hoa).
15. `T15: DELETE /orchids/{id} with ADMIN role returns 204 No Content` → **PASS** (admin xóa hoa thành công).

---

## V. Hướng Dẫn Sử Dụng & Kiểm Thử Bằng Postman

1. Mở Postman và import tệp tin:  
   [`Slot25/SBA301_Slot25_Security_JWT.postman_collection.json`](file:///d:/KY7/SBA301/SBA/Slot25/SBA301_Slot25_Security_JWT.postman_collection.json)
2. Bộ collection đã thiết lập sẵn **Tests Script tự động**:
   - Khi gửi `POST /auth/login (Admin)`, token sẽ tự động lưu vào biến môi trường `{{admin_token}}`.
   - Khi gửi `POST /auth/login (User)`, token sẽ tự động lưu vào biến môi trường `{{user_token}}`.
   - Các requests tiếp theo (`/users/me`, `/admin/dashboard`, `POST /orchids`, `DELETE /orchids/1`) tự động sử dụng Bearer token tương ứng.

---

## VI. Bảng Kiểm Tra Cổng Tích Hợp (Integration Gate G1 - G12)

- [x] **G1 (Build):** Biên dịch và chạy toàn bộ unit/integration test đạt 100% BUILD SUCCESS.
- [x] **G2 (User Persistence):** Bảng `AppUser` lưu trữ mật khẩu mã hóa BCrypt, tuyệt đối không có plaintext.
- [x] **G3 (Signup Validation):** Kiểm tra trùng lặp email và trả về mã lỗi 409 Conflict.
- [x] **G4 (UserDetails):** Map email thành username, ánh xạ chuẩn `ROLE_USER` / `ROLE_ADMIN`.
- [x] **G5 (AuthManager):** Luồng đăng nhập ủy quyền hoàn toàn cho `AuthenticationManager` & `DaoAuthenticationProvider`.
- [x] **G6 (JWT Issue):** Cấp phát Access Token đầy đủ claims `sub`, `iat`, `exp`, `roles`.
- [x] **G7 (JWT Validate):** Xác thực chữ ký HMAC-SHA256 và kiểm tra thời hạn sống của token.
- [x] **G8 (Filter):** `JwtAuthenticationFilter` giải nén token và thiết lập `SecurityContextHolder`.
- [x] **G9 (Context):** Endpoint `/users/me` đọc trực tiếp danh tính principal từ SecurityContext.
- [x] **G10 (Protection):** Toàn bộ endpoints bảo vệ đều trả về 401 khi không có token hoặc token không hợp lệ.
- [x] **G11 (Tracing):** Nhật ký và tài liệu truy vết call stack đầy đủ cả 2 chiều Login và Protected Request.
- [x] **G12 (Explain):** Nắm vững kiến trúc phân tách giữa Hand-rolled JWT phục vụ học tập và chuẩn OAuth2 Resource Server trong môi trường production.
