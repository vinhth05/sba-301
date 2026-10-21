# SBA301 - Slot 24: Chapter 16 Part A - Securing REST Services with Spring Boot
**Student:** Trần Hiển Vinh (CE190881)  
**Class:** SE1910  
**Course Code:** SBA301  
**Subject:** Integrate Single Page Application with Spring Boot  
**Topic:** Security Concepts, Authentication/Authorization, OAuth 2.0, JSON Web Tokens (JWT)

---

## I. Core Mental Model & Khái Niệm Nền Tảng

Bảo mật RESTful API không bắt đầu từ việc *"copy một đoạn code JWT Filter"*. Một kỹ sư phần mềm chuyên nghiệp phải nắm vững ranh giới bảo mật (**Security Boundary**), chuỗi xử lý request qua Spring Security, vòng đời định danh và phân quyền trước khi triển khai code.

```
+---------------------------------------------------------------------------------------------------+
|                                      REST SECURITY BOUNDARY                                       |
|                                                                                                   |
|  [ Client (SPA / Postman) ]                                                                      |
|               |                                                                                   |
|               | (1) POST /auth/login (email + raw password)                                       |
|               v                                                                                   |
|  [ AuthenticationManager ] ---> [ DaoAuthenticationProvider ] ---> [ PasswordEncoder.matches() ]  |
|               |                                                                                   |
|               v (2) Cấp JWT Access Token (Header.Payload.Signature)                              |
|                                                                                                   |
|               | (3) GET /protected/resource [Authorization: Bearer <token>]                      |
|               v                                                                                   |
|  [ SecurityFilterChain ] ---> [ JwtAuthenticationFilter ] ---> [ SecurityContextHolder ]          |
|                                                                         |                         |
|                                  +--------------------------------------+                         |
|                                  | Authenticated Principal & Roles                                |
|                                  v                                                                |
|                      [ Authorization Filter / Rule ]                                              |
|                                  |                                                                |
|                     +------------+------------+                                                   |
|                     |                         |                                                   |
|             (Pass: Role OK)           (Fail: Role Mismatch)                                       |
|                     v                         v                                                   |
|             [ Controller Method ]        [ 403 Forbidden ]                                        |
+---------------------------------------------------------------------------------------------------+
```

### 1. Phân biệt Bản Chất: Authentication vs Authorization

| Tiêu chí | Authentication (Xác thực) | Authorization (Phân quyền) |
| :--- | :--- | :--- |
| **Câu hỏi cốt lõi** | **"Bạn là ai?" (Who are you?)** | **"Bạn được phép làm gì?" (What can you do?)** |
| **Thời điểm diễn ra** | Luôn diễn ra **trước** (khi đăng nhập hoặc parse credential) | Diễn ra **sau khi đã xác định identity** |
| **Đối tượng Spring Security** | `AuthenticationManager`, `DaoAuthenticationProvider`, `UserDetailsService` | `AuthorizationFilter`, `@PreAuthorize`, `hasRole()`, `hasAuthority()` |
| **Dữ liệu đại diện** | `Principal` (Username / Email, Credentials) | `GrantedAuthority` (danh sách `ROLE_USER`, `ROLE_ADMIN`, scopes) |
| **Mã lỗi HTTP khi thất bại** | **401 Unauthorized** (Thiếu hoặc sai credential/token) | **403 Forbidden** (Đã xác thực nhưng không đủ quyền thực thi) |

---

## II. So Sánh Kiến Trúc: Session-Based vs Stateless Token

```mermaid
sequenceDiagram
    autonumber
    participant C as Client (SPA / Browser)
    participant S as Spring Boot Server
    participant DB as SQL Database

    Note over C,DB: 1. Mô hình State-ful Session truyền thống
    C->>S: POST /login (username, password)
    S->>DB: Check credential & hash
    DB-->>S: OK
    S->>S: Tạo HttpSession trên RAM server, sinh JSESSIONID
    S-->>C: Set-Cookie: JSESSIONID=xyz789; HttpOnly
    C->>S: GET /data (Kèm Cookie JSESSIONID tự động)
    S->>S: Lookup Session từ RAM / Redis
    S-->>C: 200 OK (Data)

    Note over C,DB: 2. Mô hình Stateless JWT Token (Chuẩn SPA REST)
    C->>S: POST /auth/login (email, password)
    S->>DB: Check credential via DaoAuthenticationProvider
    DB-->>S: AppUser (BCrypt hash)
    S->>S: Sinh JWT Token (Ký bằng HMAC-SHA256 Secret)
    S-->>C: 200 OK {"accessToken": "eyJhbGci...", "tokenType": "Bearer"}
    C->>S: GET /orchids (Header Authorization: Bearer eyJhbGci...)
    S->>S: JwtAuthenticationFilter: verify chữ ký & hạn exp (Không cần query session RAM)
    S-->>C: 200 OK (Data)
```

