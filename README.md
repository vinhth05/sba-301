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

