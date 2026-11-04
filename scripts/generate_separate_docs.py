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

import docx
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

# Styling Helpers
def set_cell_background(cell, fill_hex):
    shading_xml = f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'
    cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def apply_table_borders(tbl):
    tbl_pr = tbl._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        '<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
        '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>'
        '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
        '<w:insideV w:val="none"/>'
        '<w:left w:val="none"/>'
        '<w:right w:val="none"/>'
        '</w:tblBorders>'
    )
    tbl_pr.append(borders)

def add_header_banner(doc, title, subtitle, doc_ref):
    # FPT Header
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(2)
    r_uni = p_inst.add_run("TRƯỜNG ĐẠI HỌC FPT CẦN THƠ\nBỘ MÔN KỸ THUẬT PHẦN MỀM (SOFTWARE ENGINEERING)")
    r_uni.font.name = "Arial"
    r_uni.font.size = Pt(11)
    r_uni.font.bold = True
    r_uni.font.color.rgb = RGBColor(180, 83, 9)

    # Line divider
    p_div = doc.add_paragraph()
    p_div.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_div.paragraph_format.space_before = Pt(2)
    p_div.paragraph_format.space_after = Pt(6)
    r_div = p_div.add_run("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    r_div.font.color.rgb = RGBColor(203, 213, 225)

    # Document Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(4)
    p_title.paragraph_format.space_after = Pt(4)
    r_main_title = p_title.add_run(title)
    r_main_title.font.name = "Arial"
    r_main_title.font.size = Pt(17)
    r_main_title.font.bold = True
    r_main_title.font.color.rgb = RGBColor(14, 116, 144)

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(12)
    r_sub = p_sub.add_run(subtitle)
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)

    # Metadata Student Box
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.8)
    set_cell_background(c, "F0FDF4") # soft green-tinted or blue
    set_cell_margins(c, 140, 140, 200, 200)
    cp = c.paragraphs[0]
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp.paragraph_format.line_spacing = 1.2
    
    r_info = cp.add_run(
        "Sinh viên thực hiện: TRẦN HIỂN VINH  |  MSSV: CE190881  |  Lớp: SE1910\n"
        "Môn học: SBA301 - Integrate Single Page Application with Spring Boot\n"
        f"Mã đề tài & CSDL: {doc_ref}  |  Học kỳ: Fall 2024 / Spring 2025\n"
        "Nền tảng công nghệ: Spring Boot 3 RESTful API (3-Layer) + ReactJS (Vite) + MS SQL Server"
    )
    r_info.font.name = "Arial"
    r_info.font.size = Pt(9.5)
    r_info.font.bold = True
    r_info.font.color.rgb = RGBColor(22, 101, 52)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

