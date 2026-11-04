# TRƯỜNG ĐẠI HỌC FPT CẦN THƠ
## BỘ MÔN KỸ THUẬT PHẦN MỀM (SOFTWARE ENGINEERING)
---
# BÁO CÁO TỔNG HỢP GIAO DIỆN & TẤT CẢ CHỨC NĂNG HỆ THỐNG
## ASSIGNMENT 03 - FU MINI HOTEL SYSTEM
**Môn học:** SBA301 - Integrate Single Page Application with Spring Boot  
**Học kỳ:** Fall 2024 / Spring 2025  
**Sinh viên thực hiện:** TRẦN HIỂN VINH  
**MSSV:** CE190881  
**Lớp:** SE1910  
**Tên Cơ sở dữ liệu:** `A3TranHienVinh_SE1910`  
**Nền tảng công nghệ:** Spring Boot 3 + Spring Security 6 + JJWT + ReactJS (Vite) + Microsoft SQL Server  

---

## I. TỔNG QUAN ĐỀ BÀI & DANH MỤC YÊU CẦU NGHIỆP VỤ (REQUIREMENTS SPECIFICATION)

### 1.1. Bối cảnh & Mục tiêu đề tài
Hệ thống Quản lý Khách sạn mini (FUMiniHotelSystem) được thiết kế nhằm tự động hóa toàn bộ quy trình đặt phòng, quản lý thông tin khách hàng, phòng ở và các giao dịch tài chính.

Yêu cầu cốt lõi của Assignment 03 là tích hợp cơ chế Bảo mật chuẩn doanh nghiệp bằng Spring Security 6 và JSON Web Token (JWT), hỗ trợ cơ chế xác thực phân luồng độc đáo cho nhân viên và khách hàng, kết hợp Single Page Application ReactJS.

### 1.2. Quy định kỹ thuật bắt buộc từ Đề bài (PDF Specification)
- **Cơ chế Xác thực Kép (Dual Authentication):**
  - **Tài khoản Staff:** ĐƯỢC ĐỌC TRỰC TIẾP TỪ FILE `application.properties` (`hotel.staff.email`, `hotel.staff.password`), tuyệt đối **KHÔNG** nằm trong cơ sở dữ liệu.
  - **Tài khoản Customer:** Được lưu trữ, quản lý và xác thực qua bảng `Customer` trong CSDL.
- **Tên Database bắt buộc:** `A3StudentName_ClassCode` -> `A3TranHienVinh_SE1910`.
- **Tên Project:** `A3StudentName_ClassCode` cho cả Backend (Spring Boot 3) và Frontend (ReactJS Vite).
- **Ràng buộc Xóa phòng (Soft-delete vs Hard-delete):** Nếu phòng đã từng phát sinh giao dịch đặt phòng (tồn tại trong `BookingDetail`), hệ thống **CHỈ ĐƯỢC ĐỔI TRẠNG THÁI** `RoomStatus = 0` (Inactive / Xóa mềm). Nếu phòng chưa từng được đặt, được phép xóa cứng vật lý.
- **Đặt phòng Online nhiều phòng (Multi-room Booking):** Khách hàng có thể chọn cùng lúc một hoặc nhiều phòng trong một giao dịch đặt phòng. Hệ thống tự động tính số ngày lưu trú và tổng tiền chính xác.

### 1.3. Bảng đối chiếu Ma trận Yêu cầu Đề bài (Requirements Traceability Matrix)

