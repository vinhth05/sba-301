IF DB_ID('FUNewsManagementSBA301') IS NULL
BEGIN
    CREATE DATABASE FUNewsManagementSBA301;
END;
GO

USE FUNewsManagementSBA301;
GO

IF OBJECT_ID('dbo.NewsArticle','U') IS NOT NULL
    DROP TABLE dbo.NewsArticle;
GO

IF OBJECT_ID('dbo.Category','U') IS NOT NULL
    DROP TABLE dbo.Category;
GO

CREATE TABLE dbo.Category(
    CategoryID SMALLINT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    CategoryDesciption NVARCHAR(250) NOT NULL,
    ParentCategoryID SMALLINT NULL,
    IsActive BIT NULL
);
GO

CREATE TABLE dbo.NewsArticle(
    NewsArticleID NVARCHAR(20) PRIMARY KEY,
    NewsTitle NVARCHAR(400) NULL,
    Headline NVARCHAR(150) NULL,
    CreatedDate DATETIME NULL,
    NewsContent NVARCHAR(MAX) NULL,
    NewsSource NVARCHAR(400) NULL,
    CategoryID SMALLINT NULL CONSTRAINT FK_NewsArticle_Category FOREIGN KEY REFERENCES dbo.Category(CategoryID),
    NewsStatus BIT NULL,
    CreatedByID SMALLINT NULL,
    UpdatedByID SMALLINT NULL,
    ModifiedDate DATETIME NULL
);
GO

INSERT dbo.Category(CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
VALUES
    (N'Academic news', N'Academic announcements', NULL, 1),
    (N'Student Affairs', N'Student activities and events', NULL, 1),
    (N'Campus Safety', N'Campus safety information', NULL, 1);
GO

-- Seed 1 article referencing Category 1 to demo Business Delete Rule (409 Conflict)
INSERT dbo.NewsArticle(NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID)
VALUES
    (N'NA0001', N'University Opening Day 2026', N'Welcome new students to 2026 semester', GETDATE(), N'Opening ceremony details...', N'FPT News', 1, 1, 1);
GO

SELECT * FROM dbo.Category;
SELECT * FROM dbo.NewsArticle;
GO
