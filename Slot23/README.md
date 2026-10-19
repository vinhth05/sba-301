# SBA301 - Slot 23 - Chapter 15 Part B: React CRUD Client (Axios, Forms, UI State & API Integration)

**Sinh viên:** Trần Hiển Vinh (CE190881)  
**Lớp:** SE1910  
**Môn học:** SBA301 – Integrate Single Page Application with Spring Boot  
**Chủ đề:** Chapter 15 Part B – React CRUD Client • Axios • Forms • UI State • API Integration  

---

## 📌 Tổng Quan Dự Án (Overview)

Slot 23 tiếp nối trực tiếp từ **Slot 22 (CRUD Backend)**, hiện thực hóa kiến trúc Full-Stack SPA hoàn chỉnh:
```
[User Action] 
     ↓ 
[React Component / Page State] 
     ↓ 
[Category API Module] 
     ↓ 
[Axios HTTP Client] (baseURL: http://localhost:8080/api)
     ↓ 
[REST HTTP Calls] 
     ↓ 
[Spring Boot 3 REST Controller] (Slot 22 Backend @ localhost:8080)
     ↓ 
[Service Layer] → [Repository] → [Hibernate JPA] → [SQL Server (FUNewsManagementSBA301)]
```

Thư mục `Slot23` cung cấp đầy đủ 2 phiên bản theo tài liệu giáo trình:
1. **`funews-react-client` (Phiên bản chính hệ thống FUNewsManagementSystem - Theo giáo trình V1 & Slot 22 Backend):**
   - Tiêu thụ trực tiếp REST API Category từ backend Slot 22 (`http://localhost:8080/api/categories`).
   - Xử lý cấu trúc dữ liệu Spring Data `Page<CategoryResponse>` (`response.data.content`, `totalElements`, `totalPages`, phân trang chuẩn).
   - Đầy đủ 20 tiêu chí theo Mục 6.19 & 6.20 của giáo trình.
2. **`orchid-react-client` (Phiên bản gốc Orchid Management - Baseline Course):**
   - Thao tác CRUD cho danh thể hoa lan theo giáo trình Chapter 15 Part B cơ bản.

---

## 🛠 Công Nghệ & Thư Viện (Tech Stack)

- **Node.js**: v24.x LTS
- **Build Tool**: Vite 8.x
- **Frontend Framework**: React 18 / 19
- **HTTP Client**: Axios
- **Routing**: `react-router-dom` v6
- **UI & Layout**: React-Bootstrap & Bootstrap 5
- **Backend tương thích**: Spring Boot 3.2.x (tại `Slot22/demo-slot22-backend`) trên cổng `8080`

---

## 🏗 Cấu Trúc Dự Án `funews-react-client`

```
funews-react-client/
├── .env                         # VITE_API_URL=http://localhost:8080/api
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── api/
    │   ├── axiosClient.js       # Cấu hình Axios instance (baseURL, headers, timeout 10s, interceptors)
    │   └── categoryApi.js       # Module gọi API REST (getCategories, getById, create, update, delete)
    ├── components/
    │   ├── AppNavBar.jsx        # Navigation bar giao diện hiện đại với brand và menu
    │   ├── CategoryForm.jsx     # Reusable Modal Form tạo mới Category với controlled input & client validation
    │   └── PaginationBar.jsx    # Thanh phân trang điều hướng linh hoạt (trang hiện tại, previous, next)
    ├── pages/
    │   ├── CategoryList.jsx     # Trang danh sách: tìm kiếm, bảng dữ liệu, active badge, delete confirmation, 409 rule
    │   └── EditCategory.jsx     # Trang chỉnh sửa (/categories/:id/edit) tải dữ liệu qua useParams, PUT update
    ├── App.jsx                  # Cấu hình định tuyến Route (/, /categories, /categories/:id/edit, wildcard)
    ├── main.jsx                 # Bootstrap CSS, BrowserRouter, React StrictMode
    └── index.css                # CSS thiết kế hiện đại, responsive, shadow, spacing
```

---

## 🎯 20 Tiêu Chí Hoàn Thành (Definition of Done - Mục 6.19)