| STT | Vai trò (Role) | Yêu cầu Nghiệp vụ theo Đề bài | Ràng buộc Nghiệp vụ (Business Rules) | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Public Guest | Xem thông tin phòng công khai (Public Rooms) | Xem danh sách phòng Active, loại phòng, giá theo ngày, không cần đăng nhập | **ĐẠT 100%** |
| **2** | Customer | Đăng ký tài khoản (Register) | Đăng ký tài khoản thành viên mới lưu vào bảng Customer với mật khẩu mã hóa BCrypt | **ĐẠT 100%** |
| **3** | Customer | Xác thực JWT (Login Customer) | Đăng nhập bằng Email/Password đối chiếu bảng Customer trong CSDL, phát hành Bearer JWT | **ĐẠT 100%** |
| **4** | Customer | Đặt phòng Online (Multi-room Booking) | Chọn ngày Check-in/Check-out, chọn 1 hoặc nhiều phòng, tự tính ngày lưu trú và tổng tiền | **ĐẠT 100%** |
| **5** | Customer | Xem lịch sử đặt phòng (Booking History) | Xem danh sách các đơn đặt phòng của chính mình kèm chi tiết các phòng đã thuê | **ĐẠT 100%** |
| **6** | Customer | Quản lý Hồ sơ cá nhân (Profile & Password) | Xem, cập nhật thông tin cá nhân và thay đổi mật khẩu tài khoản của chính mình | **ĐẠT 100%** |
| **7** | Staff | Xác thực từ file cấu hình (Staff Auth) | Đăng nhập bằng Email/Password cấu hình trong `application.properties`, phát hành JWT Role STAFF | **ĐẠT 100%** |
| **8** | Staff | Quản lý Phòng (Room Management CRUD) | Xem danh sách, tìm kiếm, lọc theo RoomType, thêm/sửa qua Modal, xóa phòng có điều kiện | **ĐẠT 100%** |
| **9** | Staff | Ràng buộc Xóa phòng thông minh | **Soft-delete** (`RoomStatus = 0`) nếu phòng đã có trong BookingDetail; **Hard-delete** nếu chưa từng thuê | **ĐẠT 100%** |
| **10** | Staff | Quản lý Khách hàng (Customer Management) | Xem danh sách khách hàng, tìm kiếm, kích hoạt / vô hiệu hóa trạng thái tài khoản | **ĐẠT 100%** |
| **11** | Staff | Quản lý Đơn đặt phòng & Báo cáo Doanh thu | Xem tất cả giao dịch đặt phòng và lọc thống kê doanh thu theo khoảng thời gian tùy chọn | **ĐẠT 100%** |

---

## II. KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP BẢO MẬT (SPRING SECURITY & JWT)

Hệ thống tuân thủ kiến trúc phân tầng 3-Layer Architecture kết hợp Spring Security 6 và JSON Web Token (JJWT 0.12.6) hoàn chỉnh:
1. **Tầng Thực thể (Entity Layer):** Bao gồm `RoomType`, `RoomInformation`, `Customer`, `BookingReservation` và `BookingDetail`. Trong đó `BookingDetail` sử dụng khóa chính phức hợp (Composite Primary Key) ánh xạ qua class `@Embeddable BookingDetailId` gồm `BookingReservationID` và `RoomID`.
2. **Cơ chế Dual Authentication:** Hiện thực `CustomUserDetailsService` đọc tài khoản Staff từ `StaffProperties` (`application.properties`) hoặc Customer từ `CustomerRepository`. Sử dụng `PasswordEncoder` (BCrypt) để bảo vệ mật khẩu.
3. **Spring Security 6 & JWT Filter:** Cấu hình `SecurityFilterChain` Stateless (không dùng Session), phân quyền chi tiết theo Endpoint và HTTP Method (`hasRole('STAFF')` cho các API quản trị, `authenticated()` cho Customer và `permitAll()` cho Public).
4. **Tầng Nghiệp vụ (Service Layer):** Xử lý logic nghiệp vụ đặt nhiều phòng, tính toán số ngày lưu trú bằng `java.time.temporal.ChronoUnit.DAYS`, kiểm tra và chuyển đổi trạng thái xóa mềm phòng.
5. **Tầng Giao diện (ReactJS Frontend):** ReactJS Single Page Application khởi tạo bằng Vite, tích hợp `AuthContext` và `Axios Interceptor` tự động gán Bearer Token vào Header Authorization cho mọi HTTP Request.

---

## III. QUY TRÌNH CHỨC NĂNG & HÌNH ẢNH DEMO CHI TIẾT (TẤT CẢ MÀN HÌNH)

### 1. Màn hình Trang chủ Khách sạn (Public Room Catalog)
Người dùng vãng lai (khách không cần đăng nhập) có thể theo dõi danh mục toàn bộ các phòng đang hoạt động (`RoomStatus = 1`). Mỗi phòng hiển thị Số phòng (Room Number), Loại phòng (Room Type), Sức chứa tối đa (Max Capacity), Giá thuê theo ngày (Price Per Day) và Mô tả chi tiết tiện nghi.

