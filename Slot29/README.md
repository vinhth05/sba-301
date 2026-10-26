# SBA301 - Slot 29: Chapter 17 Part B - Many-to-Many Association, DAO, Repository & Service Layering

> **Sinh viên:** Trần Hiển Vinh (CE190881)  
> **Lớp:** SE1910  
> **Môn học:** SBA301 – Integrate Single Page Application with Spring Boot  
> **Chủ đề:** Chapter 17 Part B – Many-to-Many Mapping, Owning vs Inverse Side, Join Table, DAO, Repository, Service Architecture  

---

## 📌 1. Mục tiêu bài học (Learning Objectives)

1. **Mô hình hóa quan hệ Many-to-Many:**
   - Quan hệ nhiều-nhiều giữa hai thực thể độc lập: `Student` ↔ `Book`.
   - Một sinh viên có thể mượn nhiều quyển sách; một quyển sách có thể được mượn bởi nhiều sinh viên qua thời gian.
   - Bảng nối quan hệ: `STUDENTS_BOOKS(student_id, book_id)`.
2. **Owning Side vs Inverse Side:**
   - **Owning side (`Student`):** Khai báo `@JoinTable(name = "STUDENTS_BOOKS", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "book_id"))`. Mọi thay đổi trong collection của phía owning sẽ kích hoạt câu lệnh SQL `INSERT` hoặc `DELETE` trên bảng nối.
   - **Inverse side (`Book`):** Khai báo `@ManyToMany(mappedBy = "books")`. Phản chiếu quan hệ nhưng không trực tiếp quản lý bảng nối.
   - **Bidirectional helper methods:** Cung cấp `addBook(book)` và `removeBook(book)` để đồng bộ hai chiều trong bộ nhớ Java runtime (`student.books` và `book.students`).
3. **Kiến trúc phân tầng 3 lớp (3-Tier Layering):**
   - **DAO Layer (`StudentDAO`, `BookDAO`):** Thao tác trực tiếp với Hibernate `Session`, `Transaction`, HQL query và dirty checking.
   - **Repository Layer (`StudentRepository`, `BookRepository`):** Trừu tượng hóa hợp đồng lưu trữ (Persistence Contract), giúp Service không bị ràng buộc trực tiếp vào API cấp thấp của Hibernate.
   - **Service Layer (`LibraryService`):** Điều phối các use case nghiệp vụ (đăng ký sinh viên, thêm sách, mượn sách, trả sách), kiểm tra ràng buộc toàn vẹn và đảm bảo an toàn cascade (xóa sinh viên không xóa mất sách dùng chung).

---

## 🧪 2. Kết quả kiểm thử (Verification)

Chạy kiểm thử tự động toàn bộ call chain:
```bash
cd D:\KY7\SBA301\SBA\Slot29
mvn test
```
- **Test 1:** Register Student and Book entities.
- **Test 2:** Borrow book establishes Many-to-Many join association in `STUDENTS_BOOKS`.
- **Test 3:** Return book cleanly removes association from join table.
- **Test 4:** Deleting Student preserves shared Book entities in the library catalog (Safe cascade).
