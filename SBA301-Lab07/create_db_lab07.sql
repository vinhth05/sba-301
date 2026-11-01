-- ============================================================================
-- SBA301 - LAB 07: BUILDING DESKTOP APPLICATION USING JAVAFX AND HIBERNATE
-- Script: Tạo Database LibraryDB, Bảng STUDENTS, BOOKS, STUDENTS_BOOKS & Seed Data
-- Khóa học: SBA301 - Lớp: SE1910 - Sinh viên: Trần Hiển Vinh (CE190881)
-- ============================================================================

USE master;
GO

-- 1. Tạo Database LibraryDB nếu chưa tồn tại
IF DB_ID(N'LibraryDB') IS NULL
BEGIN
    PRINT 'Đang tạo Database LibraryDB...';
    CREATE DATABASE LibraryDB;
END
ELSE
BEGIN
    PRINT 'Database LibraryDB đã tồn tại.';
END
GO

USE LibraryDB;
GO

-- 2. Dọn dẹp các bảng cũ nếu cần cấu trúc chuẩn của Lab 07
IF OBJECT_ID(N'dbo.STUDENTS_BOOKS', N'U') IS NOT NULL DROP TABLE dbo.STUDENTS_BOOKS;
IF OBJECT_ID(N'dbo.STUDENT_BOOKS', N'U') IS NOT NULL DROP TABLE dbo.STUDENT_BOOKS;
IF OBJECT_ID(N'dbo.STUDENTS', N'U') IS NOT NULL DROP TABLE dbo.STUDENTS;
IF OBJECT_ID(N'dbo.BOOKS', N'U') IS NOT NULL DROP TABLE dbo.BOOKS;
GO

-- 3. Tạo bảng BOOKS
CREATE TABLE dbo.BOOKS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    author NVARCHAR(255) NOT NULL,
    isbn NVARCHAR(255) NOT NULL UNIQUE,
    title NVARCHAR(255) NOT NULL
);
GO

-- 4. Tạo bảng STUDENTS
CREATE TABLE dbo.STUDENTS (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(255) NOT NULL,
    lastName NVARCHAR(255) NOT NULL,
    marks FLOAT NOT NULL
);
GO

-- 5. Tạo bảng STUDENTS_BOOKS (Many-to-Many Join Table)
CREATE TABLE dbo.STUDENTS_BOOKS (
    student_id INT NOT NULL,
    book_id INT NOT NULL,
    PRIMARY KEY (student_id, book_id),
    CONSTRAINT FK_STUDENTS_BOOKS_STUDENT FOREIGN KEY (student_id) REFERENCES dbo.STUDENTS(id) ON DELETE CASCADE,
    CONSTRAINT FK_STUDENTS_BOOKS_BOOK FOREIGN KEY (book_id) REFERENCES dbo.BOOKS(id) ON DELETE CASCADE
);
GO

-- 6. Seed Data: Sách
SET IDENTITY_INSERT dbo.BOOKS ON;
INSERT INTO dbo.BOOKS (id, author, isbn, title) VALUES
(1, N'Robert C. Martin', N'978-0132350884', N'Clean Code: A Handbook of Agile Software Craftsmanship'),
(2, N'Joshua Bloch', N'978-0134685991', N'Effective Java (3rd Edition)'),
(3, N'Erich Gamma, Richard Helm', N'978-0201633610', N'Design Patterns: Elements of Reusable Object-Oriented Software'),
(4, N'Christian Bauer, Gavin King', N'978-1617290459', N'Java Persistence with Hibernate');
SET IDENTITY_INSERT dbo.BOOKS OFF;
GO

-- 7. Seed Data: Sinh viên (bao gồm tài khoản đăng nhập)
SET IDENTITY_INSERT dbo.STUDENTS ON;
INSERT INTO dbo.STUDENTS (id, email, password, firstName, lastName, marks) VALUES
(1, N'admin@fpt.edu.vn', N'123456', N'Admin', N'System', 10.0),
(2, N'vinhth@fpt.edu.vn', N'123456', N'Vinh', N'Tran Hien', 9.5),
(3, N'lab07@fpt.edu.vn', N'123456', N'Lab', N'Seven', 8.0),
(4, N'alice@fpt.edu.vn', N'123456', N'Alice', N'Nguyen', 7.5),
(5, N'bob@fpt.edu.vn', N'123456', N'Bob', N'Le', 6.0);
SET IDENTITY_INSERT dbo.STUDENTS OFF;
GO

-- 8. Seed Data: Sinh viên mượn sách
INSERT INTO dbo.STUDENTS_BOOKS (student_id, book_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 4);
GO

-- 9. Kiểm tra kết quả
SELECT 'STUDENTS' AS TableName, COUNT(*) AS TotalRows FROM dbo.STUDENTS
UNION ALL
SELECT 'BOOKS', COUNT(*) FROM dbo.BOOKS
UNION ALL
SELECT 'STUDENTS_BOOKS', COUNT(*) FROM dbo.STUDENTS_BOOKS;
GO