- **Session-Based:** Phụ thuộc vào Server State. Khi mở rộng nhiều máy chủ (horizontal scaling / clustering), phải cấu hình sticky session hoặc distributed session store (Redis). Rất dễ bị tấn công CSRF nếu dùng Cookie.
- **Stateless Token:** Server không lưu trữ token trong bộ nhớ. Toàn bộ thông tin định danh và quyền hạn nằm trong Payload của Token. Phù hợp tuyệt đối với kiến trúc SPA (React) và Microservices.

---

## III. OAuth 2.0 vs JWT - Hai Khái Niệm Không Đồng Nghĩa

> [!IMPORTANT]
> **JWT là Token Format (định dạng dữ liệu); OAuth 2.0 là Authorization Framework (khung ủy quyền).** Có JWT không đồng nghĩa với việc đang chạy OAuth 2.0.

### 1. Bốn Vai Trò (Roles) trong OAuth 2.0:
1. **Resource Owner:** Người dùng cuối sở hữu tài nguyên dữ liệu.
2. **Client:** Ứng dụng bên thứ ba (Web SPA, Mobile app) muốn thay mặt Resource Owner truy cập tài nguyên.
3. **Authorization Server:** Máy chủ xác thực người dùng và cấp phát Access Token (ví dụ: Google Identity, Keycloak, Auth0, Spring Authorization Server).
4. **Resource Server:** Máy chủ lưu trữ REST API và nghiệp vụ kinh doanh, có nhiệm vụ xác minh Token và trả về tài nguyên.

```mermaid
graph LR
    RO[Resource Owner / User] -->|1. Cấp quyền| Client[Client SPA / Mobile App]
    Client -->|2. Yêu cầu Token| AS[Authorization Server]
    AS -->|3. Cấp Access Token JWT| Client
    Client -->|4. Request + Bearer Token| RS[Resource Server / REST API]
    RS -->|5. Trả dữ liệu được bảo vệ| Client
```

---

## IV. Giải Phẫu JSON Web Token (JWT Anatomy)

Một token JWT hợp lệ gồm 3 phần được phân tách bằng dấu chấm (`.`): `Header.Payload.Signature`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzM5OTcxMjAwLCJleHAiOjE3Mzk5NzIxMDB9.s7V5rK-fR8m0v...
[--------- HEADER ---------] . [------------------ PAYLOAD ------------------] . [--------- SIGNATURE ---------]
```

1. **Header:** Chứa metadata gồm thuật toán ký (`"alg": "HS256"`) và loại token (`"typ": "JWT"`).
2. **Payload (Claims):** Chứa dữ liệu claims (được mã hóa Base64Url, **KHÔNG ĐƯỢC MÃ HÓA BÍ MẬT**; bất kỳ ai cũng có thể decode được).
   - `sub` (Subject): Định danh người dùng (thường là Email / Username).
   - `iat` (Issued At): Thời điểm sinh token.
   - `exp` (Expiration): Thời điểm hết hạn của token.
   - `roles` / `authorities`: Danh sách quyền hạn phục vụ Authorization.
3. **Signature:** Tạo ra bằng cách hash `Base64Url(Header) + "." + Base64Url(Payload)` cùng với `Secret Key` qua thuật toán HMAC-SHA256 (hoặc RSA Private Key):
   $$\text{Signature} = \text{HMAC-SHA256}(\text{Base64Url}(H) + "." + \text{Base64Url}(P), \text{SecretKey})$$
   - Chữ ký bảo vệ tính toàn vẹn (**Integrity**) và nguồn gốc (**Authenticity**). Nếu hacker thay đổi payload (ví dụ sửa `sub` hoặc `roles`), chữ ký sẽ không khớp và Spring Security lập tức từ chối request với mã lỗi **401 Unauthorized**.

---

## V. Spring Security Internal Request Lifecycle

```mermaid
flowchart TD
    Req[Incoming HTTP Request] --> SC[SecurityFilterChain]
    SC --> CorsFilter[CorsFilter: Kiểm tra Origin]
    CorsFilter --> CsrfFilter[CsrfFilter: Disabled for Stateless]
    CsrfFilter --> JwtFilter[JwtAuthenticationFilter: OncePerRequestFilter]
    
    JwtFilter -->|No Bearer Token| NextFilter[Pass to Next Filter]
    JwtFilter -->|Has Bearer Token| JwtParse[JwtService.parseClaims & extractUsername]
    
    JwtParse -->|Token Invalid / Expired| ClearCtx[Clear SecurityContext] --> NextFilter
    JwtParse -->|Token Valid| LoadUser[UserDetailsService.loadUserByUsername]
    LoadUser --> BuildAuth[Build UsernamePasswordAuthenticationToken]
    BuildAuth --> SetCtx[SecurityContextHolder.getContext.setAuthentication]
    SetCtx --> NextFilter
    
    NextFilter --> AuthFilter[AuthorizationFilter / FilterSecurityInterceptor]
    AuthFilter -->|Check URL Matching & hasRole| Decision{Permitted?}
    
    Decision -->|Unauthenticated| EntryPoint[RestAuthenticationEntryPoint: 401 JSON]
    Decision -->|Insufficient Role| AccessDenied[RestAccessDeniedHandler: 403 JSON]
    Decision -->|Authorized| Dispatcher[DispatcherServlet]
    
    Dispatcher --> Controller[RestController Method]
