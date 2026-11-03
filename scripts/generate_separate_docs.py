# ============================================================================
# Student Name: Trần Hiển Vinh
# Student ID: CE190881
# Class: SE1910
# Course: SBA301 - Integrate Single Page Application with Spring Boot
# ============================================================================
import os
import sys
import io
import shutil

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

WORKSPACE = r"d:\KY7\SBA301\SBA"
A2_DIR = os.path.join(WORKSPACE, "A2TranHienVinh_SE1910")
A3_DIR = os.path.join(WORKSPACE, "A3TranHienVinh_SE1910")
A2_SCREENSHOTS = os.path.join(A2_DIR, "screenshots")
A3_SCREENSHOTS = os.path.join(A3_DIR, "screenshots")

def set_cell_background(cell, fill_hex):
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_header_banner(doc, title, subtitle):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_uni = p.add_run("BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG ĐẠI HỌC FPT CẦN THƠ\n")
    r_uni.font.name = "Arial"
    r_uni.font.size = Pt(11)
    r_uni.font.bold = True
    r_uni.font.color.rgb = RGBColor(180, 83, 9)

    r_course = p.add_run("MÔN HỌC: SBA301 - INTEGRATE SINGLE PAGE APPLICATION WITH SPRING BOOT\n")
    r_course.font.name = "Arial"
    r_course.font.size = Pt(12)
    r_course.font.bold = True
    r_course.font.color.rgb = RGBColor(30, 41, 59)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run(title)
    r_title.font.name = "Arial"
    r_title.font.size = Pt(18)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(14, 116, 144)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(14)
    r_sub = p_sub.add_run(subtitle)
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    # Student Info Box
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.5)
    set_cell_background(c, "F0F9FF")
    set_cell_margins(c, 140, 140, 200, 200)
    cp = c.paragraphs[0]
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_info = cp.add_run(
        "Sinh viên thực hiện: TRẦN HIỂN VINH  |  MSSV: CE190881  |  Lớp: SE1910\n"
        "Giảng viên hướng dẫn: Bộ môn Kỹ thuật Phần mềm (Software Engineering) - ĐH FPT\n"
        "Học kỳ: Fall 2024 / Spring 2025  |  Công nghệ: Spring Boot 3 RESTful API & ReactJS (Vite)"
    )
    r_info.font.name = "Arial"
    r_info.font.size = Pt(10)
    r_info.font.bold = True
    r_info.font.color.rgb = RGBColor(12, 74, 96)
    doc.add_paragraph().paragraph_format.space_after = Pt(10)

def add_heading_styled(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    if level == 1:
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(6)
        for r in h.runs:
            r.font.name = "Arial"
            r.font.size = Pt(14)
            r.font.bold = True
            r.font.color.rgb = RGBColor(15, 23, 42)
    elif level == 2:
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
        for r in h.runs:
            r.font.name = "Arial"
            r.font.size = Pt(12)
            r.font.bold = True
            r.font.color.rgb = RGBColor(14, 116, 144)
    elif level == 3:
        h.paragraph_format.space_before = Pt(6)
        h.paragraph_format.space_after = Pt(2)
        for r in h.runs:
            r.font.name = "Arial"
            r.font.size = Pt(11)
            r.font.bold = True
            r.font.color.rgb = RGBColor(51, 65, 85)
    return h

def add_p(doc, text, bold_prefix=None, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Calibri"
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(30, 41, 59)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(11)
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_callout(doc, text, title="GHI CHÚ QUAN TRỌNG", bg="FEF3C7", border_color="B45309"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.5)
    set_cell_background(c, bg)
    set_cell_margins(c, 120, 120, 180, 180)
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    r_t = p.add_run(f"📌 {title}: ")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(10)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(180, 83, 9)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(74, 85, 104)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_image_figure(doc, img_path, caption):
    if not os.path.exists(img_path):
        add_p(doc, f"[Không tìm thấy tệp ảnh: {img_path}]", bold_prefix="Cảnh báo ảnh: ")
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(6)
    p_img.paragraph_format.space_after = Pt(2)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(6.2))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(10)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = "Calibri"
    r_cap.font.size = Pt(9.5)
    r_cap.font.bold = True
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(71, 85, 105)

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.5)
    set_cell_background(c, "F8FAFC")
    set_cell_margins(c, 100, 100, 140, 140)
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(code_text)
    r.font.name = "Consolas"
    r.font.size = Pt(9)
    r.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