| STT | Tiêu chí | Trạng thái | Hiện thực chi tiết |
|:---:|---|:---:|---|
| 1 | **Category List** | ✅ PASS | Hiển thị bảng Responsive với ID, CategoryName, Description, ParentID, Status, Actions |
| 2 | **Search theo Name** | ✅ PASS | Ô tìm kiếm có nút Search và Clear, tự động reset về `page = 0` |
| 3 | **Pagination** | ✅ PASS | Đọc metadata từ `Page<CategoryResponse>` (`totalElements`, `totalPages`), điều hướng Previous/Next linh hoạt |
| 4 | **Create Category** | ✅ PASS | Modal popup nhập liệu form có kiểm soát, gửi `POST /api/categories`, nhận `201 Created` |
| 5 | **Edit Category** | ✅ PASS | Route độc lập `/categories/:id/edit`, prefill dữ liệu từ `GET /api/categories/{id}`, gửi `PUT` lưu thay đổi |
| 6 | **Delete Category** | ✅ PASS | Nút Delete kèm hộp thoại xác nhận `window.confirm`, gửi `DELETE /api/categories/{id}` |
| 7 | **Active/Inactive Status** | ✅ PASS | Badge màu xanh lá (`Active`) và xám (`Inactive`) trực quan |
| 8 | **Parent Category ID** | ✅ PASS | Xử lý giá trị rỗng thành `null`, chuyển đổi đúng kiểu `Number` sang backend |
| 9 | **Client Validation** | ✅ PASS | Kiểm tra bắt buộc nhập Name, Description, giới hạn độ dài 100/250 ký tự trước khi gửi request |
| 10 | **Backend Validation Handling** | ✅ PASS | Bắt mã lỗi `400 Bad Request` và hiển thị chi tiết thông báo lỗi từ server |
| 11 | **404 Not Found Handling** | ✅ PASS | Thông báo rõ ràng khi truy cập id không tồn tại hoặc tài nguyên đã bị xóa |
| 12 | **409 Duplicate Name Handling** | ✅ PASS | Thông báo lỗi xung đột tên danh mục đã tồn tại khi Create hoặc Update |
| 13 | **409 Referenced Category Rule** | ✅ PASS | Bắt lỗi nghiệp vụ: không cho xóa danh mục đang có tin tức tham chiếu, giữ nguyên dòng trên UI |
| 14 | **Loading State** | ✅ PASS | Spinner xoay tròn và nhãn "Loading categories..." khi đang fetch dữ liệu |
| 15 | **Empty State** | ✅ PASS | Giao diện thân thiện "No categories found." khi không có dữ liệu hoặc tìm kiếm không khớp |
| 16 | **Mutation Pending State** | ✅ PASS | Nút chuyển sang "Saving..." / "Deleting..." và bị disabled để tránh double submit |
| 17 | **Error State** | ✅ PASS | Khối `Alert variant="danger"` có nút đóng dismissible hiển thị thông báo lỗi rõ ràng |
| 18 | **API Module riêng biệt** | ✅ PASS | Toàn bộ lệnh gọi Axios nằm trong `api/categoryApi.js`, không viết lệnh HTTP vụn vặt trong UI |
| 19 | **Routing chuẩn** | ✅ PASS | Sử dụng `react-router-dom` với Redirect `/` → `/categories`, Route Edit có dynamic `:id` |
| 20 | **Không hard-code API URL** | ✅ PASS | Toàn bộ URL cấu hình qua `.env` (`VITE_API_URL=http://localhost:8080/api`) |

---

## 🔄 Trace Hai Luồng Vòng Đời Chính (Execution Lifecycles)

### 1. READ Lifecycle (Đọc danh sách phân trang)
```
CategoryList (useEffect) 
   → loadCategories() 
   → categoryApi.getCategories({ keyword, page, size, sort })
   → axiosClient.get("/categories?keyword=...&page=0&size=10&sort=categoryName,asc")
   → Spring Boot CategoryController.getAll()
   → CategoryServiceImpl.findAll()
   → CategoryRepository.findByCategoryNameContainingIgnoreCase()
   → SQL Server: SELECT * FROM Category WHERE ... ORDER BY CategoryName OFFSET 0 ROWS FETCH NEXT 10 ROWS
   → Backend trả về Page<CategoryResponse> (HTTP 200 OK)
   → setCategories(response.data.content), setTotalElements(...), setTotalPages(...)
   → React re-render Table + PaginationBar
```