def add_heading_styled(doc, text, level):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.keep_with_next = True
    if level == 1:
        h.paragraph_format.space_before = Pt(16)
        h.paragraph_format.space_after = Pt(6)
        for r in h.runs:
            r.font.name = "Arial"
            r.font.size = Pt(13)
            r.font.bold = True
            r.font.color.rgb = RGBColor(15, 23, 42)
    elif level == 2:
        h.paragraph_format.space_before = Pt(12)
        h.paragraph_format.space_after = Pt(4)
        for r in h.runs:
            r.font.name = "Arial"
            r.font.size = Pt(11.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(14, 116, 144)
    elif level == 3:
        h.paragraph_format.space_before = Pt(8)
        h.paragraph_format.space_after = Pt(2)
        for r in h.runs:
            r.font.name = "Arial"
            r.font.size = Pt(10.5)
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
        r_pre.font.size = Pt(10.5)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(30, 41, 59)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(51, 65, 85)
    return p

def add_callout(doc, text, title="QUY ĐỊNH BẮT BUỘC TỪ ĐỀ BÀI", bg="FEF3C7", border_color="B45309"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.8)
    set_cell_background(c, bg)
    set_cell_margins(c, 120, 120, 180, 180)
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    r_t = p.add_run(f"📌 {title}:\n")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(10)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(180, 83, 9)
    r = p.add_run(text)
    r.font.name = "Calibri"
    r.font.size = Pt(10)
    r.font.color.rgb = RGBColor(74, 85, 104)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_image_figure(doc, img_path, caption):
    if not os.path.exists(img_path):
        add_p(doc, f"[Không tìm thấy tệp ảnh: {img_path}]", bold_prefix="Cảnh báo: ")
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(8)
    p_img.paragraph_format.space_after = Pt(3)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(6.3))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_after = Pt(12)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = "Calibri"
    r_cap.font.size = Pt(9.5)
    r_cap.font.bold = True
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(51, 65, 85)

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    c = tbl.cell(0, 0)
    c.width = Inches(6.8)
    set_cell_background(c, "F8FAFC")
    set_cell_margins(c, 100, 100, 140, 140)
    p = c.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(code_text)
    r.font.name = "Consolas"
    r.font.size = Pt(8.5)
    r.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def add_table_data(doc, headers, rows_data, col_widths=None):
    tbl = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    apply_table_borders(tbl)

    # Header row
    for col_idx, header in enumerate(headers):
        cell = tbl.cell(0, col_idx)
        set_cell_background(cell, "0E7490") # cyan-700
        set_cell_margins(cell, 120, 120, 140, 140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(header)
        r.font.name = "Arial"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    # Data rows
    for row_idx, row_data in enumerate(rows_data):
        bg = "FFFFFF" if row_idx % 2 == 0 else "F8FAFC"
        for col_idx, val in enumerate(row_data):
            cell = tbl.cell(row_idx + 1, col_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, 100, 100, 140, 140)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(str(val))
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = RGBColor(51, 65, 85)

    if col_widths:
        for row in tbl.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = width

    doc.add_paragraph().paragraph_format.space_after = Pt(6)


# ==============================================================================
# 1. GENERATE ASSIGNMENT 02 DOCUMENT
# ==============================================================================
def generate_ass2_doc():
    print(">>> Generating Assignment 02 Full Document...")
    doc = Document()
    for sec in doc.sections:
        sec.top_margin = Inches(0.75)
        sec.bottom_margin = Inches(0.75)
        sec.left_margin = Inches(0.75)
        sec.right_margin = Inches(0.75)

    add_header_banner(
        doc,
        "BÁO CÁO TỔNG HỢP GIAO DIỆN & TẤT CẢ CHỨC NĂNG HỆ THỐNG\nASSIGNMENT 02 - FU NEWS MANAGEMENT SYSTEM",
        "Implement CRUD Application with RESTful Web Service and ReactJS",
        "A2TranHienVinh_SE1910"
    )

    # I. TỔNG QUAN ĐỀ BÀI & REQUIREMENTS TRACEABILITY
    add_heading_styled(doc, "I. TỔNG QUAN ĐỀ BÀI & DANH MỤC YÊU CẦU NGHIỆP VỤ (REQUIREMENTS SPECIFICATION)", level=1)
    add_p(doc, 
        "Hệ thống Quản lý Tin tức (FUNewsManagementSystem) được xây dựng nhằm hỗ trợ các trường đại học và cơ sở giáo dục tổ chức, quản lý và xuất bản tin tức nội bộ một cách hiệu quả, chuyên nghiệp. "
        "Dự án Assignment 02 yêu cầu sinh viên hiện thực hóa toàn bộ các dịch vụ RESTful API đa tầng bằng Spring Boot 3 kết hợp giao diện Single Page Application (SPA) trên nền ReactJS (Vite) và hệ quản trị cơ sở dữ liệu Microsoft SQL Server."
    )

    add_callout(
        doc,
        "1. Tên Database bắt buộc: A2StudentName_ClassCode -> A2TranHienVinh_SE1910.\n"
        "2. Tên Project Backend: A2TranHienVinh_SE1910 (Spring Boot 3, 3-Layer Architecture).\n"
        "3. Tên Project Frontend: A2TranHienVinh_SE1910 (ReactJS Vite, Axios, Bootstrap).\n"
        "4. Giao diện CRUD bắt buộc: Các hành động Tạo mới (Create) và Cập nhật (Update) PHẢI thực hiện thông qua Popup Dialog (Modal). Hành động Xóa (Delete) LUÔN LUÔN PHẢI đi kèm hộp thoại xác nhận (Confirmation Dialog).\n"
        "5. Tìm kiếm (Search): Cung cấp tính năng tìm kiếm tức thời cho tất cả các bảng quản trị (Tin tức, Danh mục, Tài khoản).\n"
        "6. Validation: Kiểm tra và chuẩn hóa kiểu dữ liệu cho toàn bộ các trường nhập liệu.",
        title="CÁC RÀNG BUỘC KỸ THUẬT & GIAO DIỆN BẮT BUỘC TỪ TỆP ĐỀ BÀI"
    )

    add_heading_styled(doc, "Bảng đối chiếu Ma trận Yêu cầu Đề bài (Requirements Traceability Matrix):", level=2)
    headers_req = ["STT", "Vai trò (Role)", "Yêu cầu Nghiệp vụ theo Đề bài", "Ràng buộc Nghiệp vụ (Business Rules)", "Trạng thái"]
    rows_req = [
        ["1", "Public Guest", "Xem danh sách bài viết tin tức công khai", "Chỉ xem các bài viết có trạng thái Active (NewsStatus = 1), không cần đăng nhập", "ĐẠT 100%"],
        ["2", "Public Guest", "Tìm kiếm và lọc tin tức công khai", "Tìm kiếm theo từ khóa trong tiêu đề/nội dung hoặc lọc theo chuyên mục (Category)", "ĐẠT 100%"],
        ["3", "Member (Staff/Admin)", "Xác thực người dùng (Authentication)", "Đăng nhập bằng Email và Password, phân quyền theo AccountRole (1: Admin, 2: Staff)", "ĐẠT 100%"],
        ["4", "Admin (Role 1)", "Quản lý Tài khoản (CRUD + Search)", "Tạo mới, xem, sửa, tìm kiếm tài khoản người dùng qua Popup Dialog", "ĐẠT 100%"],
        ["5", "Admin (Role 1)", "Xóa tài khoản có ràng buộc", "CHẶN XÓA nếu tài khoản đã từng tạo bài viết trong bảng NewsArticle", "ĐẠT 100%"],
        ["6", "Staff (Role 2)", "Quản lý Chuyên mục (Category CRUD)", "Thêm, sửa, xem danh mục cha/con bằng Modal, tìm kiếm danh mục", "ĐẠT 100%"],
        ["7", "Staff (Role 2)", "Xóa chuyên mục có ràng buộc", "CHẶN XÓA nếu Category đang chứa bài viết hoặc có danh mục con trực thuộc", "ĐẠT 100%"],
        ["8", "Staff (Role 2)", "Quản lý Bài viết Tin tức (CRUD + Search)", "Thêm/sửa qua Modal, gắn thẻ Tags cho bài viết, chọn chuyên mục, bật/tắt trạng thái", "ĐẠT 100%"],
        ["9", "Staff (Role 2)", "Quản lý Hồ sơ cá nhân (Profile)", "Xem và cập nhật thông tin cá nhân và mật khẩu của chính tài khoản nhân viên", "ĐẠT 100%"],
        ["10", "Staff (Role 2)", "Xem lịch sử bài viết cá nhân (History)", "Màn hình riêng hiển thị các bài viết do chính nhân viên đăng nhập khởi tạo", "ĐẠT 100%"],
    ]
    add_table_data(doc, headers_req, rows_req, [Inches(0.4), Inches(1.2), Inches(2.2), Inches(2.3), Inches(0.7)])

    # II. KIẾN TRÚC HỆ THỐNG
    add_heading_styled(doc, "II. KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP KỸ THUẬT (3-LAYER ARCHITECTURE)", level=1)
    add_p(doc, 
        "Dự án được xây dựng theo mô hình phân tầng chuẩn doanh nghiệp (3-Layer Architecture with Repository Pattern), đảm bảo sự độc lập giữa các tầng xử lý, tính mở rộng cao và dễ dàng kiểm thử tự động:"
    )
    add_p(doc, "Ánh xạ các bảng cơ sở dữ liệu quan hệ sang Java Classes bằng Jakarta Persistence (JPA). Bao gồm 4 thực thể: SystemAccount, Category, NewsArticle, Tag.", bold_prefix="1. Tầng Thực thể (Entity Layer): ")
    add_p(doc, "Kế thừa JpaRepository, chịu trách nhiệm thao tác trực tiếp với cơ sở dữ liệu qua các câu lệnh chuẩn và Custom Derived Query Methods (như existsByCreatedBy_AccountID, existsByCategory_CategoryID).", bold_prefix="2. Tầng Truy cập Dữ liệu (Repository Layer): ")
    add_p(doc, "Nơi hiện thực hóa toàn bộ Business Logic và kiểm soát tính toàn vẹn dữ liệu. Quản lý giao dịch (@Transactional), kiểm tra các quy tắc chặn xóa bài viết/danh mục trước khi gọi thao tác CSDL.", bold_prefix="3. Tầng Nghiệp vụ (Service Layer): ")
    add_p(doc, "Tiếp nhận các HTTP Request (GET, POST, PUT, DELETE), thực hiện Validate dữ liệu đầu vào (@Valid), chuyển đổi dữ liệu qua DTO (Data Transfer Object) và trả về ResponseEntity kèm HTTP Status Code chuẩn RESTful.", bold_prefix="4. Tầng Điều khiển (Controller Layer): ")
    add_p(doc, "Ứng dụng Single Page Application (SPA) độc lập, sử dụng Vite, React 18, React Router v6, Axios Client và giao diện tương tác người dùng hiện đại với React-Bootstrap & Bootstrap Icons.", bold_prefix="5. Tầng Giao diện Người dùng (ReactJS Client): ")

    # III. QUY TRÌNH CHỨC NĂNG & DEMO
    add_heading_styled(doc, "III. QUY TRÌNH CHỨC NĂNG & HÌNH ẢNH DEMO CHI TIẾT (TẤT CẢ MÀN HÌNH)", level=1)
    add_p(doc, "Dưới đây là toàn bộ các quy trình nghiệp vụ và hình ảnh giao diện thực tế được chụp trực tiếp khi hệ thống đang vận hành trên máy chủ cục bộ:")

    add_heading_styled(doc, "1. Màn hình Trang chủ Tin tức Công khai (Public News Home)", level=2)
    add_p(doc, "Người dùng vãng lai (khách không cần đăng nhập) có thể truy cập ngay trang chủ để theo dõi toàn bộ các bài viết tin tức đang hoạt động (NewsStatus = 1). Các bài viết được hiển thị trực quan dưới dạng thẻ Card với tiêu đề, trích dẫn headline, ngày đăng, chuyên mục và tác giả.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "01_A2_Public_HomePage.png"), "Hình 1: Giao diện Trang chủ Tin tức Công khai dành cho Public Guest")

    add_heading_styled(doc, "2. Chức năng Tìm kiếm & Lọc Tin tức Tức thời (Search & Category Filter)", level=2)
    add_p(doc, "Khách có thể nhập từ khóa vào ô tìm kiếm để lọc bài viết theo tiêu đề/nội dung hoặc nhấp chọn các nút danh mục (Category) trên thanh điều hướng để xem các bài viết chuyên biệt.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "02_A2_Public_SearchFilter.png"), "Hình 2: Kết quả tìm kiếm và lọc bài viết tin tức theo chuyên mục và từ khóa")

    add_heading_styled(doc, "3. Màn hình Đăng nhập Hệ thống (Authentication Login)", level=2)
    add_p(doc, "Màn hình tiếp nhận Email và Password của thành viên. Hệ thống tự động kiểm tra tài khoản, mã hóa xác thực và phân luồng điều hướng: Admin (Role = 1) vào trang Quản lý Tài khoản, Staff (Role = 2) vào trang Quản lý Tin tức.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "03_A2_LoginPage.png"), "Hình 3: Giao diện Đăng nhập Hệ thống FUNewsManagement")

    add_heading_styled(doc, "4. Màn hình Quản lý Tài khoản Người dùng (Admin Account Management)", level=2)
    add_p(doc, "Chỉ Quản trị viên (Admin) mới có quyền truy cập. Bảng hiển thị danh sách toàn bộ tài khoản với Account ID, Tên người dùng, Email, Vai trò (Admin/Staff badge) và các nút thao tác Thêm, Sửa, Xóa, Tìm kiếm.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "04_A2_Admin_AccountManagement.png"), "Hình 4: Bảng Quản trị Danh sách Tài khoản dành cho Administrator")

    add_heading_styled(doc, "5. Hộp thoại Thêm mới / Cập nhật Tài khoản (Create/Edit Account Modal)", level=2)
    add_p(doc, "Đáp ứng 100% yêu cầu đề bài: Thao tác Tạo mới và Sửa tài khoản BẮT BUỘC phải thực hiện qua Popup Dialog (Modal) với đầy đủ validate: kiểm tra định dạng email, độ dài mật khẩu và bắt buộc chọn vai trò.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "05_A2_Admin_CreateAccount_Modal.png"), "Hình 5: Hộp thoại Modal Tạo mới / Cập nhật Tài khoản người dùng")

    add_heading_styled(doc, "6. Màn hình Quản trị Bài viết Tin tức (Staff News Article Management)", level=2)
    add_p(doc, "Nhân viên (Staff) quản lý toàn bộ danh sách bài viết trong tòa soạn: hiển thị Tiêu đề, Chuyên mục, Tác giả, Ngày tạo/chỉnh sửa, Trạng thái (Active/Inactive) và danh sách Thẻ Tags đi kèm bài viết.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "06_A2_Staff_NewsManagement.png"), "Hình 6: Màn hình Quản lý Bài viết Tin tức dành cho Nhân viên Staff")

    add_heading_styled(doc, "7. Hộp thoại Soạn thảo / Thêm mới Tin tức (Create News Article Modal)", level=2)
    add_p(doc, "Popup Dialog soạn thảo bài viết gồm: Tiêu đề bài viết, Headline, Nội dung chi tiết, Nguồn tin (News Source), Chọn danh mục chuyên mục (Category dropdown), Bật/tắt trạng thái Active và Chọn nhiều thẻ Tags cùng lúc.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "07_A2_Staff_CreateNews_Modal.png"), "Hình 7: Hộp thoại Modal Soạn thảo và Tạo mới Bài viết Tin tức")

    add_heading_styled(doc, "8. Màn hình Quản lý Chuyên mục Tin tức (Category Management)", level=2)
    add_p(doc, "Staff quản lý cây danh mục tin tức (Category Name, Description, Parent Category, Trạng thái). Hỗ trợ thêm/sửa qua Modal và tìm kiếm danh mục. Nút Xóa có hộp thoại xác nhận và kiểm tra ràng buộc không cho xóa nếu danh mục đang chứa bài viết hoặc có danh mục con.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "08_A2_Staff_CategoryManagement.png"), "Hình 8: Màn hình Quản trị Danh mục Chuyên mục Tin tức (Category)")

    add_heading_styled(doc, "9. Màn hình Quản lý Hồ sơ Cá nhân (Staff Profile Management)", level=2)
    add_p(doc, "Nhân viên xem thông tin tài khoản của chính mình và có thể tự cập nhật Tên hiển thị, Mật khẩu mới để nâng cao tính bảo mật cá nhân.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "09_A2_Staff_Profile.png"), "Hình 9: Màn hình Cập nhật Hồ sơ cá nhân của Nhân viên Staff")

    add_heading_styled(doc, "10. Màn hình Lịch sử Bài viết do Nhân viên khởi tạo (Staff News History)", level=2)
    add_p(doc, "Màn hình chuyên biệt chỉ hiển thị danh sách các bài viết do chính nhân viên đang đăng nhập biên soạn (CreatedByID = loggedUserId). Giúp nhân viên dễ dàng rà soát và theo dõi tiến độ xuất bản của mình.")
    add_image_figure(doc, os.path.join(A2_SCREENSHOTS, "10_A2_Staff_MyHistory.png"), "Hình 10: Màn hình Lịch sử Bài viết cá nhân của Nhân viên Staff")

    # IV. GIẢI THÍCH MÃ NGUỒN CHI TIẾT
    add_heading_styled(doc, "IV. GIẢI THÍCH MÃ NGUỒN CHI TIẾT THEO TỪNG TẦNG (DETAILED CODE WALKTHROUGH)", level=1)
    
    add_heading_styled(doc, "4.1. Tầng Repository: Kiểm tra Điều kiện Ràng buộc Nghiệp vụ", level=2)
    add_p(doc, "Các phương thức truy vấn tự sinh (Derived Queries) trong NewsArticleRepository.java và CategoryRepository.java kiểm tra sự tồn tại của khóa ngoại nhanh chóng và tối ưu:")
    add_code_block(doc,
"""// NewsArticleRepository.java
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {
    // Kiểm tra xem tài khoản có bài viết nào không (dùng để chặn xóa Account)
    boolean existsByCreatedBy_AccountID(Short accountId);

    // Kiểm tra xem danh mục có bài viết nào không (dùng để chặn xóa Category)
    boolean existsByCategory_CategoryID(Short categoryId);
}

// CategoryRepository.java
public interface CategoryRepository extends JpaRepository<Category, Short> {
    // Kiểm tra xem danh mục có chuyên mục con không (dùng để chặn xóa Category cha)
    boolean existsByParentCategory_CategoryID(Short parentId);
}""")

    add_heading_styled(doc, "4.2. Tầng Service: Ràng buộc Chặn xóa Tài khoản (Account Deletion Rule)", level=2)
    add_p(doc, "Theo đúng yêu cầu đề bài: 'The delete action will delete an account in the case this account is not belong to any news articles (created), if the account is already created any news article, cannot delete'. Đoạn mã trong SystemAccountServiceImpl.java:")
    add_code_block(doc,
"""@Override
@Transactional
public void deleteAccount(Short accountId) {
    SystemAccount account = systemAccountRepository.findById(accountId)
            .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
            
    // Business Rule Bắt buộc từ Đề bài: Chặn xóa tài khoản nếu đã từng tạo bài viết
    boolean hasNews = newsArticleRepository.existsByCreatedBy_AccountID(accountId);
    if (hasNews) {
        throw new BadRequestException("Không thể xóa tài khoản này vì tài khoản đã tạo bài viết tin tức!");
    }
    
    systemAccountRepository.delete(account);
}""")

    add_heading_styled(doc, "4.3. Tầng Service: Ràng buộc Chặn xóa Chuyên mục (Category Deletion Rule)", level=2)
    add_p(doc, "Theo đúng yêu cầu đề bài: 'The delete action will delete an item in the case this item is not belong to any news articles. If the item is already stored in a news article cannot delete'. Đoạn mã trong CategoryServiceImpl.java:")
    add_code_block(doc,
"""@Override
@Transactional
public void deleteCategory(Short categoryId) {
    Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

    // Ràng buộc 1: Chặn xóa nếu đang có chuyên mục con trực thuộc
    if (categoryRepository.existsByParentCategory_CategoryID(categoryId)) {
        throw new BadRequestException("Không thể xóa chuyên mục này vì đang có chuyên mục con trực thuộc!");
    }
    // Ràng buộc 2: Chặn xóa nếu đang chứa bài viết tin tức
    if (newsArticleRepository.existsByCategory_CategoryID(categoryId)) {
        throw new BadRequestException("Không thể xóa chuyên mục này vì đang có bài viết thuộc chuyên mục!");
    }

    categoryRepository.delete(category);
}""")

    # V. BỘ DỮ LIỆU KIỂM THỬ & HƯỚNG DẪN CÀI ĐẶT
    add_heading_styled(doc, "V. BỘ DỮ LIỆU KIỂM THỬ & HƯỚNG DẪN VẬN HÀNH (SETUP & TEST CREDENTIALS)", level=1)
    
    add_heading_styled(doc, "5.1. Bảng Tài khoản Kiểm thử Hệ thống (Test Credentials)", level=2)
    headers_acc = ["Vai trò (Role)", "Địa chỉ Email", "Mật khẩu", "Họ tên hiển thị", "Quyền hạn chính"]
    rows_acc = [
        ["Administrator (1)", "SteveParis@FUNewsManagement.org", "@1", "Steve Paris", "Quản lý toàn bộ tài khoản (CRUD, Search), chặn xóa nếu có bài"],
        ["Staff (2)", "EmmaWilliam@FUNewsManagement.org", "@1", "Emma William", "Quản lý bài viết (CRUD, Tags), chuyên mục (CRUD), Profile, Lịch sử"],
        ["Staff (2)", "OliviaJames@FUNewsManagement.org", "@1", "Olivia James", "Quản lý bài viết, chuyên mục, lịch sử bài viết cá nhân"],
        ["Public Guest", "Không yêu cầu", "Không yêu cầu", "Khách vãng lai", "Xem danh sách tin tức Active, tìm kiếm và lọc chuyên mục"]
    ]
    add_table_data(doc, headers_acc, rows_acc, [Inches(1.2), Inches(2.2), Inches(0.8), Inches(1.2), Inches(1.4)])

    add_heading_styled(doc, "5.2. Hướng dẫn Khởi chạy và Vận hành Hệ thống", level=2)
    add_p(doc, "1. Cơ sở dữ liệu: Mở SQL Server Management Studio (SSMS) hoặc sqlcmd, thực thi script database tại A2TranHienVinh_SE1910/database/FUNewsManagementSBA301.sql để tạo CSDL A2TranHienVinh_SE1910.")
    add_p(doc, "2. Khởi chạy Backend Spring Boot (Port 8080):")
    add_code_block(doc, "cd A2TranHienVinh_SE1910/backend\nmvn clean spring-boot:run")
    add_p(doc, "3. Khởi chạy Frontend ReactJS Vite (Port 5173):")
    add_code_block(doc, "cd A2TranHienVinh_SE1910/frontend\nnpm install\nnpm run dev")
    add_p(doc, "4. Kiểm thử API qua Postman: Import file A2TranHienVinh_SE1910/A2TranHienVinh_SE1910.postman_collection.json vào Postman để kiểm thử toàn diện các endpoint RESTful.")

    out_file = os.path.join(WORKSPACE, "BaoCao_Assignment02_FUNewsManagement_TranHienVinh_SE1910.docx")
    doc.save(out_file)
    shutil.copy2(out_file, os.path.join(A2_DIR, "BaoCao_Assignment02_FUNewsManagement_TranHienVinh_SE1910.docx"))
    print(f"Assignment 02 docx successfully generated at {out_file}")


# ==============================================================================
# 2. GENERATE ASSIGNMENT 03 DOCUMENT
# ==============================================================================
def generate_ass3_doc():
    print(">>> Generating Assignment 03 Full Document...")
    doc = Document()
    for sec in doc.sections:
        sec.top_margin = Inches(0.75)
        sec.bottom_margin = Inches(0.75)
        sec.left_margin = Inches(0.75)
        sec.right_margin = Inches(0.75)

    add_header_banner(
        doc,
        "BÁO CÁO TỔNG HỢP GIAO DIỆN & TẤT CẢ CHỨC NĂNG HỆ THỐNG\nASSIGNMENT 03 - FU MINI HOTEL SYSTEM",
        "Securing REST Services with Spring Boot 3 & Single Page Application ReactJS",
        "A3TranHienVinh_SE1910"
    )

    # I. TỔNG QUAN ĐỀ BÀI & REQUIREMENTS TRACEABILITY
    add_heading_styled(doc, "I. TỔNG QUAN ĐỀ BÀI & DANH MỤC YÊU CẦU NGHIỆP VỤ (REQUIREMENTS SPECIFICATION)", level=1)
    add_p(doc, 
        "Hệ thống Quản lý Khách sạn mini (FUMiniHotelSystem) được thiết kế nhằm tự động hóa toàn bộ quy trình đặt phòng, quản lý thông tin khách hàng, phòng ở và các giao dịch tài chính. "
        "Yêu cầu cốt lõi của Assignment 03 là tích hợp cơ chế Bảo mật chuẩn doanh nghiệp bằng Spring Security 6 và JSON Web Token (JWT), hỗ trợ cơ chế xác thực phân luồng độc đáo cho nhân viên và khách hàng, kết hợp Single Page Application ReactJS."
    )

    add_callout(
        doc,
        "1. Cơ chế Xác thực Kép (Dual Authentication):\n"
        "   - Tài khoản Staff: ĐƯỢC ĐỌC TRỰC TIẾP TỪ FILE application.properties (hotel.staff.email, hotel.staff.password), tuyệt đối KHÔNG nằm trong cơ sở dữ liệu.\n"
        "   - Tài khoản Customer: Được lưu trữ, quản lý và xác thực qua bảng Customer trong CSDL.\n"
        "2. Tên Database bắt buộc: A3StudentName_ClassCode -> A3TranHienVinh_SE1910.\n"
        "3. Tên Project: A3StudentName_ClassCode cho cả Backend (Spring Boot 3) và Frontend (ReactJS Vite).\n"
        "4. Ràng buộc Xóa phòng (Soft-delete vs Hard-delete): Nếu phòng đã từng phát sinh giao dịch đặt phòng (tồn tại trong BookingDetail), hệ thống CHỈ ĐƯỢC ĐỔI TRẠNG THÁI RoomStatus = 0 (Inactive / Xóa mềm). Nếu phòng chưa từng được đặt, được phép xóa cứng vật lý.\n"
        "5. Đặt phòng Online nhiều phòng (Multi-room Booking): Khách hàng có thể chọn cùng lúc một hoặc nhiều phòng trong một giao dịch đặt phòng. Hệ thống tự động tính số ngày lưu trú và tổng tiền chính xác.",
        title="CÁC RÀNG BUỘC KỸ THUẬT & BẢO MẬT BẮT BUỘC TỪ TỆP ĐỀ BÀI"
    )

    add_heading_styled(doc, "Bảng đối chiếu Ma trận Yêu cầu Đề bài (Requirements Traceability Matrix):", level=2)
    headers_req = ["STT", "Vai trò (Role)", "Yêu cầu Nghiệp vụ theo Đề bài", "Ràng buộc Nghiệp vụ (Business Rules)", "Trạng thái"]
    rows_req = [
        ["1", "Public Guest", "Xem thông tin phòng công khai (Public Rooms)", "Xem danh sách phòng Active, loại phòng, giá theo ngày, không cần đăng nhập", "ĐẠT 100%"],
        ["2", "Customer", "Đăng ký tài khoản (Register)", "Đăng ký tài khoản thành viên mới lưu vào bảng Customer với mật khẩu mã hóa BCrypt", "ĐẠT 100%"],
        ["3", "Customer", "Xác thực JWT (Login Customer)", "Đăng nhập bằng Email/Password đối chiếu bảng Customer trong CSDL, phát hành Bearer JWT", "ĐẠT 100%"],
        ["4", "Customer", "Đặt phòng Online (Multi-room Booking)", "Chọn ngày Check-in/Check-out, chọn 1 hoặc nhiều phòng, tự tính ngày lưu trú và tổng tiền", "ĐẠT 100%"],
        ["5", "Customer", "Xem lịch sử đặt phòng (Booking History)", "Xem danh sách các đơn đặt phòng của chính mình kèm chi tiết các phòng đã thuê", "ĐẠT 100%"],
        ["6", "Customer", "Quản lý Hồ sơ cá nhân (Profile & Password)", "Xem, cập nhật thông tin cá nhân và thay đổi mật khẩu tài khoản của chính mình", "ĐẠT 100%"],
        ["7", "Staff", "Xác thực từ file cấu hình (Staff Auth)", "Đăng nhập bằng Email/Password cấu hình trong application.properties, phát hành JWT Role STAFF", "ĐẠT 100%"],
        ["8", "Staff", "Quản lý Phòng (Room Management CRUD)", "Xem danh sách, tìm kiếm, lọc theo RoomType, thêm/sửa qua Modal, xóa phòng có điều kiện", "ĐẠT 100%"],
        ["9", "Staff", "Ràng buộc Xóa phòng thông minh", "Soft-delete (RoomStatus = 0) nếu phòng đã có trong BookingDetail; Hard-delete nếu chưa từng thuê", "ĐẠT 100%"],
        ["10", "Staff", "Quản lý Khách hàng (Customer Management)", "Xem danh sách khách hàng, tìm kiếm, kích hoạt / vô hiệu hóa trạng thái tài khoản", "ĐẠT 100%"],
        ["11", "Staff", "Quản lý Đơn đặt phòng & Báo cáo Doanh thu", "Xem tất cả giao dịch đặt phòng và lọc thống kê doanh thu theo khoảng thời gian tùy chọn", "ĐẠT 100%"],
    ]
    add_table_data(doc, headers_req, rows_req, [Inches(0.4), Inches(1.1), Inches(2.3), Inches(2.3), Inches(0.7)])

    # II. KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP BẢO MẬT
    add_heading_styled(doc, "II. KIẾN TRÚC HỆ THỐNG & GIẢI PHÁP BẢO MẬT (SPRING SECURITY & JWT)", level=1)
    add_p(doc, 
        "Hệ thống tuân thủ kiến trúc phân tầng 3-Layer Architecture kết hợp Spring Security 6 và JSON Web Token (JJWT 0.12.6) hoàn chỉnh:"
    )
    add_p(doc, "Bao gồm RoomType, RoomInformation, Customer, BookingReservation và BookingDetail. Trong đó BookingDetail sử dụng khóa chính phức hợp (Composite Primary Key) ánh xạ qua class @Embeddable BookingDetailId gồm BookingReservationID và RoomID.", bold_prefix="1. Tầng Thực thể (Entity Layer): ")
    add_p(doc, "Hiện thực CustomUserDetailsService đọc tài khoản Staff từ StaffProperties (application.properties) hoặc Customer từ CustomerRepository. Sử dụng PasswordEncoder (BCrypt) để bảo vệ mật khẩu.", bold_prefix="2. Cơ chế Dual Authentication: ")
    add_p(doc, "Cấu hình SecurityFilterChain Stateless (không dùng Session), phân quyền chi tiết theo Endpoint và HTTP Method (hasRole('STAFF') cho các API quản trị, authenticated() cho Customer và permitAll() cho Public).", bold_prefix="3. Spring Security 6 & JWT Filter: ")
    add_p(doc, "Xử lý logic nghiệp vụ đặt nhiều phòng, tính toán số ngày lưu trú bằng java.time.temporal.ChronoUnit.DAYS, kiểm tra và chuyển đổi trạng thái xóa mềm phòng.", bold_prefix="4. Tầng Nghiệp vụ (Service Layer): ")
    add_p(doc, "ReactJS Single Page Application khởi tạo bằng Vite, tích hợp AuthContext và Axios Interceptor tự động gán Bearer Token vào Header Authorization cho mọi HTTP Request.", bold_prefix="5. Tầng Giao diện (ReactJS Frontend): ")

    # III. QUY TRÌNH CHỨC NĂNG & DEMO
    add_heading_styled(doc, "III. QUY TRÌNH CHỨC NĂNG & HÌNH ẢNH DEMO CHI TIẾT (TẤT CẢ MÀN HÌNH)", level=1)
    add_p(doc, "Dưới đây là toàn bộ các quy trình nghiệp vụ và hình ảnh giao diện thực tế được chụp trực tiếp khi hệ thống đang vận hành trên máy chủ cục bộ:")

    add_heading_styled(doc, "1. Màn hình Trang chủ Khách sạn (Public Room Catalog)", level=2)
    add_p(doc, "Người dùng vãng lai (khách không cần đăng nhập) có thể theo dõi danh mục toàn bộ các phòng đang hoạt động (RoomStatus = 1). Mỗi phòng hiển thị Số phòng (Room Number), Loại phòng (Room Type), Sức chứa tối đa (Max Capacity), Giá thuê theo ngày (Price Per Day) và Mô tả chi tiết tiện nghi.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "01_A3_Public_HomePage.png"), "Hình 1: Giao diện Trang chủ Khách sạn & Danh mục Phòng dành cho Public Guest")

    add_heading_styled(doc, "2. Màn hình Đăng nhập Tích hợp Quick Fill 1-Click (Login Page)", level=2)
    add_p(doc, "Màn hình tiếp nhận Email và Password. Điểm nổi bật: Trang bị sẵn các nút '1-Click Quick Fill' giúp Giảng viên và Người chấm thi có thể lập tức điền thông tin tài khoản Staff (lấy từ application.properties) hoặc tài khoản Khách hàng (trong CSDL) để kiểm thử nhanh chóng.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "02_A3_LoginPage.png"), "Hình 2: Màn hình Đăng nhập với nút Quick Fill 1-Click cho Staff và Customer")

    add_heading_styled(doc, "3. Màn hình Đăng ký Tài khoản Khách hàng mới (Customer Registration)", level=2)
    add_p(doc, "Khách hàng mới có thể tự đăng ký tài khoản với đầy đủ thông tin: Họ và tên, Email, Số điện thoại, Ngày sinh và Mật khẩu. Dữ liệu được mã hóa bảo mật BCrypt trước khi lưu trữ vào bảng Customer trong CSDL.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "03_A3_RegisterPage.png"), "Hình 3: Màn hình Đăng ký tài khoản Khách hàng mới (Customer Register)")

    add_heading_styled(doc, "4. Màn hình Đặt phòng Trực tuyến Đa phòng (Customer Online Multi-room Booking)", level=2)
    add_p(doc, "Khách hàng chọn Ngày nhận phòng (Start Date) và Ngày trả phòng (End Date). Sau đó tích chọn một hoặc nhiều phòng cần thuê. Hệ thống tự động tính số ngày lưu trú và hiển thị tổng chi phí (Total Price) theo thời gian thực trên thanh tóm tắt.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "04_A3_Customer_OnlineBooking.png"), "Hình 4: Màn hình Đặt phòng Trực tuyến dành cho Khách hàng (Hỗ trợ chọn nhiều phòng)")

    add_heading_styled(doc, "5. Hộp thoại Modal Xác nhận Đặt phòng Thành công (Booking Confirmed Modal)", level=2)
    add_p(doc, "Khi khách hàng bấm 'Xác nhận đặt phòng', hệ thống gửi đơn hàng về backend, khởi tạo một BookingReservation và các bản ghi BookingDetail tương ứng, sau đó hiển thị thông báo thành công kèm mã Reservation ID.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "05_A3_Customer_BookingConfirmed_Modal.png"), "Hình 5: Hộp thoại Modal Xác nhận Đơn đặt phòng thành công")

    add_heading_styled(doc, "6. Màn hình Lịch sử Đơn đặt phòng của Khách hàng (Customer My Bookings)", level=2)
    add_p(doc, "Khách hàng có thể theo dõi toàn bộ các lần đặt phòng trước đây của chính mình, xem chi tiết từng phòng đã thuê, khoảng thời gian lưu trú và tổng tiền thanh toán.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "06_A3_Customer_MyBookings.png"), "Hình 6: Màn hình Lịch sử Đơn đặt phòng của Khách hàng (My Bookings)")

    add_heading_styled(doc, "7. Màn hình Hồ sơ Cá nhân & Đổi Mật khẩu Khách hàng (Customer Profile)", level=2)
    add_p(doc, "Khách hàng có thể xem thông tin cá nhân đã đăng ký, cập nhật số điện thoại và chủ động thay đổi mật khẩu bảo vệ tài khoản.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "07_A3_Customer_Profile.png"), "Hình 7: Màn hình Cập nhật Hồ sơ cá nhân và Đổi mật khẩu của Khách hàng")

    add_heading_styled(doc, "8. Màn hình Quản trị Phòng dành cho Nhân viên (Staff Rooms Management)", level=2)
    add_p(doc, "Chỉ nhân viên (Staff) mới có quyền truy cập. Bảng hiển thị danh sách phòng, phân loại theo RoomType, trạng thái (Active/Inactive), tìm kiếm theo số phòng/mô tả và lọc theo loại phòng. Nút Xóa phòng kích hoạt cơ chế xóa thông minh.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "08_A3_Staff_RoomsManagement.png"), "Hình 8: Màn hình Quản trị Danh sách Phòng khách sạn dành cho Staff")

    add_heading_styled(doc, "9. Hộp thoại Thêm mới / Cập nhật Phòng Khách sạn (Staff Add/Edit Room Modal)", level=2)
    add_p(doc, "Popup Dialog hỗ trợ nhân viên nhập Số phòng (Room Number), Chọn Loại phòng (RoomType dropdown), Sức chứa tối đa (Max Capacity), Giá thuê theo ngày (Price Per Day) và Mô tả tiện nghi chi tiết.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "09_A3_Staff_AddRoom_Modal.png"), "Hình 9: Hộp thoại Modal Thêm mới / Chỉnh sửa Phòng khách sạn")

    add_heading_styled(doc, "10. Màn hình Quản lý Danh sách Khách hàng (Staff Customers Management)", level=2)
    add_p(doc, "Nhân viên xem toàn bộ danh sách khách hàng trong hệ thống, tìm kiếm theo tên/email, kích hoạt hoặc vô hiệu hóa tài khoản (Status Active/Inactive) để kiểm soát quyền đăng nhập.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "10_A3_Staff_CustomersManagement.png"), "Hình 10: Màn hình Quản lý Danh sách Khách hàng dành cho Staff")

    add_heading_styled(doc, "11. Màn hình Báo cáo Doanh thu & Quản lý Đơn đặt phòng (Staff Bookings Report)", level=2)
    add_p(doc, "Nhân viên theo dõi tất cả các giao dịch đặt phòng của toàn hệ thống, có thể chọn khoảng thời gian (Từ ngày - Đến ngày) để lọc danh sách và xem thống kê Tổng doanh thu khách sạn thu được.")
    add_image_figure(doc, os.path.join(A3_SCREENSHOTS, "11_A3_Staff_BookingsReport.png"), "Hình 11: Màn hình Báo cáo Doanh thu & Quản lý Đơn đặt phòng dành cho Staff")

    # IV. GIẢI THÍCH MÃ NGUỒN CHI TIẾT
    add_heading_styled(doc, "IV. GIẢI THÍCH MÃ NGUỒN CHI TIẾT THEO TỪNG TẦNG (DETAILED CODE WALKTHROUGH)", level=1)

    add_heading_styled(doc, "4.1. Cơ chế Phân luồng Xác thực Kép (CustomUserDetailsService.java)", level=2)
    add_p(doc, "Theo đúng yêu cầu đề bài: 'The Staff account will get from application.properties file'. Lớp CustomUserDetailsService nhận diện Staff từ file properties hoặc Customer từ bảng CSDL:")
    add_code_block(doc,
"""@Override
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
}""")

    add_heading_styled(doc, "4.2. Ràng buộc Xóa phòng Thông minh (Soft-delete vs Hard-delete trong RoomServiceImpl.java)", level=2)
    add_p(doc, "Theo đúng yêu cầu đề bài: 'The delete action will delete room information in the case this information is not belong to any renting transaction. If the room information is already stored in a booking detail, just change the status'.")
    add_code_block(doc,
"""@Override
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
}""")

    add_heading_styled(doc, "4.3. Nghiệp vụ Đặt nhiều phòng & Tính toán Tổng tiền (BookingServiceImpl.java)", level=2)
    add_p(doc, "Xử lý đặt nhiều phòng cùng lúc, tự động tính số ngày lưu trú bằng ChronoUnit.DAYS và nhân với đơn giá ActualPrice của từng phòng:")
    add_code_block(doc,
"""@Override
@Transactional
public BookingResponse createBooking(Integer customerId, BookingCreateRequest request) {
    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

    // Khởi tạo đơn đặt phòng
    BookingReservation reservation = new BookingReservation();
    reservation.setBookingDate(LocalDate.now());
    reservation.setBookingStatus((byte) 1); // 1 = Confirmed
    reservation.setCustomer(customer);

    BigDecimal totalPrice = BigDecimal.ZERO;
    List<BookingDetail> details = new ArrayList<>();

    for (BookingDetailItemRequest item : request.getRooms()) {
        RoomInformation room = roomRepository.findById(item.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + item.getRoomId()));

        // Tính số ngày lưu trú: tối thiểu là 1 ngày
        long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
        if (days <= 0) days = 1;

        BigDecimal roomCost = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
        totalPrice = totalPrice.add(roomCost);

        // Khởi tạo chi tiết đặt phòng với Composite Key
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
    // Lưu các BookingDetail...
    return mapToBookingResponse(saved);
}""")

    # V. BỘ DỮ LIỆU KIỂM THỬ & HƯỚNG DẪN CÀI ĐẶT
    add_heading_styled(doc, "V. BỘ DỮ LIỆU KIỂM THỬ & HƯỚNG DẪN VẬN HÀNH (SETUP & TEST CREDENTIALS)", level=1)

    add_heading_styled(doc, "5.1. Bảng Tài khoản Kiểm thử Hệ thống (Test Credentials)", level=2)
    headers_acc = ["Vai trò (Role)", "Nguồn Tài khoản (Source)", "Địa chỉ Email", "Mật khẩu", "Quyền hạn chính"]
    rows_acc = [
        ["Staff (Quản trị viên)", "application.properties", "staff@fuminhotel.com", "@1", "Quản lý phòng (CRUD, Xóa mềm), Khách hàng, Đơn đặt & Doanh thu"],
        ["Customer (Khách hàng 1)", "CSDL (Customer table)", "an.nguyen@fuminhotel.com", "@1", "Đặt nhiều phòng Online, Xem lịch sử My Bookings, Đổi Profile/Pass"],
        ["Customer (Khách hàng 2)", "CSDL (Customer table)", "mai.tran@fuminhotel.com", "@1", "Đặt phòng Online, Xem lịch sử đặt phòng, Quản lý Profile"],
        ["Public Guest", "Không yêu cầu", "Không yêu cầu", "Không yêu cầu", "Xem danh sách phòng công khai, giá thuê theo ngày, loại phòng"]
    ]
    add_table_data(doc, headers_acc, rows_acc, [Inches(1.3), Inches(1.5), Inches(1.8), Inches(0.7), Inches(1.5)])

    add_heading_styled(doc, "5.2. Hướng dẫn Khởi chạy và Vận hành Hệ thống", level=2)
    add_p(doc, "1. Cơ sở dữ liệu: Mở SSMS hoặc sqlcmd, thực thi script database tại A3TranHienVinh_SE1910/database/A3TranHienVinh_SE1910.sql để tạo CSDL A3TranHienVinh_SE1910 kèm đầy đủ bảng và dữ liệu mẫu.")
    add_p(doc, "2. Khởi chạy Backend Spring Boot (Port 8080):")
    add_code_block(doc, "cd A3TranHienVinh_SE1910/backend\nmvn clean spring-boot:run")
    add_p(doc, "3. Khởi chạy Frontend ReactJS Vite (Port 5174):")
    add_code_block(doc, "cd A3TranHienVinh_SE1910/frontend\nnpm install\nnpm run dev")
    add_p(doc, "4. Kiểm thử API qua Postman: Import file A3TranHienVinh_SE1910/A3TranHienVinh_SE1910.postman_collection.json (19 requests có kịch bản test tự động) vào Postman để kiểm thử toàn diện.")

    out_file = os.path.join(WORKSPACE, "BaoCao_Assignment03_FUMiniHotel_TranHienVinh_SE1910.docx")
    doc.save(out_file)
    shutil.copy2(out_file, os.path.join(A3_DIR, "BaoCao_Assignment03_FUMiniHotel_TranHienVinh_SE1910.docx"))
    print(f"Assignment 03 docx successfully generated at {out_file}")

if __name__ == "__main__":
    generate_ass2_doc()
    generate_ass3_doc()
    print("\nAll docx reports updated and synchronized successfully!")
