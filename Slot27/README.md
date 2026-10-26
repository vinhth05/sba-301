# SBA301 - Slot 27: Security Review & Lab 06 Consolidation Checkpoint

> **Sinh viên:** Trần Hiển Vinh (CE190881)  
> **Lớp:** SE1910  
> **Môn học:** SBA301 – Integrate Single Page Application with Spring Boot  
> **Chủ đề:** Chapter 16 Review • Security Consolidation • JWT / CORS / Role-based Access Control Checkpoint  

---

## 📌 1. Mục tiêu và Ý nghĩa của Slot 27

Slot 27 đóng vai trò là trạm kiểm soát chất lượng (Quality Checkpoint) toàn diện cho toàn bộ chuỗi kiến trúc bảo mật **Spring Security + JWT + CORS** (Chapter 16: Slot 24 - Slot 26) trước khi chuyển giao sang **Chapter 17 (Hibernate Architecture & Mapping)**.

### Bảng Ma trận Kiểm thử An ninh Hợp nhất (Consolidated Security Matrix)

| STT | Kịch bản kiểm thử (Test Scenario) | Endpoint | Header / Payload | Kết quả mong đợi | Ý nghĩa an ninh |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **T01** | Public Signup | `POST /auth/signup` | Valid Email + Password | `201 Created` | Hash BCrypt trong DB, không bao giờ lộ mật khẩu |
| **T02** | Signup trùng Email | `POST /auth/signup` | Duplicate Email | `409 Conflict` | Bảo vệ tính toàn vẹn định danh người dùng |
| **T03** | Public Login hợp lệ | `POST /auth/login` | Valid Credentials | `200 OK` + JWT | Trả về Access Token có chữ ký số (JJWT) |
| **T04** | Login sai mật khẩu | `POST /auth/login` | Wrong Password | `401 Unauthorized` | Chặn đăng nhập trái phép |
| **T05** | Truy cập không có Token | `GET /users/me` | No Authorization Header | `401 Unauthorized` | Bảo vệ Endpoint yêu cầu đăng nhập |
| **T06** | Token bị sửa đổi (Tampered) | `GET /users/me` | Sửa 1 ký tự trong JWT | `401 Unauthorized` | Signature Verification thất bại, từ chối ngay lập tức |
| **T07** | Token hết hạn (Expired) | `GET /users/me` | Expired Bearer Token | `401 Unauthorized` | Claims Validation chặn token cũ |
| **T08** | USER truy cập Endpoint USER | `GET /users/me` | Valid USER Token | `200 OK` | Lấy đúng thông tin Principal đăng nhập |
| **T09** | USER truy cập Endpoint ADMIN | `GET /admin/users` | Valid USER Token | `403 Forbidden` | Phân quyền Role-based: Có xác thực nhưng không đủ quyền |
| **T10** | ADMIN truy cập Endpoint ADMIN | `GET /admin/users` | Valid ADMIN Token | `200 OK` | Quản trị viên thực thi toàn quyền |
| **T11** | Preflight CORS Request | `OPTIONS /users` | Origin: `http://localhost:5173` | `200 OK` + Headers | Browser cho phép frontend JavaScript gọi API |

---

## 🔍 2. Phân biệt Bản chất: 401 Unauthorized vs 403 Forbidden vs Lỗi CORS

1. **`401 Unauthorized` (Chưa chứng minh được danh tính):**
   - Không gửi token, token sai cú pháp, token hết hạn, signature không khớp hoặc password sai.
   - **Xử lý:** Người dùng cần đăng nhập lại để nhận token mới hợp lệ.

2. **`403 Forbidden` (Đã biết danh tính, nhưng không có thẩm quyền):**
   - Đã gửi token hợp lệ, danh tính được xác minh (ví dụ Role = `USER`), nhưng endpoint chỉ cho phép Role = `ADMIN`.
   - **Xử lý:** Không phải lỗi đăng nhập; hệ thống từ chối truy cập vì không đủ đặc quyền.

3. **Lỗi CORS (Cross-Origin Resource Sharing):**
   - Xảy ra tại **Trình duyệt (Browser-side Enforcement)** trước hoặc sau khi request gửi đến server khi frontend (port 5173/3000) gọi API (port 8080).
   - Server phải xử lý Preflight `OPTIONS` và phản hồi các headers:
     * `Access-Control-Allow-Origin`
     * `Access-Control-Allow-Methods`
     * `Access-Control-Allow-Headers`
     * `Access-Control-Allow-Credentials: true`

---

## 🎯 3. Kết luận chuyển giao sang Slot 28 & 29

- Kiến trúc Security JWT đã hoàn tất 100% (17/17 Integration Tests Pass trong Slot 26).
- Sẵn sàng bước vào **Slot 28 (Hibernate Architecture & HQL)** và **Slot 29 (Many-to-Many & DAO/Repository/Service Layering)**.