### 2. CREATE Lifecycle (Tạo mới Category qua Modal)
```
User click "Create Category" → Modal hiển thị → User nhập form
   → Submit Form → validate() client-side
   → build payload (chuẩn hóa parentCategoryId "" → null, boolean active)
   → categoryApi.createCategory(payload)
   → axiosClient.post("/categories", payload)
   → Spring Boot CategoryController.create()
   → CategoryServiceImpl.create() [Kiểm tra trùng tên CategoryName]
   → CategoryRepository.save() → Hibernate INSERT INTO Category
   → SQL Server COMMIT
   → Backend trả về CategoryResponse (HTTP 201 Created)
   → Form đóng modal → Gọi onCreated() callback
   → setPage(0) → loadCategories() refetch dữ liệu mới nhất
   → UI hiển thị bản ghi mới vừa tạo
```

---

## 🧪 Bảng Kiểm Thử Toàn Diện (Test Matrix)

| Test ID | Tình huống | Thao tác | Kỳ vọng Frontend / HTTP Status |
|:---:|---|---|---|
| **P01** | Lấy danh sách ban đầu | Vào `/categories` | Gọi `GET /api/categories`, HTTP 200, hiển thị bảng danh sách |
| **P02** | Tìm kiếm theo tên | Nhập từ khóa + Click Search | URL có `?keyword=...&page=0`, hiển thị kết quả lọc |
| **P03** | Chuyển trang phân trang | Click nút "Next" hoặc số trang | Gọi `GET` với `page=1`, bảng hiển thị dữ liệu trang tiếp theo |
| **P04** | Thêm mới hợp lệ | Nhập tên & mô tả hợp lệ → Save | Gửi `POST`, HTTP 201 Created, modal đóng, nạp lại danh sách |
| **P05** | Chỉnh sửa danh mục | Mở `/categories/{id}/edit` → Save | Gửi `PUT`, HTTP 200 OK, điều hướng về `/categories` kèm thông báo |
| **P06** | Xóa danh mục không bị ràng buộc | Click Delete → OK | Gửi `DELETE`, HTTP 204 No Content, dòng biến mất khỏi bảng |
| **N01** | Backend chưa khởi động | F5 trang khi tắt Spring Boot | Hiển thị Alert báo lỗi kết nối, ứng dụng không bị crash màn hình trắng |
| **N02** | Bỏ trống Category Name | Bỏ trống ô Name → Click Save | Client validation chặn submit, báo "Category name is required" |
| **N03** | Trùng tên Category | Nhập tên Category đã tồn tại | Backend trả `409 Conflict`, UI hiển thị thông báo trùng tên |
| **N04** | Xóa Category đang có tin tức | Xóa Category đang được bảng `NewsArticle` khóa ngoại | Backend trả `409 Conflict`, UI báo lỗi ràng buộc nghiệp vụ, bản ghi vẫn giữ nguyên |
| **N05** | Truy cập ID không tồn tại | Mở `/categories/99999/edit` | Backend trả `404 Not Found`, hiển thị thông báo danh mục không tồn tại |

---

## 🚀 Hướng Dẫn Khởi Chạy (Execution Guide)

### 1. Khởi chạy Backend (Slot 22)
```powershell
cd D:\KY7\SBA301\SBA\Slot22\demo-slot22-backend

# Biên dịch mã nguồn
mvn -q -DskipTests compile

# Khởi chạy Spring Boot server trên port 8080
mvn spring-boot:run
```

### 2. Khởi chạy Frontend React SPA (Slot 23)
```powershell
cd D:\KY7\SBA301\SBA\Slot23\funews-react-client

# Cài đặt thư viện nếu chưa có
npm install

# Khởi động máy chủ phát triển Vite
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: **`http://localhost:5173`** (hoặc port do Vite phân bổ).

### 3. Kiểm tra bản build Production
```powershell
npm run build
```
Build hoàn tất thành công không có bất kỳ cảnh báo hoặc lỗi nào.
