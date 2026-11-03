# BÁO CÁO KỸ THUẬT & HƯỚNG DẪN DEMO CHI TIẾT
## ASSIGNMENT 02 - FU NEWS MANAGEMENT SYSTEM
**Môn học:** SBA301 - Integrate Single Page Application with Spring Boot  
**Học kỳ:** Fall 2024 / Spring 2025  
**Sinh viên thực hiện:** TRẦN HIỂN VINH  
**MSSV:** CE190881  
**Lớp:** SE1910  
**Cơ sở dữ liệu:** `A2TranHienVinh_SE1910` / `FUNewsManagementSBA301`

---

## PHẦN I: ĐỀ BÀI & YÊU CẦU NGHIỆP VỤ (REQUIREMENTS)

### 1.1. Mục tiêu đồ án
Xây dựng ứng dụng Single Page Application (SPA) kết hợp Spring Boot 3 RESTful API theo mô hình phân tầng chuẩn mực (3-Layer Architecture) để quản trị hệ thống bài viết tin tức tại Đại học FPT.

### 1.2. Phân quyền và Vai trò (User Roles)
1. **Public Guest (Khách vãng lai):** Không cần đăng nhập. Xem toàn bộ bài viết tin tức Active (`NewsStatus = 1`), lọc theo Category, tìm kiếm theo từ khóa tiêu đề hoặc nội dung.
2. **Administrator (Role = 1):** Quản lý tài khoản người dùng (`SystemAccount`). Xem danh sách, tạo mới, chỉnh sửa thông tin và xóa tài khoản.
3. **Staff (Role = 2):** Quản lý bài viết tin tức (`NewsArticle`) và danh mục (`Category`). Xem lịch sử các bài viết do chính mình khởi tạo, cập nhật hồ sơ cá nhân.

### 1.3. Các Ràng buộc Nghiệp vụ (Business Rules)
- **Chặn xóa tài khoản:** Nếu tài khoản `SystemAccount` đã từng tạo ít nhất một bài viết trong bảng `NewsArticle`, hệ thống kiên quyết từ chối xóa và trả về thông báo lỗi `400 Bad Request`.
- **Chặn xóa chuyên mục:** Nếu `Category` đang chứa bài viết hoặc đang là danh mục cha của các danh mục khác, hệ thống không cho phép xóa.
- **Lịch sử bài viết:** Nhân viên chỉ được xem và quản lý danh sách các bài viết do chính tài khoản của mình khởi tạo (`CreatedByID = loggedUserId`).

---

## PHẦN II: KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP KỸ THUẬT

### 2.1. Kiến trúc Đa tầng (3-Layer Architecture)
- **Entity Layer:** Ánh xạ bảng CSDL SQL Server gồm `SystemAccount`, `Category`, `NewsArticle`, `Tag`.
- **Repository Layer:** Kế thừa `JpaRepository`, cung cấp các phương thức truy vấn tối ưu và kiểm tra quan hệ ràng buộc (`existsByCreatedBy_AccountID`, `existsByParentCategory_CategoryID`, `existsByCategory_CategoryID`).
- **Service Layer:** Xử lý toàn bộ logic nghiệp vụ, quản lý transaction (`@Transactional`), kiểm tra tính hợp lệ dữ liệu.
- **Controller Layer:** Tiếp nhận HTTP Request, xác thực đầu vào (`@Valid`), trả về mã HTTP chuẩn mực (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
- **Frontend Layer:** ReactJS 18 Single Page Application khởi tạo bằng Vite, quản lý route bằng React Router DOM v6, giao diện React-Bootstrap, gọi API qua Axios client.

---

## PHẦN III: HÌNH ẢNH DEMO THỰC TẾ HỆ THỐNG (CAPTURED SCREENSHOTS)

Dưới đây là các hình ảnh giao diện thực tế được chụp trực tiếp khi hệ thống đang vận hành:

### 1. Trang chủ Tin tức (Public Home)
![Public Home](screenshots/01_A2_Public_HomePage.png)
*Hình 1: Danh sách bài viết Active, các thẻ danh mục Category và thanh điều hướng chính.*

### 2. Tìm kiếm & Lọc bài viết
![Search and Filter](screenshots/02_A2_Public_SearchFilter.png)
*Hình 2: Chức năng lọc tin tức theo từ khóa và danh mục.*

### 3. Trang Đăng nhập hệ thống
![Login Page](screenshots/03_A2_LoginPage.png)
*Hình 3: Giao diện đăng nhập hỗ trợ cả Administrator và Staff.*

### 4. Màn hình Quản lý Tài khoản (Administrator)
![Admin Account Management](screenshots/04_A2_Admin_AccountManagement.png)
*Hình 4: Bảng danh sách tài khoản, phân loại vai trò và trạng thái.*

### 5. Modal Tạo mới/Chỉnh sửa Tài khoản
![Create Account Modal](screenshots/05_A2_Admin_CreateAccount_Modal.png)
*Hình 5: Popup tạo tài khoản với form nhập liệu đầy đủ.*

### 6. Màn hình Quản lý Bài viết Tin tức (Staff)
![Staff News Management](screenshots/06_A2_Staff_NewsManagement.png)
*Hình 6: Danh sách bài viết tin tức, gắn thẻ Tags và các nút thao tác.*

### 7. Modal Tạo mới Bài viết Tin tức
![Create News Modal](screenshots/07_A2_Staff_CreateNews_Modal.png)
*Hình 7: Form soạn thảo tin tức, chọn chuyên mục và gắn thẻ tags.*

### 8. Màn hình Quản lý Chuyên mục (Category)
![Category Management](screenshots/08_A2_Staff_CategoryManagement.png)
*Hình 8: Quản lý danh mục tin tức cha - con và trạng thái hoạt động.*

### 9. Màn hình Hồ sơ Cá nhân (Staff Profile)
![Staff Profile](screenshots/09_A2_Staff_Profile.png)
*Hình 9: Xem và cập nhật thông tin cá nhân của nhân viên.*

### 10. Màn hình Lịch sử Bài viết do Nhân viên khởi tạo
![Staff History](screenshots/10_A2_Staff_MyHistory.png)
*Hình 10: Danh sách bài viết chỉ thuộc về nhân viên đang đăng nhập.*

---

## PHẦN IV: GIẢI THÍCH MÃ NGUỒN CHI TIẾT

### 4.1. Chặn xóa Account nếu đã tạo bài viết (`SystemAccountServiceImpl.java`)
```java
@Override
@Transactional
public void deleteAccount(Short accountId) {
    SystemAccount account = systemAccountRepository.findById(accountId)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
            
    // Business Rule: Chặn xóa nếu đã có bài viết tin tức
    boolean hasNews = newsArticleRepository.existsByCreatedBy_AccountID(accountId);
    if (hasNews) {
        throw new BadRequestException("Không thể xóa tài khoản này vì tài khoản đã tạo bài viết tin tức!");
    }
    systemAccountRepository.delete(account);
}
```

### 4.2. Chặn xóa Category nếu đang chứa bài viết (`CategoryServiceImpl.java`)
```java
@Override
@Transactional
public void deleteCategory(Short categoryId) {
    Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

    if (categoryRepository.existsByParentCategory_CategoryID(categoryId)) {
        throw new BadRequestException("Không thể xóa chuyên mục này vì đang có chuyên mục con trực thuộc!");
    }
    if (newsArticleRepository.existsByCategory_CategoryID(categoryId)) {
        throw new BadRequestException("Không thể xóa chuyên mục này vì đang có bài viết thuộc chuyên mục!");
    }
    categoryRepository.delete(category);
}
```
