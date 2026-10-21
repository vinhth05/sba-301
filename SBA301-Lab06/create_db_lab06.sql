-- ============================================================================
-- SBA301 - LAB 06: SECURE REST SERVICES WITH SPRING BOOT USING JWT
-- Script: Tạo Database OrchidJWTLab, Bảng users & Dữ liệu mẫu (Seed Data)
-- Khóa học: SBA301 - Lớp: SE1910 - Sinh viên: Trần Hiển Vinh (CE190881)
-- ============================================================================

USE master;
GO

-- 1. Tạo Database OrchidJWTLab nếu chưa tồn tại
IF DB_ID(N'OrchidJWTLab') IS NULL
BEGIN
    PRINT 'Đang tạo mới Database OrchidJWTLab...';
    CREATE DATABASE OrchidJWTLab;
END
ELSE
BEGIN
    PRINT 'Database OrchidJWTLab đã tồn tại.';
END
GO

USE OrchidJWTLab;
GO

-- 2. Tạo Bảng users nếu chưa tồn tại
IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    PRINT 'Đang tạo bảng users...';
    CREATE TABLE dbo.users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        full_name NVARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
ELSE
BEGIN
    PRINT 'Bảng users đã tồn tại.';
END
GO

-- 3. Nạp dữ liệu mẫu (Seed Data)
-- Mật khẩu ban đầu: "P@ssword123"
-- BCrypt Hash: $2a$10$M1vnCW5AiqLRPhNqM4/uHuvhNGBA33/CaV1EefWeC8rGuh3a/bHxe
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = 'student01@fpt.edu.vn')
BEGIN
    INSERT INTO dbo.users (full_name, email, password, created_at, updated_at)
    VALUES (N'SBA301 Student', 'student01@fpt.edu.vn', '$2a$10$M1vnCW5AiqLRPhNqM4/uHuvhNGBA33/CaV1EefWeC8rGuh3a/bHxe', SYSUTCDATETIME(), SYSUTCDATETIME());
    PRINT 'Đã chèn tài khoản mẫu: student01@fpt.edu.vn (Mật khẩu: P@ssword123)';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = 'admin@fpt.edu.vn')
BEGIN
    INSERT INTO dbo.users (full_name, email, password, created_at, updated_at)
    VALUES (N'System Administrator', 'admin@fpt.edu.vn', '$2a$10$M1vnCW5AiqLRPhNqM4/uHuvhNGBA33/CaV1EefWeC8rGuh3a/bHxe', SYSUTCDATETIME(), SYSUTCDATETIME());
    PRINT 'Đã chèn tài khoản mẫu: admin@fpt.edu.vn (Mật khẩu: P@ssword123)';
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = 'teacher@fpt.edu.vn')
BEGIN
    INSERT INTO dbo.users (full_name, email, password, created_at, updated_at)
    VALUES (N'Lecturer SBA301', 'teacher@fpt.edu.vn', '$2a$10$M1vnCW5AiqLRPhNqM4/uHuvhNGBA33/CaV1EefWeC8rGuh3a/bHxe', SYSUTCDATETIME(), SYSUTCDATETIME());
    PRINT 'Đã chèn tài khoản mẫu: teacher@fpt.edu.vn (Mật khẩu: P@ssword123)';
END
GO

-- 4. Truy vấn xác thực bảng và dữ liệu
PRINT '=== DANH SÁCH TÀI KHOẢN TRONG DATABASE OrchidJWTLab ===';
SELECT id, full_name, email, password, created_at, updated_at FROM dbo.users;
GO
