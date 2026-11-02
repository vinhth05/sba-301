USE [master]
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'A3TranHienVinh_SE1910')
BEGIN
    CREATE DATABASE [A3TranHienVinh_SE1910]
END
GO

USE [A3TranHienVinh_SE1910]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 1. Table: RoomType
IF OBJECT_ID(N'dbo.RoomType', N'U') IS NOT NULL
    DROP TABLE dbo.RoomType;
GO

CREATE TABLE dbo.RoomType (
    RoomTypeID INT IDENTITY(1,1) NOT NULL,
    RoomTypeName NVARCHAR(100) NOT NULL,
    TypeDescription NVARCHAR(500) NULL,
    TypeNote NVARCHAR(500) NULL,
    CONSTRAINT PK_RoomType PRIMARY KEY CLUSTERED (RoomTypeID ASC)
);
GO

-- 2. Table: RoomInformation
IF OBJECT_ID(N'dbo.RoomInformation', N'U') IS NOT NULL
    DROP TABLE dbo.RoomInformation;
GO

CREATE TABLE dbo.RoomInformation (
    RoomID INT IDENTITY(1,1) NOT NULL,
    RoomNumber NVARCHAR(50) NOT NULL UNIQUE,
    RoomDetailDescription NVARCHAR(500) NULL,
    RoomMaxCapacity INT NOT NULL,
    RoomTypeID INT NOT NULL,
    RoomStatus TINYINT NOT NULL DEFAULT 1, -- 1: Active, 0: Inactive
    RoomPricePerDay DECIMAL(18,2) NOT NULL,
    CONSTRAINT PK_RoomInformation PRIMARY KEY CLUSTERED (RoomID ASC),
    CONSTRAINT FK_RoomInformation_RoomType FOREIGN KEY (RoomTypeID) REFERENCES dbo.RoomType(RoomTypeID)
);
GO

-- 3. Table: Customer
IF OBJECT_ID(N'dbo.Customer', N'U') IS NOT NULL
    DROP TABLE dbo.Customer;
GO

CREATE TABLE dbo.Customer (
    CustomerID INT IDENTITY(1,1) NOT NULL,
    CustomerFullName NVARCHAR(100) NOT NULL,
    Telephone NVARCHAR(20) NULL,
    EmailAddress NVARCHAR(100) NOT NULL UNIQUE,
    CustomerBirthday DATE NULL,
    CustomerStatus TINYINT NOT NULL DEFAULT 1, -- 1: Active, 0: Inactive
    Password NVARCHAR(255) NOT NULL,
    CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED (CustomerID ASC)
);
GO

-- 4. Table: BookingReservation
IF OBJECT_ID(N'dbo.BookingReservation', N'U') IS NOT NULL
    DROP TABLE dbo.BookingReservation;
GO

CREATE TABLE dbo.BookingReservation (
    BookingReservationID INT IDENTITY(1,1) NOT NULL,
    BookingDate DATE NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    CustomerID INT NOT NULL,
    BookingStatus TINYINT NOT NULL DEFAULT 1, -- 1: Confirmed/Active, 0: Cancelled
    CONSTRAINT PK_BookingReservation PRIMARY KEY CLUSTERED (BookingReservationID ASC),
    CONSTRAINT FK_BookingReservation_Customer FOREIGN KEY (CustomerID) REFERENCES dbo.Customer(CustomerID)
);
GO

-- 5. Table: BookingDetail
IF OBJECT_ID(N'dbo.BookingDetail', N'U') IS NOT NULL
    DROP TABLE dbo.BookingDetail;
GO

CREATE TABLE dbo.BookingDetail (
    BookingReservationID INT NOT NULL,
    RoomID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    ActualPrice DECIMAL(18,2) NOT NULL,
    CONSTRAINT PK_BookingDetail PRIMARY KEY CLUSTERED (BookingReservationID ASC, RoomID ASC),
    CONSTRAINT FK_BookingDetail_Reservation FOREIGN KEY (BookingReservationID) REFERENCES dbo.BookingReservation(BookingReservationID) ON DELETE CASCADE,
    CONSTRAINT FK_BookingDetail_Room FOREIGN KEY (RoomID) REFERENCES dbo.RoomInformation(RoomID)
);
GO

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Seed RoomType
SET IDENTITY_INSERT dbo.RoomType ON;
INSERT INTO dbo.RoomType (RoomTypeID, RoomTypeName, TypeDescription, TypeNote) VALUES
(1, N'Standard Single', N'Phòng đơn tiêu chuẩn 1 người, giường đơn êm ái, đầy đủ tiện nghi cơ bản, view sân vườn thoáng mát.', N'Bao gồm bữa sáng nhẹ và trà chiều.'),
(2, N'Deluxe Double', N'Phòng đôi cao cấp 2 người, 1 giường King hoặc 2 giường Twin, ban công rộng hướng nhìn ra biển hoặc thành phố.', N'Bao gồm buffet sáng cao cấp và đồ uống chào mừng.'),
(3, N'Executive Suite', N'Phòng Suite thương gia sang trọng, có phòng khách và phòng ngủ riêng biệt, minibar cao cấp, bồn tắm sục jacuzzi thư giãn.', N'Miễn phí check-in sớm, check-out muộn và dịch vụ giặt là.'),
(4, N'Family Luxury', N'Phòng gia đình đẳng cấp 4-6 người, gồm 2 giường đôi lớn, ban công ngắm cảnh, phòng tắm đôi tiện nghi.', N'Trang bị máy pha cà phê cao cấp, dịch vụ xe đưa đón sân bay.'),
(5, N'Presidential Suite', N'Phòng Tổng thống đẳng cấp Hoàng gia tại tầng cao nhất, view 360 độ toàn cảnh biển, phòng khách lộng lẫy và quản gia riêng 24/7.', N'Đặc quyền thượng lưu, đưa đón xe sang Rolls-Royce.');
SET IDENTITY_INSERT dbo.RoomType OFF;
GO