```

---

## VI. Bảng Chẩn Đoán Lỗi Thực Hành (Break-It → Diagnose → Fix Table)

| STT | Kịch bản cố tình gây lỗi (Break) | Mã lỗi trả về | Nguyên nhân kỹ thuật | Điểm chẩn đoán & Cách sửa chữa |
| :---: | :--- | :---: | :--- | :--- |
| **1** | Bỏ tiền tố `"Bearer "` trong Authorization header | **401 Unauthorized** | `JwtAuthenticationFilter` kiểm tra `startsWith("Bearer ")` thất bại, bỏ qua việc gán `SecurityContext`. | Header phải đúng chuẩn `Authorization: Bearer <token>`. |
| **2** | Sửa 1 ký tự trong payload hoặc signature | **401 Unauthorized** | Chữ ký tính lại không khớp với signature đính kèm (`SignatureException`). | Không can thiệp token thô; kiểm tra secret key phía server. |
| **3** | Đặt expiration token 1 giây và gọi API sau 2 giây | **401 Unauthorized** | Claim `exp` đã nhỏ hơn thời gian hiện tại của server (`ExpiredJwtException`). | Refresh token hoặc đăng nhập lại để nhận token mới. |
| **4** | Cấu hình PasswordEncoder khác nhau khi signup và login | **401 Unauthorized** | Mã hash được sinh bởi một thuật toán nhưng `matches()` lại dùng thuật toán khác. | Sử dụng thống nhất một `@Bean PasswordEncoder` (`BCryptPasswordEncoder`). |
| **5** | Đặt rule `permitAll("/**")` | **200 OK (Hở bảo mật)** | Bỏ qua toàn bộ kiểm tra quyền hạn của tất cả endpoints. | Thiết lập rõ ràng: `/auth/**` permitAll, còn lại `authenticated()` hoặc `hasRole()`. |
| **6** | User mang role `ROLE_USER` gọi `/admin/**` | **403 Forbidden** | Authentication thành công nhưng thiếu quyền `ROLE_ADMIN` theo rule `hasRole("ADMIN")`. | Kiểm tra authorities gán vào token hoặc cấp quyền hợp lệ cho user. |
| **7** | JWT Secret Key ngắn hơn 256 bits (32 bytes) | **500 Server Startup Error** | JJWT ném `WeakKeyException` vì thuật toán HMAC-SHA256 yêu cầu độ dài khóa tối thiểu 256 bits. | Dùng khóa có độ dài ít nhất 32 bytes hoặc mã hóa Base64 chuẩn. |

---

## VII. End-to-End Tracing Worksheets

### 1. Luồng Đăng Nhập (Login Flow):
```
POST /auth/login (Email + Raw Password)
 └── AuthController.login(LoginRequest)
      └── AuthService.login(LoginRequest)
           └── AuthenticationManager.authenticate(UsernamePasswordAuthenticationToken)
                └── DaoAuthenticationProvider.authenticate(auth)
                     ├── UserDetailsService.loadUserByUsername(email)
                     │    └── AppUserRepository.findByEmail(email) -> trả về AppUser
                     ├── PasswordEncoder.matches(rawPassword, user.getPasswordHash())
                     └── Tạo authenticated Authentication object chứa UserDetails và GrantedAuthorities
           └── JwtService.generateToken(userDetails)
                └── Jwts.builder().subject().claims().issuedAt().expiration().signWith().compact()
 └── Trả về AuthResponse { accessToken, tokenType: "Bearer", expiresIn: 900 } (HTTP 200 OK)
```

### 2. Luồng Yêu Cầu Được Bảo Vệ (Protected Request Flow):
```
GET /users/me (Header Authorization: Bearer <token>)
 └── SecurityFilterChain
      └── JwtAuthenticationFilter.doFilterInternal()
           ├── Trích xuất header "Authorization", cắt bỏ "Bearer "
           ├── JwtService.extractUsername(token)
           ├── UserDetailsService.loadUserByUsername(username)
           ├── JwtService.isValid(token, userDetails) -> verify chữ ký & hạn sử dụng
           └── SecurityContextHolder.getContext().setAuthentication(UsernamePasswordAuthenticationToken)
 └── AuthorizationFilter đánh giá URL rule: "/users/**" -> authenticated() => PASS
 └── DispatcherServlet -> UserController.me(Authentication)
      └── Đọc Principal trực tiếp từ ThreadLocal SecurityContextHolder
 └── Trả về Map { username: "user@example.com", authorities: ["ROLE_USER"], authenticated: true } (HTTP 200 OK)
```

---

## VIII. Kiểm Chứng Tích Hợp (Integration Gates G1 - G12)

| Cổng | Tiêu chí đánh giá | Trạng thái | Bằng chứng kiểm chứng |
| :---: | :--- | :---: | :--- |
| **G1** | Maven Build & Test | **PASS** | Biên dịch thành công, toàn bộ 15 bài kiểm thử tự động đạt 100% SUCCESS. |
| **G2** | DB User Persistence | **PASS** | Bảng `AppUser` lưu trữ mật khẩu mã hóa BCrypt (`$2a$...`), không lưu plaintext. |
| **G3** | Public Boundary | **PASS** | Các route `/auth/signup`, `/auth/login`, `GET /orchids` truy cập bình thường không cần token. |
| **G4** | Protected Boundary | **PASS** | `GET /users/me`, `POST /orchids` không có token trả về đúng HTTP 401 Unauthorized dạng JSON. |
| **G5** | Login & Bad Credential | **PASS** | Đăng nhập đúng trả về 200 + Bearer token; sai mật khẩu trả về 401 Unauthorized. |
| **G6** | JWT Signature & Exp | **PASS** | Token bị sửa đổi hoặc hết hạn lập tức bị bộ lọc JWT từ chối với HTTP 401. |
| **G7** | Principal Identity | **PASS** | Endpoint `/users/me` trả về chính xác danh tính người gọi được lấy từ `Authentication`. |
| **G8** | Role Authorization | **PASS** | User thường gọi endpoint `/admin/dashboard` bị chặn với HTTP 403 Forbidden. |
| **G9** | Negative Token Matrix | **PASS** | Kiểm thử tự động với chuỗi token giả mạo, thiếu Bearer, token sai định dạng đều PASS. |
| **G10** | Tracing Call Stack | **PASS** | Ghi nhận chi tiết method call chain từ Controller đến Repository và PasswordEncoder. |
| **G11** | Break & Fix Evidence | **PASS** | Hoàn thành 7 kịch bản chẩn đoán lỗi điển hình trong thực tế phát triển phần mềm. |
| **G12** | Human Verification | **PASS** | Phân biệt rõ ranh giới: JWT ≠ OAuth 2.0; 401 (Chưa xác thực) ≠ 403 (Thiếu quyền). |

---

## IX. Postman Collection Kiểm Thử

File Postman Collection mẫu dành riêng cho Slot 24 được đặt tại:  
[`Slot24/SBA301_Slot24_Security_Collection.postman_collection.json`](file:///d:/KY7/SBA301/SBA/Slot24/SBA301_Slot24_Security_Collection.postman_collection.json)