![Public Home](screenshots/01_A3_Public_HomePage.png)
*Hình 1: Giao diện Trang chủ Khách sạn & Danh mục Phòng dành cho Public Guest*

### 2. Màn hình Đăng nhập Tích hợp Quick Fill 1-Click (Login Page)
Màn hình tiếp nhận Email và Password. Điểm nổi bật: Trang bị sẵn các nút **"1-Click Quick Fill"** giúp Giảng viên và Người chấm thi có thể lập tức điền thông tin tài khoản Staff (lấy từ application.properties) hoặc tài khoản Khách hàng (trong CSDL) để kiểm thử nhanh chóng.

![Login Page](screenshots/02_A3_LoginPage.png)
*Hình 2: Màn hình Đăng nhập với nút Quick Fill 1-Click cho Staff và Customer*

### 3. Màn hình Đăng ký Tài khoản Khách hàng mới (Customer Registration)
Khách hàng mới có thể tự đăng ký tài khoản với đầy đủ thông tin: Họ và tên, Email, Số điện thoại, Ngày sinh và Mật khẩu. Dữ liệu được mã hóa bảo mật BCrypt trước khi lưu trữ vào bảng Customer trong CSDL.

![Register Page](screenshots/03_A3_RegisterPage.png)
*Hình 3: Màn hình Đăng ký tài khoản Khách hàng mới (Customer Register)*

### 4. Màn hình Đặt phòng Trực tuyến Đa phòng (Customer Online Multi-room Booking)
Khách hàng chọn Ngày nhận phòng (Start Date) và Ngày trả phòng (End Date). Sau đó tích chọn một hoặc nhiều phòng cần thuê. Hệ thống tự động tính số ngày lưu trú và hiển thị tổng chi phí (Total Price) theo thời gian thực trên thanh tóm tắt.

![Online Booking](screenshots/04_A3_Customer_OnlineBooking.png)
*Hình 4: Màn hình Đặt phòng Trực tuyến dành cho Khách hàng (Hỗ trợ chọn nhiều phòng)*

### 5. Hộp thoại Modal Xác nhận Đặt phòng Thành công (Booking Confirmed Modal)
Khi khách hàng bấm "Xác nhận đặt phòng", hệ thống gửi đơn hàng về backend, khởi tạo một `BookingReservation` và các bản ghi `BookingDetail` tương ứng, sau đó hiển thị thông báo thành công kèm mã Reservation ID.

![Booking Confirmed Modal](screenshots/05_A3_Customer_BookingConfirmed_Modal.png)
*Hình 5: Hộp thoại Modal Xác nhận Đơn đặt phòng thành công*

### 6. Màn hình Lịch sử Đơn đặt phòng của Khách hàng (Customer My Bookings)
Khách hàng có thể theo dõi toàn bộ các lần đặt phòng trước đây của chính mình, xem chi tiết từng phòng đã thuê, khoảng thời gian lưu trú và tổng tiền thanh toán.

![Customer My Bookings](screenshots/06_A3_Customer_MyBookings.png)
*Hình 6: Màn hình Lịch sử Đơn đặt phòng của Khách hàng (My Bookings)*

### 7. Màn hình Hồ sơ Cá nhân & Đổi Mật khẩu Khách hàng (Customer Profile)
Khách hàng có thể xem thông tin cá nhân đã đăng ký, cập nhật số điện thoại và chủ động thay đổi mật khẩu bảo vệ tài khoản.

![Customer Profile](screenshots/07_A3_Customer_Profile.png)
*Hình 7: Màn hình Cập nhật Hồ sơ cá nhân và Đổi mật khẩu của Khách hàng*

### 8. Màn hình Quản trị Phòng dành cho Nhân viên (Staff Rooms Management)
Chỉ nhân viên (Staff) mới có quyền truy cập. Bảng hiển thị danh sách phòng, phân loại theo RoomType, trạng thái (Active/Inactive), tìm kiếm theo số phòng/mô tả và lọc theo loại phòng. Nút Xóa phòng kích hoạt cơ chế xóa thông minh.