-- Seed RoomInformation
SET IDENTITY_INSERT dbo.RoomInformation ON;
INSERT INTO dbo.RoomInformation (RoomID, RoomNumber, RoomDetailDescription, RoomMaxCapacity, RoomTypeID, RoomStatus, RoomPricePerDay) VALUES
(1, N'STD-101', N'Tầng 1 - Phòng đơn yên tĩnh gần khu vườn nhiệt đới, WiFi tốc độ cao, điều hòa 2 chiều, bàn làm việc.', 1, 1, 1, 500000.00),
(2, N'STD-102', N'Tầng 1 - Phòng đơn tiện nghi, TV 4K 50 inch, phòng tắm đứng hiện đại.', 1, 1, 1, 520000.00),
(3, N'DLX-201', N'Tầng 2 - Phòng Deluxe ban công biển, giường King size, sofa thư giãn, minibar.', 2, 2, 1, 850000.00),
(4, N'DLX-202', N'Tầng 2 - Phòng Deluxe giường Twin ngắm bình minh hồ bơi, nội thất gỗ óc chó sang trọng.', 2, 2, 1, 880000.00),
(5, N'STE-301', N'Tầng 3 - Căn Suite thương gia, bồn tắm sục massage, bàn làm việc hội nghị, sofa da cao cấp.', 3, 3, 1, 1500000.00),
(6, N'STE-302', N'Tầng 3 - Căn Suite góc rộng 2 mặt kính đón nắng tự nhiên, ban công đón gió biển.', 3, 3, 1, 1600000.00),
(7, N'FAM-401', N'Tầng 4 - Căn hộ gia đình 2 giường King, khu bếp mini tiện nghi, tủ lạnh lớn và bàn ăn.', 4, 4, 1, 2200000.00),
(8, N'PRS-501', N'Tầng 5 Penthouse - Phòng Tổng Thống độc bản, thang máy riêng, quầy bar cá nhân, phòng sauna.', 6, 5, 1, 5000000.00),
(9, N'STD-103', N'Tầng 1 - Phòng đơn dự phòng tiêu chuẩn, đầy đủ trang thiết bị (chưa từng được đặt, thích hợp test Hard Delete).', 1, 1, 1, 480000.00);
SET IDENTITY_INSERT dbo.RoomInformation OFF;
GO

-- Seed Customer
-- Mật khẩu mặc định: "@1" (Hash BCrypt: $2a$10$tZp6/xG6y0eEw83u0Z1E5uQWw/lP/gD70N9E8C7A5Q9y/g/f1Fke.) hoặc hỗ trợ plain text "@1"
SET IDENTITY_INSERT dbo.Customer ON;
INSERT INTO dbo.Customer (CustomerID, CustomerFullName, Telephone, EmailAddress, CustomerBirthday, CustomerStatus, Password) VALUES
(1, N'Nguyễn Văn An', N'0901234567', N'an.nguyen@fuminhotel.com', '1995-05-15', 1, N'$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.'),
(2, N'Trần Thị Mai', N'0912345678', N'mai.tran@fuminhotel.com', '1998-08-20', 1, N'$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.'),
(3, N'Lê Hoàng Nam', N'0987654321', N'nam.le@fuminhotel.com', '1990-11-10', 1, N'$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.'),
(4, N'Phạm Quỳnh Trang', N'0976543210', N'trang.pham@fuminhotel.com', '2000-02-25', 1, N'$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.');
SET IDENTITY_INSERT dbo.Customer OFF;
GO

-- Seed BookingReservation & BookingDetail
SET IDENTITY_INSERT dbo.BookingReservation ON;
INSERT INTO dbo.BookingReservation (BookingReservationID, BookingDate, TotalPrice, CustomerID, BookingStatus) VALUES
(1, '2026-10-15', 2550000.00, 1, 1),
(2, '2026-10-18', 3000000.00, 2, 1),
(3, '2026-10-25', 4400000.00, 1, 1);
SET IDENTITY_INSERT dbo.BookingReservation OFF;
GO

INSERT INTO dbo.BookingDetail (BookingReservationID, RoomID, StartDate, EndDate, ActualPrice) VALUES
(1, 3, '2026-10-20', '2026-10-23', 850000.00), -- 3 nights * 850,000 = 2,550,000
(2, 5, '2026-11-01', '2026-11-03', 1500000.00), -- 2 nights * 1,500,000 = 3,000,000
(3, 7, '2026-11-10', '2026-11-12', 2200000.00); -- 2 nights * 2,200,000 = 4,400,000
GO

PRINT N'Hoàn tất khởi tạo Database A3TranHienVinh_SE1910 và dữ liệu mẫu!';
GO