# ==============================================================================
# 1. BUILD ASSIGNMENT 02 DOCUMENT
# ==============================================================================
def build_assignment_02_doc():
    print("Building Assignment 02 Document...")
    doc = Document()
    
    # Page setup
    for sec in doc.sections:
        sec.top_margin = Inches(0.8)
        sec.bottom_margin = Inches(0.8)
        sec.left_margin = Inches(0.8)
        sec.right_margin = Inches(0.8)
        
    add_header_banner(
        doc,
        "BÁO CÁO KỸ THUẬT & HƯỚNG DẪN DEMO CHI TIẾT\nASSIGNMENT 02 - FU NEWS MANAGEMENT SYSTEM",
        "Xây dựng Hệ thống Quản trị Tin tức RESTful API Spring Boot 3 kết hợp Single Page Application ReactJS"
    )

    # PHẦN I
    add_heading_styled(doc, "PHẦN I: ĐỀ BÀI & YÊU CẦU NGHIỆP VỤ (REQUIREMENTS)", level=1)
    add_p(doc, "Assignment 02 yêu cầu sinh viên xây dựng hoàn chỉnh một ứng dụng Single Page Application (SPA) tích hợp kiến trúc RESTful Services đa tầng với Spring Boot 3 và cơ sở dữ liệu Microsoft SQL Server (FUNewsManagement / A2TranHienVinh_SE1910).")
    
    add_heading_styled(doc, "1.1. Phân quyền và Vai trò người dùng (User Roles)", level=2)
    add_p(doc, "Người dùng vãng lai không cần đăng nhập. Có quyền xem danh sách toàn bộ các bài viết tin tức ở trạng thái Active (NewsStatus = 1), xem chi tiết bài viết, tìm kiếm bài viết theo từ khóa tiêu đề hoặc lọc theo chuyên mục (Category).", bold_prefix="1. Public Guest: ")
    add_p(doc, "Có quyền quản lý tài khoản người dùng trong hệ thống (SystemAccount). Xem danh sách, tạo mới tài khoản (Admin hoặc Staff), chỉnh sửa tên/mật khẩu, và xóa tài khoản với ràng buộc nghiệp vụ (không được xóa tài khoản đã có bài viết).", bold_prefix="2. Administrator (Role = 1): ")
    add_p(doc, "Có quyền quản lý bài viết tin tức (NewsArticle) và chuyên mục (Category). Nhân viên có thể thêm, sửa, xem lịch sử các bài viết của chính mình, cập nhật thông tin cá nhân và quản lý danh mục cha - con.", bold_prefix="3. Staff (Role = 2): ")

    add_heading_styled(doc, "1.2. Các Ràng buộc Nghiệp vụ cốt lõi (Business Rules)", level=2)
    add_callout(
        doc,
        "1. Chặn xóa Account: Nếu một SystemAccount đã từng tạo bài viết (tồn tại trong NewsArticle), hệ thống từ chối xóa và trả về mã lỗi 400 Bad Request kèm thông báo rõ ràng.\n"
        "2. Chặn xóa Category: Nếu Category đang chứa bài viết tin tức hoặc đang là danh mục cha của các danh mục khác, hệ thống kiên quyết không cho xóa để bảo toàn dữ liệu.\n"
        "3. Lịch sử bài viết: Staff có một màn hình riêng hiển thị lịch sử các bài báo do chính mình khởi tạo (CreatedByID = loggedUserId).",
        title="CÁC BUSINESS RULES BẮT BUỘC ĐÃ ĐƯỢC CÀI ĐẶT & TEST"
    )

    # PHẦN II
    add_heading_styled(doc, "PHẦN II: KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP KỸ THUẬT", level=1)
    add_p(doc, "Dự án tuân thủ nghiêm ngặt mô hình kiến trúc phân tầng chuẩn doanh nghiệp (3-Layer Architecture):")
    add_p(doc, "Chứa các class ánh xạ thực thể cơ sở dữ liệu: SystemAccount, Category, NewsArticle, Tag.", bold_prefix="• Entity Layer: ")
    add_p(doc, "Kế thừa JpaRepository, cung cấp các truy vấn tùy biến (Custom Query Methods, Derived Queries).", bold_prefix="• Repository Layer: ")
    add_p(doc, "Chứa toàn bộ Business Logic, Transaction Management (@Transactional), kiểm tra điều kiện xóa.", bold_prefix="• Service Layer: ")
    add_p(doc, "Tiếp nhận HTTP Request, validate dữ liệu đầu vào (@Valid), trả về ResponseEntity với mã HTTP chuẩn.", bold_prefix="• Controller Layer: ")
    add_p(doc, "Giao diện người dùng SPA hiện đại sử dụng React 18, Vite, React Router v6, React-Bootstrap, Bootstrap Icons và Axios.", bold_prefix="• Frontend Layer: ")

    # PHẦN III - DEMO & SCREENSHOTS
    add_heading_styled(doc, "PHẦN III: HÌNH ẢNH DEMO THỰC TẾ HỆ THỐNG (CAPTURED SCREENSHOTS)", level=1)
    add_p(doc, "Dưới đây là toàn bộ hình ảnh giao diện thực tế của hệ thống Assignment 02 được chụp trực tiếp khi đang chạy backend Spring Boot (Port 8080) và frontend ReactJS (Port 5173):")

    a2_imgs = [
        ("01_A2_Public_HomePage.png", "Hình 1: Giao diện Trang chủ Tin tức (Public Home) - Xem bài viết Active, bộ lọc chuyên mục và thanh điều hướng"),
        ("02_A2_Public_SearchFilter.png", "Hình 2: Chức năng Tìm kiếm & Lọc bài viết công khai theo từ khóa và Category"),
        ("03_A2_LoginPage.png", "Hình 3: Giao diện Đăng nhập hệ thống (Hỗ trợ phân quyền Administrator & Staff)"),
        ("04_A2_Admin_AccountManagement.png", "Hình 4: Màn hình Quản lý Tài khoản dành cho Administrator (Danh sách, phân loại vai trò, tìm kiếm)"),
        ("05_A2_Admin_CreateAccount_Modal.png", "Hình 5: Popup Modal Tạo mới/Chỉnh sửa Tài khoản của Quản trị viên"),
        ("06_A2_Staff_NewsManagement.png", "Hình 6: Màn hình Quản lý Bài viết Tin tức dành cho Staff (Danh sách, trạng thái, gắn thẻ Tags)"),
        ("07_A2_Staff_CreateNews_Modal.png", "Hình 7: Modal Tạo mới Bài viết Tin tức với Tiêu đề, Nội dung, Chọn Category và Chọn Thẻ Tags"),
        ("08_A2_Staff_CategoryManagement.png", "Hình 8: Màn hình Quản lý Chuyên mục Tin tức (Cây danh mục Cha - Con, Trạng thái Active)"),
        ("09_A2_Staff_Profile.png", "Hình 9: Màn hình Quản lý Thông tin cá nhân của Nhân viên (Xem & Cập nhật Profile, Mật khẩu)"),
        ("10_A2_Staff_MyHistory.png", "Hình 10: Màn hình Lịch sử Bài viết do chính nhân viên đang đăng nhập biên soạn")
    ]

    for fname, cap in a2_imgs:
        img_p = os.path.join(A2_SCREENSHOTS, fname)
        add_image_figure(doc, img_p, cap)

    # PHẦN IV
    add_heading_styled(doc, "PHẦN IV: GIẢI THÍCH MÃ NGUỒN CHI TIẾT (CODE WALKTHROUGH)", level=1)
    add_p(doc, "Đoạn mã kiểm tra ràng buộc không cho phép xóa SystemAccount khi đã phát sinh bài viết trong SystemAccountServiceImpl.java:")
    add_code_block(doc, 
"""@Override
@Transactional
public void deleteAccount(Short accountId) {
    SystemAccount account = systemAccountRepository.findById(accountId)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
            
    // Business Rule: Chặn xóa tài khoản nếu đã có bài viết
    boolean hasNews = newsArticleRepository.existsByCreatedBy_AccountID(accountId);
    if (hasNews) {
        throw new BadRequestException("Không thể xóa tài khoản này vì tài khoản đã tạo bài viết tin tức!");
    }
    systemAccountRepository.delete(account);
}""")

    add_p(doc, "Đoạn mã kiểm tra ràng buộc không cho phép xóa Category trong CategoryServiceImpl.java:")
    add_code_block(doc,
"""@Override
@Transactional
public void deleteCategory(Short categoryId) {
    Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

    // Ràng buộc 1: Chặn nếu có chuyên mục con
    if (categoryRepository.existsByParentCategory_CategoryID(categoryId)) {
        throw new BadRequestException("Không thể xóa chuyên mục này vì đang có chuyên mục con trực thuộc!");
    }
    // Ràng buộc 2: Chặn nếu đang chứa bài viết tin tức
    if (newsArticleRepository.existsByCategory_CategoryID(categoryId)) {
        throw new BadRequestException("Không thể xóa chuyên mục này vì đang có bài viết thuộc chuyên mục!");
    }
    categoryRepository.delete(category);
}""")

    out_file = os.path.join(WORKSPACE, "BaoCao_Assignment02_FUNewsManagement_TranHienVinh_SE1910.docx")
    doc.save(out_file)
    # Copy into A2 directory
    shutil.copy2(out_file, os.path.join(A2_DIR, "BaoCao_Assignment02_FUNewsManagement_TranHienVinh_SE1910.docx"))
    print(f"Assignment 02 docx saved to {out_file} and copied to {A2_DIR}")

