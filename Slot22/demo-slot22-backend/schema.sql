USE master;
GO

-- Xóa database cũ nếu đã tồn tại
IF DB_ID('FUNewsManagementSBA301') IS NOT NULL
BEGIN
    ALTER DATABASE FUNewsManagementSBA301 SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE FUNewsManagementSBA301;
END;
GO

-- Tạo mới database
CREATE DATABASE FUNewsManagementSBA301;
GO

USE FUNewsManagementSBA301;
GO

-- Tạo bảng Category theo đúng chuẩn Step 1 (Trang 17)
CREATE TABLE dbo.Category(
    CategoryID SMALLINT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    CategoryDesciption NVARCHAR(250) NOT NULL,
    ParentCategoryID SMALLINT NULL,
    IsActive BIT NULL
);
GO

-- Chèn dữ liệu mẫu (seed data)
INSERT dbo.Category(CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
VALUES
    (N'Academic news', N'Academic announcements', NULL, 1),
    (N'Student Affairs', N'Student activities and events', NULL, 1),
    (N'Campus Safety', N'Campus safety information', NULL, 1);
GO

-- Kiểm tra dữ liệu sau khi khởi tạo
SELECT * FROM dbo.Category;
GO