![Staff Rooms Management](screenshots/08_A3_Staff_RoomsManagement.png)
*Hình 8: Màn hình Quản trị Danh sách Phòng khách sạn dành cho Staff*

### 9. Hộp thoại Thêm mới / Cập nhật Phòng Khách sạn (Staff Add/Edit Room Modal)
Popup Dialog hỗ trợ nhân viên nhập Số phòng (Room Number), Chọn Loại phòng (RoomType dropdown), Sức chứa tối đa (Max Capacity), Giá thuê theo ngày (Price Per Day) và Mô tả tiện nghi chi tiết.

![Staff Add Room Modal](screenshots/09_A3_Staff_AddRoom_Modal.png)
*Hình 9: Hộp thoại Modal Thêm mới / Chỉnh sửa Phòng khách sạn*

### 10. Màn hình Quản lý Danh sách Khách hàng (Staff Customers Management)
Nhân viên xem toàn bộ danh sách khách hàng trong hệ thống, tìm kiếm theo tên/email, kích hoạt hoặc vô hiệu hóa tài khoản (Status Active/Inactive) để kiểm soát quyền đăng nhập.

![Staff Customers Management](screenshots/10_A3_Staff_CustomersManagement.png)
*Hình 10: Màn hình Quản lý Danh sách Khách hàng dành cho Staff*

### 11. Màn hình Báo cáo Doanh thu & Quản lý Đơn đặt phòng (Staff Bookings Report)
Nhân viên theo dõi tất cả các giao dịch đặt phòng của toàn hệ thống, có thể chọn khoảng thời gian (Từ ngày - Đến ngày) để lọc danh sách và xem thống kê Tổng doanh thu khách sạn thu được.

![Staff Bookings Report](screenshots/11_A3_Staff_BookingsReport.png)
*Hình 11: Màn hình Báo cáo Doanh thu & Quản lý Đơn đặt phòng dành cho Staff*

---

## IV. GIẢI THÍCH MÃ NGUỒN CHI TIẾT THEO TỪNG TẦNG

### 4.1. Cơ chế Phân luồng Xác thực Kép (`CustomUserDetailsService.java`)
Theo đúng yêu cầu đề bài: *"The Staff account will get from application.properties file"*. Lớp `CustomUserDetailsService` nhận diện Staff từ file properties hoặc Customer từ bảng CSDL:
```java
@Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    // 1. Kiểm tra tài khoản Staff đọc trực tiếp từ application.properties
    if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email.trim())) {
        String staffPassword = staffProperties.getPassword();
        String encodedStaffPass = staffPassword.startsWith("$2a$") ? staffPassword : passwordEncoder.encode(staffPassword);
        return UserPrincipal.createStaff(staffProperties.getEmail(), encodedStaffPass, staffProperties.getFullName());
    }

    // 2. Kiểm tra tài khoản Khách hàng (Customer) trong CSDL SQL Server
    Customer customer = customerRepository.findByEmailAddress(email.trim())
            .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy khách hàng với email: " + email));

    boolean isActive = customer.getCustomerStatus() != null && customer.getCustomerStatus() == 1;
    String customerPassword = customer.getPassword();
    if (customerPassword != null && !customerPassword.startsWith("$2a$") && !customerPassword.startsWith("$2b$")) {
        customerPassword = passwordEncoder.encode(customerPassword);
    }

    return UserPrincipal.createCustomer(
            customer.getCustomerID(), customer.getEmailAddress(), customerPassword,
            customer.getCustomerFullName(), isActive
    );
}
```

### 4.2. Ràng buộc Xóa phòng Thông minh (`RoomServiceImpl.java`)
Theo đúng yêu cầu đề bài: *"The delete action will delete room information in the case this information is not belong to any renting transaction. If the room information is already stored in a booking detail, just change the status"*:
```java
@Override
@Transactional
public void deleteRoom(Integer roomId) {
    RoomInformation room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

    // Kiểm tra xem phòng đã từng phát sinh trong bảng BookingDetail hay chưa
    boolean hasBooking = bookingDetailRepository.existsByRoom_RoomID(roomId);
    if (hasBooking) {
        // Đã có trong đơn đặt phòng -> CHỈ ĐỔI TRẠNG THÁI (Xóa mềm)
        room.setRoomStatus((byte) 0); // 0 = Inactive
        roomRepository.save(room);
    } else {
        // Chưa từng được đặt phòng -> XÓA CỨNG VẬT LÝ
        roomRepository.delete(room);
    }
}
```