# ==============================================================================
# 2. BUILD ASSIGNMENT 03 DOCUMENT
# ==============================================================================
def build_assignment_03_doc():
    print("Building Assignment 03 Document...")
    doc = Document()
    
    for sec in doc.sections:
        sec.top_margin = Inches(0.8)
        sec.bottom_margin = Inches(0.8)
        sec.left_margin = Inches(0.8)
        sec.right_margin = Inches(0.8)
        
    add_header_banner(
        doc,
        "BÁO CÁO KỸ THUẬT & HƯỚNG DẪN DEMO CHI TIẾT\nASSIGNMENT 03 - FU MINI HOTEL SYSTEM",
        "Securing REST Services with Spring Boot 3 & Single Page Application ReactJS"
    )

    # PHẦN I
    add_heading_styled(doc, "PHẦN I: ĐỀ BÀI & YÊU CẦU NGHIỆP VỤ (REQUIREMENTS)", level=1)
    add_p(doc, "Assignment 03 yêu cầu thiết kế và hiện thực hệ thống quản lý đặt phòng khách sạn (FUMiniHotelSystem) tích hợp giải pháp Bảo mật chuẩn doanh nghiệp với Spring Security 6 và JWT (JSON Web Token), kết hợp cơ sở dữ liệu MS SQL Server (A3TranHienVinh_SE1910).")

    add_heading_styled(doc, "1.1. Cơ chế Xác thực Độc đáo (Dual Authentication Mechanism)", level=2)
    add_callout(
        doc,
        "Đề bài Assignment 03 quy định rõ:\n"
        "1. Tài khoản Staff: ĐƯỢC ĐỌC TRỰC TIẾP TỪ FILE application.properties (hotel.staff.email, hotel.staff.password), hoàn toàn không nằm trong cơ sở dữ liệu.\n"
        "2. Tài khoản Khách hàng (Customer): Được lưu trữ và xác thực qua bảng Customer trong cơ sở dữ liệu.\n"
        "Hệ thống tự động nhận diện và phân luồng xác thực linh hoạt cho cả 2 đối tượng này trong cùng một endpoint đăng nhập duy nhất (/api/auth/login).",
        title="YÊU CẦU ĐẶC BIỆT VỀ AUTHENTICATION"
    )

    add_heading_styled(doc, "1.2. Ràng buộc Nghiệp vụ Cốt lõi (Business Rules)", level=2)
    add_p(doc, "Khi xóa phòng, hệ thống kiểm tra bảng BookingDetail. Nếu phòng đã từng được đặt, hệ thống CHỈ CẬP NHẬT TRẠNG THÁI RoomStatus = 0 (Inactive/Delete mềm) chứ không xóa vật lý khỏi database. Nếu phòng chưa từng được đặt, hệ thống tiến hành xóa cứng (Hard delete).", bold_prefix="1. Xóa phòng thông minh (Soft-delete vs Hard-delete): ")
    add_p(doc, "Khách hàng có thể chọn nhiều phòng cùng lúc trong một đơn đặt phòng, chọn ngày nhận (StartDate) và ngày trả (EndDate). Hệ thống tự động tính số ngày lưu trú bằng ChronoUnit.DAYS và nhân với đơn giá ActualPrice của từng phòng để ra TotalPrice chính xác.", bold_prefix="2. Đặt nhiều phòng cùng lúc (Multi-room Online Booking): ")
    add_p(doc, "Bảo vệ thông tin cá nhân của khách hàng khác; cho phép lọc báo cáo doanh thu theo khoảng thời gian tùy chọn.", bold_prefix="3. Phân quyền chặt chẽ & Báo cáo: ")

    # PHẦN II
    add_heading_styled(doc, "PHẦN II: KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP BẢO MẬT", level=1)
    add_p(doc, "Hệ thống tích hợp các công nghệ tiêu chuẩn hiện đại nhất:")
    add_p(doc, "Spring Boot 3.2.5, Java 21, Spring Data JPA, Spring Security 6, JJWT 0.12.6, MS SQL Server JDBC Driver.", bold_prefix="• Backend Stack: ")
    add_p(doc, "Mã hóa SecretKey với thuật toán HMAC-SHA-256, thời gian sống 24h, kèm thông tin Email và Role (ROLE_STAFF, ROLE_CUSTOMER).", bold_prefix="• JWT Token Security: ")
    add_p(doc, "Bảng BookingDetail sử dụng khóa chính phức hợp gồm BookingReservationID và RoomID, được ánh xạ qua class @Embeddable BookingDetailId trong Hibernate JPA.", bold_prefix="• Composite Primary Key: ")
    add_p(doc, "React 18 SPA (Vite), React Router DOM v6, Axios Interceptors (tự động đính kèm Bearer JWT vào Authorization Header), React-Bootstrap UI.", bold_prefix="• Frontend Stack: ")

    # PHẦN III - DEMO & SCREENSHOTS
    add_heading_styled(doc, "PHẦN III: HÌNH ẢNH DEMO THỰC TẾ HỆ THỐNG (CAPTURED SCREENSHOTS)", level=1)
    add_p(doc, "Dưới đây là toàn bộ hình ảnh giao diện thực tế của hệ thống Assignment 03 được chụp trực tiếp khi đang chạy backend Spring Boot (Port 8080) và frontend ReactJS (Port 5174):")

    a3_imgs = [
        ("01_A3_Public_HomePage.png", "Hình 1: Giao diện Trang chủ Khách sạn (Public Catalog) - Xem danh sách phòng, giá theo ngày, loại phòng và sức chứa"),
        ("02_A3_LoginPage.png", "Hình 2: Màn hình Đăng nhập tích hợp nút Quick Fill 1-Click cho Staff (application.properties) & Khách hàng"),
        ("03_A3_RegisterPage.png", "Hình 3: Màn hình Đăng ký tài khoản Khách hàng mới (Customer Registration)"),
        ("04_A3_Customer_OnlineBooking.png", "Hình 4: Màn hình Đặt phòng Trực tuyến dành cho Khách hàng - Chọn ngày, chọn nhiều phòng và tính tổng tiền tức thì"),
        ("05_A3_Customer_BookingConfirmed_Modal.png", "Hình 5: Popup Modal Xác nhận Đơn đặt phòng thành công với mã Reservation ID"),
        ("06_A3_Customer_MyBookings.png", "Hình 6: Màn hình Lịch sử Đơn đặt phòng của Khách hàng (Chi tiết các phòng đã thuê, thời gian và tổng chi phí)"),
        ("07_A3_Customer_Profile.png", "Hình 7: Màn hình Quản lý Thông tin cá nhân & Đổi mật khẩu của Khách hàng"),
        ("08_A3_Staff_RoomsManagement.png", "Hình 8: Màn hình Quản trị Phòng dành cho Staff (Danh sách phòng, tìm kiếm, lọc theo RoomType, trạng thái)"),
        ("09_A3_Staff_AddRoom_Modal.png", "Hình 9: Modal Thêm mới Phòng khách sạn (Số phòng, loại phòng, sức chứa, giá tiền/ngày)"),
        ("10_A3_Staff_CustomersManagement.png", "Hình 10: Màn hình Quản lý Danh sách Khách hàng dành cho Staff (Xem thông tin, trạng thái Active/Inactive)"),
        ("11_A3_Staff_BookingsReport.png", "Hình 11: Màn hình Quản lý Đơn đặt phòng & Báo cáo Doanh thu theo khoảng thời gian dành cho Staff")
    ]

    for fname, cap in a3_imgs:
        img_p = os.path.join(A3_SCREENSHOTS, fname)
        add_image_figure(doc, img_p, cap)

    # PHẦN IV
    add_heading_styled(doc, "PHẦN IV: GIẢI THÍCH MÃ NGUỒN CHI TIẾT (CODE WALKTHROUGH)", level=1)
    add_p(doc, "1. Cơ chế phân luồng đăng nhập kép trong CustomUserDetailsService.java:")
    add_code_block(doc,
"""@Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    // 1. Kiểm tra tài khoản Staff đọc từ file application.properties
    if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email.trim())) {
        String staffPassword = staffProperties.getPassword();
        String encodedStaffPass = staffPassword.startsWith("$2a$") ? staffPassword : passwordEncoder.encode(staffPassword);
        return UserPrincipal.createStaff(staffProperties.getEmail(), encodedStaffPass, staffProperties.getFullName());
    }

    // 2. Kiểm tra tài khoản Khách hàng trong Database
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
}""")

    add_p(doc, "2. Ràng buộc xóa phòng thông minh (Soft-delete vs Hard-delete) trong RoomServiceImpl.java:")
    add_code_block(doc,
"""@Override
@Transactional
public void deleteRoom(Integer roomId) {
    RoomInformation room = roomRepository.findById(roomId)
            .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

    // Ràng buộc nghiệp vụ: Nếu phòng đã từng được đặt, chỉ soft-delete (RoomStatus = 0)
    boolean hasBooking = bookingDetailRepository.existsByRoom_RoomID(roomId);
    if (hasBooking) {
        room.setRoomStatus((byte) 0); // 0 = Inactive (Đã xóa mềm)
        roomRepository.save(room);
    } else {
        // Nếu phòng chưa từng phát sinh booking, được phép xóa cứng vật lý
        roomRepository.delete(room);
    }
}""")

    out_file = os.path.join(WORKSPACE, "BaoCao_Assignment03_FUMiniHotel_TranHienVinh_SE1910.docx")
    doc.save(out_file)
    shutil.copy2(out_file, os.path.join(A3_DIR, "BaoCao_Assignment03_FUMiniHotel_TranHienVinh_SE1910.docx"))
    print(f"Assignment 03 docx saved to {out_file} and copied to {A3_DIR}")

if __name__ == "__main__":
    build_assignment_02_doc()
    build_assignment_03_doc()
    print("Both documents generated successfully!")
