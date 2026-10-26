# SBA301 - Slot 28: Chapter 17 Part A - Hibernate Architecture, Configuration, Mapping & HQL

> **Sinh viên:** Trần Hiển Vinh (CE190881)  
> **Lớp:** SE1910  
> **Môn học:** SBA301 – Integrate Single Page Application with Spring Boot  
> **Chủ đề:** Chapter 17 Part A – Hibernate Architecture, SessionFactory, Entity Lifecycle, Dirty Checking, First-Level Cache & HQL  

---

## 📌 1. Mục tiêu bài học (Learning Objectives)

1. **Hiểu bản chất ORM & Hibernate Architecture:**
   - `Configuration` nạp metadata từ `hibernate.cfg.xml`.
   - `SessionFactory` là đối tượng singleton, thread-safe, nặng (heavyweight) và đại diện cho toàn bộ database metamodel.
   - `Session` là Unit of Work ngắn hạn (short-lived), không thread-safe, gắn liền với Persistence Context và First-Level Cache.
2. **Vòng đời Entity (Entity Lifecycle):**
   - **Transient:** Đối tượng mới khởi tạo bằng toán tử `new`, chưa có ID và chưa được Session quản lý.
   - **Persistent (Managed):** Đối tượng đã gắn liền với Persistence Context trong Session; mọi thay đổi trạng thái sẽ được theo dõi tự động (**Dirty Checking**).
   - **Detached:** Đối tượng đã từng có ID nhưng Session đã đóng hoặc bị `evict()`, không còn được theo dõi. Muốn quản lý lại phải dùng `session.merge()`.
   - **Removed:** Đối tượng được đánh dấu để xóa khi transaction flush/commit.
3. **Các cơ chế cốt lõi được chứng minh bằng thí nghiệm:**
   - **Dirty Checking:** Sửa trường dữ liệu trong transaction không cần gọi `session.update()`, Hibernate tự động sinh câu lệnh SQL `UPDATE`.
   - **First-Level Cache:** Trong cùng một Session, gọi `session.get(id)` 2 lần chỉ sinh duy nhất 1 câu SQL `SELECT` và trả về cùng một instance Java (`a == b`).
   - **Parameterized HQL:** Truy vấn hướng đối tượng bằng HQL an toàn chống SQL Injection.

---

## 🧪 2. Kết quả kiểm thử (Verification)

Chạy kiểm thử tự động toàn bộ vòng đời Hibernate:
```bash
cd D:\KY7\SBA301\SBA\Slot28
mvn test
```
- **Test 1:** Persist entity & verify database insertion.
- **Test 2:** Dirty checking automatically triggers UPDATE on commit.
- **Test 3:** First-level cache resolves identical object instance (`a == b`).
- **Test 4:** Parameterized HQL query execution (`FROM Student s WHERE s.marks >= :minMarks`).
