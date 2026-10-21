# SBA301 - Integrate Single Page Application with Spring Boot
**Student:** Trần Hiển Vinh (CE190881)  
**Class:** SE1910  
**Course Code:** SBA301  

---

## Danh Mục Bài Tập & Dự Án Đã Hoàn Thành Theo Các Slot

Toàn bộ các bài tập thực hành, củng cố và bài tập tổng hợp theo tài liệu giáo trình tại thư mục `Tài Liệu` đã được triển khai đầy đủ, chuẩn kiến trúc, kiểm tra build và kiểm thử tự động thành công:

### 1. Slot 02 - ReactJS Fundamentals & Component Composition
- **Thư mục:** [`SLot2/sba301-learning-dashboard`](file:///d:/KY7/SBA301/SBA/SLot2/sba301-learning-dashboard)
- **Công nghệ:** ReactJS, Vite 5.x, Functional Components, JSX Expressions.
- **Tính năng & Bài mở rộng (E1 - E6):**
  - Modular hóa dữ liệu: Tách riêng `src/data/course.js` và `src/data/student.js` (E1).
  - Component `CourseResources.jsx`: Hiển thị danh sách tài nguyên học tập chính thức (E2).
  - Component `EnvironmentStatus.jsx`: Badge trạng thái công cụ với styling điều kiện qua toán tử 3 ngôi (E3).
  - Component `DebugEvidence.jsx`: Checklist kiểm chứng Terminal, Console, Git (E4).
  - Thông tin dự án nhóm thực tế `FUNewsManagementSystem` (E5).
  - Giao diện Responsive 2 cột / 1 cột trên thiết bị di động (E6).
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 2. Slot 03 - React Component Architecture & React-Bootstrap
- **Thư mục:** [`Slot3/orchid-explorer`](file:///d:/KY7/SBA301/SBA/Slot3/orchid-explorer)
- **Dự án:** **Orchid Explorer Dashboard**
- **Công nghệ:** ReactJS, React-Bootstrap, Bootstrap 5.
- **Thành phần:**
  - `AppNavbar`: Thanh điều hướng đáp ứng (Navbar, Container, Nav).
  - `HeroSection`: Banner giới thiệu với gradient hiện đại và nút CTA.
  - `QuickStats`: 3 Bootstrap Cards thống kê tổng quan (Grid `xs={12} md={4}`).
  - `OrchidGallery`: 6 thẻ hoa lan (Purple Star, Pink Dawn, White Cloud, Golden Sun, Amber Wing, Blue Mist) kèm ảnh SVG đồ họa độc lập tại `public/images/`.
  - `CareTips`: 3 khối hướng dẫn chăm sóc (Light, Water, Airflow).
  - `LearningAlert`: Cảnh báo kiến trúc làm cầu nối sang Props ở Slot 04.
  - `AppFooter`: Footer chuẩn theo giao diện.
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 3. Slot 04 - Props, State, Hooks & Context
- **Thư mục:** [`Slot4/interactive-orchid-explorer`](file:///d:/KY7/SBA301/SBA/Slot4/interactive-orchid-explorer)
- **Dự án:** **Interactive Orchid Explorer**
- **Công nghệ:** ReactJS, Props, State (`useState`), React Context (`useContext`).
- **Thành phần:**
  - Tái sử dụng một component duy nhất `OrchidCard` nhận dữ liệu qua `orchid` prop.
  - Tương tác mở/đóng Modal chi tiết bằng local `showDetail` state.
  - Tương tác đánh dấu yêu thích độc lập bằng local `isFavorite` state.
  - Bộ lọc tìm kiếm theo tên/category và switch lọc hoa đặc biệt (`specialOnly`).
  - Dữ liệu hiển thị `visibleOrchids` được tính toán dưới dạng **derived data** (không lưu thừa state).
  - Chia sẻ thông tin người dùng `currentUser` qua `UserContext.Provider` cho cả Navbar và Footer.
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 4. Slot 05 - Integrated React Lab 01
- **Thư mục:** [`Slot5/eventhub-campus-explorer`](file:///d:/KY7/SBA301/SBA/Slot5/eventhub-campus-explorer)
- **Dự án:** **EventHub - Campus Event Explorer**
- **Công nghệ:** ReactJS, React-Bootstrap, Collection Rendering (`map` + `key`), Modal State.
- **Thành phần:**
  - `src/data/events.js`: Module dữ liệu 8 sự kiện trường đại học với ID chuẩn.
  - `EventList`: Danh sách sự kiện hỗ trợ tìm kiếm, lọc theo dropdown danh mục, switch lọc sự kiện nổi bật (`featuredOnly`), số đếm động và giao diện Empty State.
  - Nút **Reset Filters** tiện lợi khi không tìm thấy kết quả.
  - `EventCard`: Reusable Card với nút "View Detail" kích hoạt Modal chi tiết hiển thị ngày, địa điểm, số ghế trống.
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 5. Slot 06 - React Hooks Comprehensive
- **Thư mục:** [`Slot6/react-hook-product-manager`](file:///d:/KY7/SBA301/SBA/Slot6/react-hook-product-manager)
- **Dự án:** **React Hook Product Manager**
- **Công nghệ:** `useState`, `useEffect`, `useContext`, `useRef`, Custom Hook `useLocalStorage`.
- **Thành phần:**
  - **Full Frontend CRUD**: Thêm, sửa, xóa sản phẩm cập nhật bất biến (immutable spread/filter/map).
  - **Form có kiểm soát & Xác thực (Controlled Form & Validation)**: Kiểm tra tên, danh mục, giá > 0, số lượng >= 0.
  - **Custom Hook `useLocalStorage`**: Tự động đồng bộ hóa danh sách sản phẩm và theme vào `localStorage`.
  - **ThemeContext**: Đổi giao diện Dark / Light toàn ứng dụng thông qua context provider và custom `useTheme`.
  - **useRef DOM Focus**: Tự động focus ô tìm kiếm khi mở trang hoặc khi nhấn nút "Focus".
  - **Thống kê sản phẩm**: Tự động tính số loại sản phẩm, tổng số lượng và tổng giá trị tồn kho bằng `reduce`.
  - **Side Effects**: Cập nhật `document.title` theo số lượng sản phẩm; thông báo tự động ẩn sau 2.5s với cleanup timer.
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 6. Slot 07 - React Router & Navigation
- **Thư mục:** [`Slot7/sba301-event-navigator`](file:///d:/KY7/SBA301/SBA/Slot7/sba301-event-navigator)
- **Dự án:** **Campus Event Navigator**
- **Công nghệ:** `react-router-dom` v6, SPA Navigation.
- **Thành phần:**
  - Cấu hình `BrowserRouter`, `Routes`, `Route`.
  - Điều hướng bằng `Link` và `useNavigate` (chuyển hướng có chủ đích, nút "Go Back" `navigate(-1)`).
  - Dynamic Route `/events/:id` đọc tham số bằng `useParams()`.
  - Xử lý phân tầng lỗi: Phân biệt rõ giữa Route 404 (Wildcard `*` -> `NotFound`) và Resource 404 (id hợp lệ về mặt cú pháp nhưng không có dữ liệu -> `Event Not Found Alert`).
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 7. Slot 08 - Client-Server, HTTP, JSON & Mock REST API
- **Thư mục:** [`Slot8/slot8-product-rest-api-lab`](file:///d:/KY7/SBA301/SBA/Slot8/slot8-product-rest-api-lab)
- **Dự án:** **Product REST API Design and Inspection Kit**
- **Công nghệ:** Node.js, json-server, REST contract, Postman.
- **Thành phần:**
  - `db.seed.json` & `db.json`: 4 bản ghi sản phẩm chuẩn REST.
  - `scripts/parse-json-demo.js`: Thực hành `JSON.parse` và `JSON.stringify`.
  - `scripts/reset-db.js`: Tự động khôi phục dữ liệu gốc sau các bài test phá hủy (POST/PUT/PATCH/DELETE).
  - `docs/api-contract.md`: Tài liệu hợp đồng API mô tả rõ ràng URL, method, headers, request body, response schema, status code.
  - `SBA301_Slot8_Product_API.postman_collection.json`: Bộ Postman collection kiểm thử đầy đủ CRUD.
- **Kiểm tra:** Đã chạy `node scripts/parse-json-demo.js` và `node scripts/reset-db.js` thành công.

---

### 8. Slot 09 - React Router SPA Demo & Nested Routing
- **Thư mục:** [`Slot9/ministore-spa`](file:///d:/KY7/SBA301/SBA/Slot9/ministore-spa)
- **Dự án:** **MiniStore SPA with Nested Routes & URL State**
- **Công nghệ:** `react-router-dom` v6, Nested Layouts, `Outlet`, `useSearchParams`.
- **Thành phần:**
  - `MainLayout` bọc toàn bộ ứng dụng với `<Outlet />`.
  - `DashboardLayout` với các route lồng nhau: `/dashboard` (index `DashboardHome`), `/dashboard/profile`, `/dashboard/orders`.
  - `ProductsPage`: Lưu trạng thái tìm kiếm và danh mục trực tiếp trên URL Query String bằng `useSearchParams` (chia sẻ link và bookmark được).
  - `ProductDetailPage`: Đọc `useParams`, nút quay lại `navigate(-1)`.
  - Redirect khai báo `/home` -> `/`.
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 9. Slot 10 - Orchid Router SPA & Lab 02 Bridge
- **Thư mục:** [`Slot10/orchid-router-demo`](file:///d:/KY7/SBA301/SBA/Slot10/orchid-router-demo)
- **Dự án:** **Orchid Router SPA**
- **Công nghệ:** ReactJS, React-Bootstrap, React Router DOM.
- **Thành phần:**
  - Route map hoàn chỉnh: `/`, `/orchids`, `/orchids/:id`, `/about`, `/contact`, `/dashboard` (nested: index, favorites, profile), 404 wildcard.
  - Lọc theo danh mục cập nhật URL query string qua `useSearchParams`.
  - Trang Contact hỗ trợ submit demo và redirect programmatic về trang chủ.
  - Phân biệt chi tiết giữa dữ liệu truyền qua `location.state` và tải bền vững từ URL `id`.
- **Kiểm tra:** Đã chạy `npm run build` thành công.

---

### 10. Slot 12 - REST Fundamentals with Spring Boot (Part A)
- **Thư mục:** [`Slot12/slot12-rest-design`](file:///d:/KY7/SBA301/SBA/Slot12/slot12-rest-design)
- **Dự án:** **FUNewsManagementSystem REST API Design & Spring Boot Skeleton**
- **Thành phần:**
  - `docs/api-contract-funews.md`: Hợp đồng thiết kế API hoàn chỉnh cho hệ thống FUNews (News, Category, User, Tag, Comment sub-resource).
  - Phân tích chi tiết 5 ràng buộc kiến trúc REST: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System.
  - Dự án Maven Spring Boot 3 + Java 21 skeleton khởi động server nhúng sẵn sàng cho Part B.

---

### 11. Slot 13 - Spring Boot REST Annotations & 3-Layer CRUD (Part B)
- **Thư mục:** [`Slot13/slot13-rest-api`](file:///d:/KY7/SBA301/SBA/Slot13/slot13-rest-api)
- **Dự án:** **News REST API with 3-Layer Architecture**
- **Công nghệ:** Spring Boot 3, Java 21, Spring Web, Maven.
- **Thành phần:**
  - Kiến trúc 3 tầng chuẩn: `NewsController` -> `NewsService` -> `NewsRepository` (ConcurrentHashMap in-memory).
  - Ánh xạ đầy đủ HTTP methods: `@GetMapping`, `@PostMapping` (trả về 201 Created + Header `Location`), `@PutMapping`, `@DeleteMapping` (204 No Content).
  - Ràng buộc tham số với `@PathVariable`, `@RequestParam` (tìm kiếm theo keyword), `@RequestBody`.
  - Quản lý ngoại lệ tập trung qua `@ControllerAdvice` + `@ExceptionHandler` trả về đối tượng `ApiError` chuẩn khi không tìm thấy bản ghi.
  - Postman collection `SBA301_Slot13_News_API.postman_collection.json`.
- **Kiểm tra:** Đã biên dịch `mvn clean test-compile` đạt BUILD SUCCESS.

---

### 12. Slot 14 - Documenting REST Services with OpenAPI / Swagger
- **Thư mục:** [`Slot14/slot14-openapi-demo`](file:///d:/KY7/SBA301/SBA/Slot14/slot14-openapi-demo)
- **Dự án:** **OpenAPI / Swagger Documented REST API**
- **Công nghệ:** Spring Boot 3, Java 21, `springdoc-openapi-starter-webmvc-ui`.
- **Thành phần:**
  - Tích hợp tài liệu trực quan Swagger UI tại `/swagger-ui.html` và đặc tả OpenAPI JSON tại `/v3/api-docs`.
  - Sử dụng đầy đủ annotations: `@Tag`, `@Operation`, `@ApiResponse`, `@ApiResponses`, `@Parameter`, `@Schema`.
  - Cấu hình metadata dự án qua Bean `OpenAPI` trong `OpenApiConfig.java`.
- **Kiểm tra:** Đã biên dịch `mvn clean test-compile` đạt BUILD SUCCESS.

---

### 13. Slot 15 - API Versioning, Paging & Sorting
- **Thư mục:** [`Slot15/slot15-news-paging-api`](file:///d:/KY7/SBA301/SBA/Slot15/slot15-news-paging-api)
- **Dự án:** **News API with Versioning, Paging, Sorting, Page vs Slice**
- **Công nghệ:** Spring Boot 3, Java 21, Spring Data JPA, H2 Database, Pageable, Sort.
- **Thành phần:**
  - Triển khai 4 chiến lược Versioning: Path (`/v1/news`, `/v2/news`), Query Param (`?version=1`), Custom Header (`X-API-Version: 2`), Media Type (`application/vnd.funews.v1+json`).
  - Phân trang & sắp xếp tự động qua Spring Data: `Page<News>` (có count query và tổng số trang) và `Slice<News>` (tối ưu cho infinite scroll).
  - Bộ kiểm soát an toàn (Guardrails): Giới hạn kích thước trang tối đa (`max 100`) và whitelist các trường được phép sắp xếp (`id`, `title`, `publishDate`, `active`).
  - Tự động nạp 35 bản ghi mẫu khi khởi động qua `CommandLineRunner`.
- **Kiểm tra:** Đã biên dịch `mvn clean test-compile` đạt BUILD SUCCESS.

---

### 14. Slot 16 - REST API Testing with MockMvc & Unit Tests
- **Thư mục:** [`Slot16/slot16-testing-mockmvc`](file:///d:/KY7/SBA301/SBA/Slot16/slot16-testing-mockmvc)
- **Dự án:** **Employee Management API with Full Automated Test Suite**
- **Công nghệ:** Spring Boot 3, JUnit 5, Mockito, AssertJ, Spring Test (`MockMvc`, `@WebMvcTest`, `@DataJpaTest`, `@SpringBootTest`).
- **Thành phần kiểm thử:**
  - `EmployeeControllerTest`: Web Slice test với `MockMvc`, giả lập service bằng `@MockBean`, kiểm thử status 200, 201 + Header Location, 404 error case, phân trang JSON path.
  - `EmployeeServiceUnitTest`: Unit test độc lập với Mockito `@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`, `when`, `verify`.
  - `EmployeeRepositoryTest`: Unit test thuần JUnit 5 kiểm thử kho lưu trữ bộ nhớ in-memory.
  - `JpaEmployeeRepositoryTest`: JPA Slice test với `@DataJpaTest` kiểm thử entity mapping và truy vấn tìm theo chức vụ trên H2.
  - `EmployeeServiceIntegrationTest`: Integration test với `@SpringBootTest` kiểm thử context bootstrap và dependency wiring.
- **Kiểm tra:** Đã chạy `mvn clean test` và **toàn bộ 12/12 bài kiểm thử đều PASS (0 failures, 0 errors, BUILD SUCCESS)**.

---

### 15. Slot 17 - JPA Entity, Repository, Service & Relationships
- **Thư mục:** [`Slot17/slot17-funews-demo`](file:///d:/KY7/SBA301/SBA/Slot17/slot17-funews-demo)
- **Dự án:** **FUNews Management JPA Architecture & Relationships**
- **Công nghệ:** Spring Boot 3, Java 21, Spring Data JPA, H2 Database.
- **Thành phần:** Entity mapping quan hệ OneToMany, ManyToOne giữa Category, NewsArticle, Tag; repository truy vấn nghiệp vụ.

---

### 16. Slot 18 - REST Controller & JPA Integration
- **Thư mục:** [`Slot18/slot18-orchid-jpa-rest-lab`](file:///d:/KY7/SBA301/SBA/Slot18/slot18-orchid-jpa-rest-lab)
- **Dự án:** **Orchid JPA REST Lab**
- **Công nghệ:** Spring Boot 3, Spring Data JPA, RESTful Controllers.
- **Thành phần:** Tích hợp đầy đủ tầng REST Controller với Spring Data JPA Repository, chuẩn hóa luồng nghiệp vụ dữ liệu.

---

### 17. Slot 20 - FullStack SPA Architecture (React + Spring Boot + CORS)
- **Thư mục:** [`Slot20/demo_slot20`](file:///d:/KY7/SBA301/SBA/Slot20/demo_slot20)
- **Dự án:** **FullStack SPA Integration & Cross-Origin Resource Sharing**
- **Công nghệ:** Spring Boot REST Backend, React SPA Frontend, CORS configuration.
- **Thành phần:** Cấu hình origin, Preflight OPTIONS, kết nối Frontend Vite ↔ Backend Spring Boot.

---

### 18. Slot 22 - Chapter 15 Part A: CRUD Backend
- **Thư mục:** [`Slot22/demo-slot22-backend`](file:///d:/KY7/SBA301/SBA/Slot22/demo-slot22-backend)
- **Dự án:** **Category CRUD RESTful Web Service**
- **Công nghệ:** Spring Boot 3.2.5, Java 21, Spring Data JPA, Bean Validation, Microsoft SQL Server (`FUNewsManagementSBA301`).
- **Thành phần:**
  - 3 tầng kiến trúc chuẩn: `CategoryController` (`@CrossOrigin`) → `CategoryService` → `CategoryRepository`.
  - Phân trang, tìm kiếm theo tên với Spring Data `Page<CategoryResponse>`.
  - Nghiệp vụ kiểm soát xung đột: `409 Conflict` khi trùng tên hoặc khi xóa danh mục đang có tin tức tham chiếu.
  - Xử lý ngoại lệ tập trung qua `@RestControllerAdvice` (`ApiExceptionHandler`).
- **Kiểm tra:** Đã biên dịch `mvn -q -DskipTests compile` thành công (BUILD SUCCESS).

---

### 19. Slot 23 - Chapter 15 Part B: React CRUD Client (Axios, Forms & API Integration)
- **Thư mục:** [`Slot23`](file:///d:/KY7/SBA301/SBA/Slot23)
  - Dự án chính: [`Slot23/funews-react-client`](file:///d:/KY7/SBA301/SBA/Slot23/funews-react-client)
  - Dự án mở rộng: [`Slot23/orchid-react-client`](file:///d:/KY7/SBA301/SBA/Slot23/orchid-react-client)
- **Dự án:** **FUNews Category React CRUD Client (SPA Integration with Slot 22 Backend)**
- **Công nghệ:** React 18, Vite 8.x, Axios, React Router DOM v6, React-Bootstrap, Bootstrap 5.
- **Tính năng hoàn thành (20/20 tiêu chí theo chuẩn giáo trình Mục 6.19 & 6.20):**
  - **READ**: Tải danh sách phân trang `Page<CategoryResponse>`, giải nén `response.data.content`, số đếm bản ghi `totalElements`.
  - **SEARCH**: Form tìm kiếm theo từ khóa `keyword` với nút Search & Clear, tự động reset về trang 0.
  - **PAGINATION**: Component `PaginationBar` hỗ trợ điều hướng trang hiện tại, Previous, Next và số trang linh hoạt.
  - **CREATE**: Modal `CategoryForm` có kiểm soát (controlled form), xác thực dữ liệu client-side (required, max length 100/250), chuẩn hóa `parentCategoryId`, gửi `POST /api/categories` nhận 201 Created.
  - **UPDATE**: Route độc lập `/categories/:id/edit`, prefill dữ liệu qua `useParams()`, xử lý race-condition bằng cleanup flag, gửi `PUT /api/categories/{id}` nhận 200 OK.
  - **DELETE**: Xóa có hộp thoại xác nhận, quản lý trạng thái pending `deletingId`, bắt lỗi `409 Conflict` (bảo vệ danh mục có tin tức tham chiếu), tự động nạp lại danh sách sau khi xóa.
  - **STATUS BADGES**: Huy hiệu trực quan `Active` (xanh lá) và `Inactive` (xám).
  - **ERROR & RESILIENCE UX**: Xử lý đầy đủ lỗi 400 Bad Request, 404 Not Found, 409 Conflict, lỗi mất kết nối backend bằng Alert UI.
  - **SEPARATED API MODULE**: Đóng gói toàn bộ HTTP calls trong `api/axiosClient.js` và `api/categoryApi.js`, không hard-code URL.
  - **CONFIG & ENV**: Quản lý endpoint qua `.env` (`VITE_API_URL=http://localhost:8080/api`).
- **Kiểm tra:** Đã chạy `npm run build` cho cả 2 dự án client đạt 100% SUCCESS, không có bất kỳ lỗi cú pháp hay cảnh báo nào.

---

### 20. Slot 24 - Chapter 16 Part A: Securing REST Services with Spring Boot (Concepts, OAuth 2.0 & JWT)
- **Thư mục:** [`Slot24`](file:///d:/KY7/SBA301/SBA/Slot24)
- **Tài liệu & Nghiên cứu:** [`Slot24/README.md`](file:///d:/KY7/SBA301/SBA/Slot24/README.md)
- **Postman Collection:** [`Slot24/SBA301_Slot24_Security_Collection.postman_collection.json`](file:///d:/KY7/SBA301/SBA/Slot24/SBA301_Slot24_Security_Collection.postman_collection.json)
- **Chủ đề & Nội dung hoàn thành:**
  - **Core Mental Model**: Phân biệt bản chất giữa Authentication ("Bạn là ai?") và Authorization ("Bạn được phép làm gì?"); ranh giới bảo mật (Security Boundary) trong kiến trúc REST.
  - **Kiến trúc so sánh**: State-ful Session (Cookie/JSESSIONID) vs Stateless Token (JWT Bearer); ưu nhược điểm trong hệ thống phân tán và SPA.
  - **OAuth 2.0 vs JWT**: 4 vai trò OAuth 2.0 (Resource Owner, Client, Authorization Server, Resource Server); khẳng định JWT là token format, OAuth 2.0 là authorization framework.
  - **Giải phẫu JWT (JWT Anatomy)**: Header (`alg`, `typ`), Payload (Registered claims `sub`, `iat`, `exp`), Signature (HMAC-SHA256 vs Asymmetric RSA/ECDSA); phân biệt giữa mã hóa (encryption) và chữ ký (digital signature/integrity).
  - **Spring Security Request Lifecycle**: Phân tích tường tận chuỗi filter `SecurityFilterChain` -> `CorsFilter` -> `JwtAuthenticationFilter` -> `AuthenticationManager` -> `DaoAuthenticationProvider` -> `UserDetailsService` -> `PasswordEncoder` -> `SecurityContextHolder`.
  - **Break-It -> Diagnose -> Fix**: Bảng chẩn đoán 7 kịch bản lỗi bảo mật thường gặp trong dự án thực tế kèm nguyên nhân và cách khắc phục.
  - **Call Stack Tracing**: Bản đồ truy vết method call end-to-end cho cả 2 chiều Login request và Protected Bearer request.
  - **Kiểm tra cổng tích hợp**: Hoàn thành 12/12 tiêu chí Integration Gate G1 - G12.

---

### 21. Slot 25 - Chapter 16 Part B: Authentication & Authorization JWT Implementation (Lab 06)
- **Thư mục dự án:** [`Slot25/slot25-security-jwt`](file:///d:/KY7/SBA301/SBA/Slot25/slot25-security-jwt)
- **Tài liệu chi tiết:** [`Slot25/README.md`](file:///d:/KY7/SBA301/SBA/Slot25/README.md)
- **Postman Collection:** [`Slot25/SBA301_Slot25_Security_JWT.postman_collection.json`](file:///d:/KY7/SBA301/SBA/Slot25/SBA301_Slot25_Security_JWT.postman_collection.json)
- **Công nghệ:** Spring Boot 3.3.4, Java 21, Spring Security 6.x, Spring Data JPA, Bean Validation, JJWT 0.12.6, Microsoft SQL Server & H2 Database, MockMvc.
- **Hiện thực hóa trọn vẹn 21 bước kỹ thuật (Step 1 → Step 21 theo chuẩn Lab 06 & Giáo trình Chapter 16 Part B):**
  - **Step 1 & 2**: Khởi tạo dependencies chuẩn (Spring Web, Security, Data JPA, Validation, SQL Server, JJWT) và cấu hình Base64 secret key 512 bits, expiration 15 phút.
  - **Step 3 & 4**: Entity `AppUser` (`id`, `email` unique, `password` hash, `role`, `enabled`) và repository `AppUserRepository` (`findByEmail`, `existsByEmail`).
  - **Step 5**: Thiết kế DTOs dạng Record chuẩn Java 21: `SignupRequest`, `LoginRequest`, `AuthResponse`, `UserResponse`, `OrchidRequest`, `OrchidResponse`, `ApiErrorResponse`.
  - **Step 6, 7 & 8**: Cấu hình bean `BCryptPasswordEncoder`, `UserDetailsService` ánh xạ sang `UserDetails`, `DaoAuthenticationProvider` và `AuthenticationManager`.
  - **Step 9 & 11**: `AuthService` xử lý nghiệp vụ đăng ký (kiểm tra trùng lặp email trả về `409 Conflict`, mã hóa mật khẩu) và đăng nhập (xác thực qua `AuthenticationManager`, sinh token).
  - **Step 10**: `JwtService` triển khai thư viện JJWT 0.12.6, ký HMAC-SHA256, parse claims, trích xuất roles, kiểm tra tính hợp lệ và thời hạn hết hạn của token.
  - **Step 12**: `JwtAuthenticationFilter` kế thừa `OncePerRequestFilter`, phân tích `Authorization: Bearer <token>`, nạp danh tính và gắn `UsernamePasswordAuthenticationToken` vào `SecurityContextHolder`.
  - **Step 13**: Cấu hình `SecurityFilterChain` chuẩn stateless REST: CORS cho phép React SPA, tắt CSRF, định tuyến public (`/auth/**`, `GET /orchids/**`) và protected (`/users/**`, `/admin/**`, CRUD hoa lan).
  - **Step 14 & 15**: Controllers `AuthController` (`POST /auth/signup` 201 Created, `POST /auth/login` 200 OK + Bearer token) và `UserController` (`GET /users/me` đọc Principal từ SecurityContext, `GET /users`).
  - **Step 16**: `OrchidController` triển khai CRUD hoa lan: GET công khai, POST/PUT yêu cầu đăng nhập, DELETE phân quyền riêng cho `ROLE_ADMIN` (`@PreAuthorize("hasRole('ADMIN')")`).
  - **Step 17**: Tùy biến `RestAuthenticationEntryPoint` (JSON 401) và `RestAccessDeniedHandler` (JSON 403), không trả về trang lỗi HTML mặc định của Spring.
  - **Step 18 & 19**: Tài liệu hóa và kiểm chứng luồng trace method call end-to-end cho cả 2 chiều đăng nhập và gọi API bảo vệ.
  - **Step 20 & 21**: Bộ 15 bài kiểm thử tích hợp tự động với `MockMvc` bao phủ 100% các nhánh positive và negative.
- **Kiểm tra tự động:** Chạy `mvn clean test` **toàn bộ 15/15 bài kiểm thử đều PASS (0 Failures, 0 Errors, BUILD SUCCESS)**.

---

### 22. Lab 06 - Secure REST Services with Spring Boot using JSON Web Token (JWT) Guide V2
- **Thư mục dự án:** [`SBA301-Lab06/lab06jwt`](file:///d:/KY7/SBA301/SBA/SBA301-Lab06/lab06jwt)
- **Tài liệu chi tiết:** [`SBA301-Lab06/README.md`](file:///d:/KY7/SBA301/SBA/SBA301-Lab06/README.md)
- **Postman Collection:** [`SBA301-Lab06/SBA301_Lab06_Security_JWT.postman_collection.json`](file:///d:/KY7/SBA301/SBA/SBA301-Lab06/SBA301_Lab06_Security_JWT.postman_collection.json)
- **Công nghệ & Baseline:** Spring Boot 3.3.4, Java 21 LTS, JJWT 0.12.6, Spring Security, Spring Data JPA, Jakarta Validation, SQL Server (`OrchidJWTLab`) & H2 in-memory test.
- **Cấu trúc package mục tiêu:** `fu.se.lab06jwt` theo sát tài liệu `SBA301_Lab06_Detailed_Step_by_Step_Spring_Security_JWT_Guide_V2.pdf`.
- **Thành phần kiến trúc:**
  - `User`: Entity ánh xạ bảng `users`, implements `UserDetails`, tự động cập nhật timestamp, bảo mật mật khẩu.
  - `UserRepository`: Truy vấn JPA `findByEmail` và `existsByEmail`.
  - `RegisterUserDto`, `LoginUserDto`: Kiểm soát dữ liệu đầu vào bằng Bean Validation (`@NotBlank`, `@Email`, `@Size(min=8, max=72)`).
  - `LoginResponse`, `UserResponse`: Record response loại bỏ hoàn toàn việc để lộ hash password ra bên ngoài.
  - `ApplicationConfiguration`: Đăng ký `UserDetailsService`, `PasswordEncoder` (BCrypt), `DaoAuthenticationProvider`, `AuthenticationManager`.
  - `JwtService`: Thư viện JJWT 0.12.6 với HMAC-SHA256, Base64 secret key 512-bit, giải mã claims an toàn, kiểm tra exp & signature.
  - `JwtAuthenticationFilter`: `OncePerRequestFilter` trích xuất `Bearer <JWT>`, thẩm định token và thiết lập danh tính vào `SecurityContextHolder`.
  - `SecurityConfiguration`: Cấu hình stateless session, vô hiệu hóa CSRF, mở `/auth/**`, bảo vệ `/users/**`, trả về 401 Unauthorized chuẩn xác qua `authenticationEntryPoint`.
  - `AuthenticationService`, `AuthenticationController`: Xử lý nghiệp vụ đăng ký (201 Created), đăng nhập (200 OK + JWT).
  - `GlobalExceptionHandler`: Xử lý lỗi trùng lặp (409 Conflict), sai mật khẩu (401 Unauthorized), lỗi validation (400 Bad Request).
  - `UserService`, `UserController`: Cung cấp `/users/me` (đọc principal hiện tại) và `/users` (danh sách người dùng an toàn).
- **Kiểm thử tự động:** Bộ 12 automated security tests tại `SecurityContractTest` đạt **12/12 PASS (BUILD SUCCESS)**, bao phủ toàn bộ Test Matrix T01 - T12.