### 4.3. Nghiệp vụ Đặt nhiều phòng & Tính toán Tổng tiền (`BookingServiceImpl.java`)
Xử lý đặt nhiều phòng cùng lúc, tự động tính số ngày lưu trú bằng `ChronoUnit.DAYS` và nhân với đơn giá `ActualPrice` của từng phòng:
```java
@Override
@Transactional
public BookingResponse createBooking(Integer customerId, BookingCreateRequest request) {
    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

    BookingReservation reservation = new BookingReservation();
    reservation.setBookingDate(LocalDate.now());
    reservation.setBookingStatus((byte) 1); // 1 = Confirmed
    reservation.setCustomer(customer);

    BigDecimal totalPrice = BigDecimal.ZERO;
    List<BookingDetail> details = new ArrayList<>();

    for (BookingDetailItemRequest item : request.getRooms()) {
        RoomInformation room = roomRepository.findById(item.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + item.getRoomId()));

        long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
        if (days <= 0) days = 1;

        BigDecimal roomCost = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
        totalPrice = totalPrice.add(roomCost);

        BookingDetail detail = new BookingDetail();
        detail.setId(new BookingDetailId(reservation.getBookingReservationID(), room.getRoomID()));
        detail.setBookingReservation(reservation);
        detail.setRoom(room);
        detail.setStartDate(item.getStartDate());
        detail.setEndDate(item.getEndDate());
        detail.setActualPrice(room.getRoomPricePerDay());
        details.add(detail);
    }

    reservation.setTotalPrice(totalPrice);
    BookingReservation saved = bookingReservationRepository.save(reservation);
    return mapToBookingResponse(saved);
}
```

---

## V. BỘ DỮ LIỆU KIỂM THỬ & HƯỚNG DẪN VẬN HÀNH

### 5.1. Bảng Tài khoản Kiểm thử Hệ thống (Test Credentials)

| Vai trò (Role) | Nguồn Tài khoản (Source) | Địa chỉ Email | Mật khẩu | Quyền hạn chính |
| :--- | :--- | :--- | :---: | :--- |
| **Staff (Quản trị viên)** | `application.properties` | `staff@fuminhotel.com` | `@1` | Quản lý phòng (CRUD, Xóa mềm), Khách hàng, Đơn đặt & Doanh thu |
| **Customer (Khách hàng 1)** | CSDL (`Customer` table) | `an.nguyen@fuminhotel.com` | `@1` | Đặt nhiều phòng Online, Xem lịch sử My Bookings, Đổi Profile/Pass |
| **Customer (Khách hàng 2)** | CSDL (`Customer` table) | `mai.tran@fuminhotel.com` | `@1` | Đặt phòng Online, Xem lịch sử đặt phòng, Quản lý Profile |
| **Public Guest** | *Không yêu cầu* | *Không yêu cầu* | *Không yêu cầu* | Xem danh sách phòng công khai, giá thuê theo ngày, loại phòng |

### 5.2. Hướng dẫn Khởi chạy và Vận hành Hệ thống
1. **Cơ sở dữ liệu:** Mở SSMS hoặc sqlcmd, thực thi script database tại `A3TranHienVinh_SE1910/database/A3TranHienVinh_SE1910.sql` để tạo CSDL `A3TranHienVinh_SE1910` kèm đầy đủ bảng và dữ liệu mẫu.
2. **Khởi chạy Backend Spring Boot (Port 8080):**
   ```bash
   cd A3TranHienVinh_SE1910/backend
   mvn clean spring-boot:run
   ```
3. **Khởi chạy Frontend ReactJS Vite (Port 5174):**
   ```bash
   cd A3TranHienVinh_SE1910/frontend
   npm install
   npm run dev
   ```
4. **Kiểm thử API qua Postman:** Import file `A3TranHienVinh_SE1910/A3TranHienVinh_SE1910.postman_collection.json` (19 requests có kịch bản test tự động) vào Postman để kiểm thử toàn diện.
