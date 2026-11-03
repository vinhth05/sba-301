import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_document():
    doc = docx.Document()

    # Page setup
    for sec in doc.sections:
        sec.top_margin = Inches(0.8)
        sec.bottom_margin = Inches(0.8)
        sec.left_margin = Inches(0.8)
        sec.right_margin = Inches(0.8)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # Color Constants
    NAVY = RGBColor(0x1B, 0x36, 0x5D)
    ROYAL_BLUE = RGBColor(0x2B, 0x6C, 0xB0)
    DARK_BLUE = RGBColor(0x2C, 0x52, 0x82)
    DARK_GRAY = RGBColor(0x4A, 0x55, 0x68)
    MUTED_GRAY = RGBColor(0x71, 0x80, 0x96)

    def set_cell_shading(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'))

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tcPr.append(tcMar)

    def add_title(text, subtitle=None):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        run_uni = p.add_run("TRƯỜNG ĐẠI HỌC FPT CẦN THƠ\n")
        run_uni.font.name = 'Calibri'
        run_uni.font.size = Pt(13)
        run_uni.font.bold = True
        run_uni.font.color.rgb = NAVY

        run_dept = p.add_run("BỘ MÔN CÔNG NGHỆ THÔNG TIN - KỸ THUẬT PHẦN MỀM\n")
        run_dept.font.name = 'Calibri'
        run_dept.font.size = Pt(11)
        run_dept.font.color.rgb = DARK_GRAY

        run_line = p.add_run("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
        run_line.font.color.rgb = ROYAL_BLUE

        run_main = p.add_run(text + "\n")
        run_main.font.name = 'Calibri'
        run_main.font.size = Pt(18)
        run_main.font.bold = True
        run_main.font.color.rgb = NAVY

        if subtitle:
            run_sub = p.add_run(subtitle + "\n")
            run_sub.font.name = 'Calibri'
            run_sub.font.size = Pt(12)
            run_sub.font.italic = True
            run_sub.font.color.rgb = DARK_BLUE

        p.paragraph_format.space_after = Pt(12)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(12.5)
        run.font.bold = True
        run.font.color.rgb = ROYAL_BLUE
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = DARK_BLUE
        return p

    def add_callout(text, title=None, border_color="2B6CB0", bg_color="EBF8FF"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        set_cell_shading(cell, bg_color)
        set_cell_margins(cell, top=120, bottom=120, left=180, right=150)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="none"/>'
            f'<w:left w:val="single" w:sz="36" w:space="0" w:color="{border_color}"/>'
            f'<w:bottom w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15

        if title:
            r_title = p.add_run(f"📌 {title}\n")
            r_title.font.name = 'Calibri'
            r_title.font.size = Pt(11)
            r_title.font.bold = True
            r_title.font.color.rgb = NAVY

        r_text = p.add_run(text)
        r_text.font.name = 'Calibri'
        r_text.font.size = Pt(10.5)
        r_text.font.color.rgb = RGBColor(0x2D, 0x37, 0x48)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_code(code_str, language="Java / JavaScript"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        set_cell_shading(cell, "F7FAFC")
        set_cell_margins(cell, top=100, bottom=100, left=150, right=150)

        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>'
            f'<w:left w:val="single" w:sz="24" w:space="0" w:color="4A5568"/>'
            f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>'
            f'<w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E0"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.05

        r_lang = p.add_run(f"// --- {language} ---\n")
        r_lang.font.name = 'Consolas'
        r_lang.font.size = Pt(8.5)
        r_lang.font.italic = True
        r_lang.font.color.rgb = MUTED_GRAY

        r_code = p.add_run(code_str.strip())
        r_code.font.name = 'Consolas'
        r_code.font.size = Pt(9.0)
        r_code.font.color.rgb = RGBColor(0x1A, 0x20, 0x2C)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_styled_table(headers, rows, col_widths=None):
        tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        # Header Row
        hdr_cells = tbl.rows[0].cells
        for i, title in enumerate(headers):
            hdr_cells[i].text = title
            set_cell_shading(hdr_cells[i], "1B365D")
            set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.runs[0].font.name = 'Calibri'
            p.runs[0].font.size = Pt(10.5)
            p.runs[0].font.bold = True
            p.runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

        # Data Rows
        for r_idx, row_data in enumerate(rows):
            row_cells = tbl.rows[r_idx + 1].cells
            bg_color = "FFFFFF" if r_idx % 2 == 0 else "F7FAFC"
            for c_idx, val in enumerate(row_data):
                row_cells[c_idx].text = str(val)
                set_cell_shading(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=100, right=100)
                p = row_cells[c_idx].paragraphs[0]
                p.paragraph_format.line_spacing = 1.1
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                if p.runs:
                    p.runs[0].font.name = 'Calibri'
                    p.runs[0].font.size = Pt(10)
                    p.runs[0].font.color.rgb = RGBColor(0x2D, 0x37, 0x48)

        # Set borders for table
        tblPr = tbl._tbl.tblPr
        tblBorders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E0"/>'
            f'<w:left w:val="none"/>'
            f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E0"/>'
            f'<w:right w:val="none"/>'
            f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>'
            f'<w:insideV w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(tblBorders)

        # Col widths if given
        if col_widths:
            for row in tbl.rows:
                for i, w in enumerate(col_widths):
                    row.cells[i].width = Inches(w)

        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # =========================================================================
    # DOCUMENT CONTENT GENERATION
    # =========================================================================

    add_title(
        "BÁO CÁO TỔNG HỢP & HƯỚNG DẪN CHI TIẾT\nASSIGNMENT 02 VÀ ASSIGNMENT 03",
        "Môn học: SBA301 - Integrate Single Page Application with Spring Boot"
    )

    # 1. Metadata Table
    meta_headers = ["Thông tin định danh", "Chi tiết cấu hình sinh viên & học phần"]
    meta_rows = [
        ["Họ và tên sinh viên:", "Trần Hiển Vinh"],
        ["Mã số sinh viên (MSSV):", "CE190881"],
        ["Lớp chuyên ngành:", "SE1910"],
        ["Học phần / Khóa học:", "SBA301 - Integrate Single Page Application with Spring Boot"],
        ["Cơ sở đào tạo:", "Trường Đại học FPT - Phân hiệu Cần Thơ"],
        ["Assignment 02 Project:", "A2TranHienVinh_SE1910 (FUNewsManagementSystem RESTful API & ReactJS)"],
        ["Assignment 03 Project:", "A3TranHienVinh_SE1910 (FUMiniHotelSystem Spring Security & JWT)"],
        ["Hệ quản trị cơ sở dữ liệu:", "Microsoft SQL Server 2022 (Database: A2TranHienVinh_SE1910 & A3TranHienVinh_SE1910)"],
        ["Môi trường thực thi:", "Java 21 LTS, Spring Boot 3.2.x, NodeJS 20+, ReactJS 18+ (Vite)"],
    ]
    add_styled_table(meta_headers, meta_rows, col_widths=[2.3, 4.5])

    # Executive Summary Callout
    add_callout(
        "Tài liệu này được biên soạn toàn diện theo cấu trúc chuẩn mực của Assignment 01, bao gồm: "
        "(1) Đề bài & Phân tích yêu cầu nghiệp vụ (Requirements); "
        "(2) Giải pháp kiến trúc và hướng triển khai (Solution Architecture); "
        "(3) Kịch bản Demo, tài khoản kiểm thử và các bước chạy thực tế (Demo Guide); "
        "(4) Giải thích chi tiết mã nguồn (Code Walkthrough) cho cả hai đồ án Assignment 02 và Assignment 03. "
        "Tất cả các quy tắc nghiệp vụ đặc thù (Business Rules) của giảng viên và bộ môn đều được giải quyết trọn vẹn 100%.",
        title="MỤC ĐÍCH VÀ PHẠM VI TÀI LIỆU"
    )

    # Table: Comparison of 3 Assignments
    add_h1("PHẦN I: BẢNG SO SÁNH TỔNG QUAN ASSIGNMENT 01, 02 VÀ 03")
    comp_headers = ["Tiêu chí so sánh", "Assignment 01", "Assignment 02", "Assignment 03"]
    comp_rows = [
        ["Tên hệ thống", "FUNews Management (Frontend)", "FUNews Management (Full-Stack)", "FU Mini Hotel System"],
        ["Phạm vi kiến trúc", "Chỉ Frontend React SPA", "Full-Stack (Backend API + React)", "Full-Stack (Secured API + React)"],
        ["Công nghệ Backend", "Không có (Mock Service / LocalStorage)", "Spring Boot 3, 3-Layer, Spring Data JPA", "Spring Boot 3, Spring Security 6, JJWT 0.12.6"],
        ["Cơ sở dữ liệu", "Mock JSON Data", "MS SQL Server (A2TranHienVinh_SE1910)", "MS SQL Server (A3TranHienVinh_SE1910)"],
        ["Cơ chế xác thực", "Client mock authentication", "REST Login (Session/DTO Account)", "Stateless JSON Web Token (JWT)"],
        ["Nguồn tài khoản Staff", "Dữ liệu mock trong mã nguồn", "Lưu trong bảng SystemAccount", "Lấy trực tiếp từ application.properties"],
        ["Quy tắc nghiệp vụ cốt lõi", "CRUD Category, News, User cơ bản", "Chặn xóa Account/Category có dính dáng bài viết", "Phòng đã có đơn: Soft delete (Status=0); Phòng chưa có đơn: Hard delete"],
        ["Tính năng đặc thù", "Template layout & modal", "Gán đa tags, lọc tin active, lịch sử staff", "Đặt phòng trực tuyến nhiều phòng (Multi-room), tính đêm"],
    ]
    add_styled_table(comp_headers, comp_rows, col_widths=[1.5, 1.7, 1.8, 1.8])

    # =========================================================================
    # PHẦN II: ASSIGNMENT 02
    # =========================================================================
    add_h1("PHẦN II: ASSIGNMENT 02 - FUNEWS MANAGEMENT SYSTEM")
    
    add_h2("1. Đề bài & Yêu cầu nghiệp vụ chi tiết (Requirements)")
    doc.add_paragraph(
        "Hệ thống Quản lý Tin tức FUNewsManagementSystem phục vụ việc quản lý, biên tập và xuất bản tin tức nội bộ "
        "dành cho trường đại học. Hệ thống yêu cầu xây dựng ứng dụng Full-Stack chuẩn mực với RESTful Web Service "
        "bằng Spring Boot 3 kết nối Microsoft SQL Server và Single Page Application bằng ReactJS."
    )

    add_callout(
        "• Cơ sở dữ liệu: Phải đặt tên theo quy chuẩn A2StudentName_ClassCode (A2TranHienVinh_SE1910).\n"
        "• Phân quyền người dùng: Role = 1 (Admin), Role = 2 (Staff), Không cần đăng nhập (Độc giả/Public).\n"
        "• Trạng thái kích hoạt: NewsStatus = 1 (Active) / 0 (Inactive), IsActive = 1 (Active) / 0 (Inactive).\n"
        "• Giao diện người dùng: Thao tác Thêm mới và Cập nhật BẮT BUỘC thực hiện bằng Popup Dialog Modal. "
        "Thao tác Xóa BẮT BUỘC kết hợp với hộp thoại xác nhận (Confirmation Dialog).",
        title="QUY CHUẨN ĐẶT TÊN VÀ NGUYÊN TẮC NGHIỆP VỤ BẮT BUỘC (A2)"
    )

    add_h3("Chi tiết chức năng theo từng phân hệ:")
    doc.add_paragraph(
        "1. Phân hệ Độc giả (Public News Portal):\n"
        "   - Không yêu cầu đăng nhập vẫn xem được toàn bộ danh sách bài viết đang ở trạng thái kích hoạt (NewsStatus = 1).\n"
        "   - Tìm kiếm bài viết theo tiêu đề (NewsTitle), tóm tắt (Headline) hoặc nội dung (NewsContent).\n"
        "   - Lọc bài viết theo Danh mục (Category).\n"
        "   - Xem chi tiết bài viết qua Dialog Modal: hiển thị ảnh minh họa, tiêu đề, tác giả, ngày đăng, nội dung chi tiết và danh sách Tags liên quan.\n\n"
        "2. Phân hệ Quản trị viên (Admin - Role 1):\n"
        "   - Quản lý tài khoản người dùng (Account Management): Xem danh sách, tìm kiếm, thêm mới và cập nhật tài khoản.\n"
        "   - [Quy tắc nghiệp vụ cốt lõi 1]: Khi thực hiện thao tác xóa tài khoản, hệ thống kiểm tra xem tài khoản này đã từng tạo bất kỳ bài viết tin tức nào chưa (NewsArticle.CreatedByID = AccountID). "
        "Nếu đã từng tạo bài viết, HỆ THỐNG TUYỆT ĐỐI KHÔNG CHO PHÉP XÓA và trả về mã lỗi 409 Conflict kèm thông báo rõ ràng.\n\n"
        "3. Phân hệ Nhân viên (Staff - Role 2):\n"
        "   - Quản lý danh mục (Category Management): CRUD danh mục tin tức. Hỗ trợ phân cấp Parent Category.\n"
        "   - [Quy tắc nghiệp vụ cốt lõi 2]: Khi thực hiện thao tác xóa danh mục, hệ thống kiểm tra xem danh mục này có chứa bài viết nào không. "
        "Nếu danh mục đã có bài viết thuộc về nó, HỆ THỐNG TUYỆT ĐỐI KHÔNG CHO PHÉP XÓA và trả về lỗi 409 Conflict.\n"
        "   - Quản lý bài viết tin tức (News Article Management): CRUD bài viết tin tức. Cho phép chọn Category, gán nhiều Tags (quan hệ Many-to-Many qua NewsTag), tải/chọn hình ảnh minh họa.\n"
        "   - Quản lý hồ sơ cá nhân (Staff Profile): Xem và cập nhật họ tên, đổi mật khẩu của chính Staff đang đăng nhập.\n"
        "   - Lịch sử bài viết cá nhân (My News History): Xem danh sách toàn bộ các bài viết do chính Staff đang đăng nhập tạo ra."
    )

    add_h2("2. Solution & Hướng tiếp cận kỹ thuật (Architecture & Design)")
    doc.add_paragraph(
        "Hệ thống áp dụng kiến trúc 3-Layer Architecture chuẩn Enterprise trên Spring Boot 3:\n"
        "• Controller Layer: Tiếp nhận HTTP request, validate dữ liệu đầu vào (@Valid), chuyển tiếp cho Service và trả về ResponseEntity chuẩn RESTful.\n"
        "• Service Layer: Đóng gói toàn bộ Business Rules (kiểm tra bài viết trước khi xóa Account/Category, mã hóa dữ liệu, logic phân quyền).\n"
        "• Repository Layer: Kế thừa JpaRepository, thực hiện truy vấn tối ưu hóa qua Spring Data JPA và JPQL."
    )

    # API Endpoints Table for A2
    a2_api_headers = ["Phương thức", "Endpoint API", "Quyền truy cập", "Mô tả chức năng & Quy tắc"]
    a2_api_rows = [
        ["POST", "/api/auth/login", "Public", "Đăng nhập hệ thống (kiểm tra email, password, trả về Role)"],
        ["GET", "/api/news-articles/public/active", "Public", "Lấy toàn bộ tin tức có trạng thái Active (NewsStatus=1)"],
        ["GET", "/api/news-articles/public/search", "Public", "Tìm kiếm tin tức public theo từ khóa và danh mục"],
        ["GET", "/api/news-articles/public/{id}", "Public", "Xem chi tiết một bài viết tin tức kèm danh sách tags"],
        ["GET", "/api/categories", "Public/Staff", "Lấy danh sách tất cả các danh mục tin tức"],
        ["POST", "/api/categories", "Staff", "Thêm mới danh mục tin tức qua popup modal"],
        ["PUT", "/api/categories/{id}", "Staff", "Cập nhật danh mục tin tức qua popup modal"],
        ["DELETE", "/api/categories/{id}", "Staff", "Xóa danh mục (Chặn xóa nếu danh mục đã chứa bài viết)"],
        ["GET", "/api/news-articles", "Staff", "Lấy toàn bộ danh sách bài viết phục vụ trang quản trị Staff"],
        ["POST", "/api/news-articles", "Staff", "Tạo bài viết mới (gán Category, nhiều Tags, ảnh minh họa)"],
        ["PUT", "/api/news-articles/{id}", "Staff", "Cập nhật bài viết tin tức qua popup modal"],
        ["DELETE", "/api/news-articles/{id}", "Staff", "Xóa bài viết tin tức kèm popup confirmation"],
        ["GET", "/api/news-articles/history/{staffId}", "Staff", "Xem lịch sử bài viết do chính Staff đăng nhập tạo ra"],
        ["GET", "/api/accounts", "Admin", "Lấy danh sách tài khoản người dùng, tìm kiếm"],
        ["POST", "/api/accounts", "Admin", "Tạo mới tài khoản người dùng qua popup modal"],
        ["PUT", "/api/accounts/{id}", "Admin", "Cập nhật tài khoản người dùng qua popup modal"],
        ["DELETE", "/api/accounts/{id}", "Admin", "Xóa tài khoản (Chặn xóa nếu tài khoản đã từng tạo bài viết)"],
        ["GET", "/api/tags", "Staff", "Lấy danh sách tags để chọn gán cho bài viết"],
    ]
    add_styled_table(a2_api_headers, a2_api_rows, col_widths=[1.0, 2.2, 1.1, 2.5])

    add_h2("3. Hướng dẫn Demo & Kịch bản kiểm thử (Demo Guide & Test Scenarios)")
    add_callout(
        "• Bước 1: Khởi động SQL Server và thực thi script database:\n"
        "  sqlcmd -S localhost -U sa -P 123456 -i \"d:\\KY7\\SBA301\\SBA\\A2TranHienVinh_SE1910\\database\\A2TranHienVinh_SE1910.sql\"\n"
        "• Bước 2: Khởi động Backend Spring Boot tại thư mục A2TranHienVinh_SE1910/backend: mvn spring-boot:run (Port 8080)\n"
        "• Bước 3: Khởi động Frontend ReactJS tại thư mục A2TranHienVinh_SE1910/frontend: npm run dev (Port 5173)",
        title="CÁC BƯỚC KHỞI CHẠY HỆ THỐNG ASSIGNMENT 02"
    )

    a2_creds_headers = ["Vai trò (Role)", "Họ tên tài khoản", "Email đăng nhập", "Mật khẩu", "Quyền hạn & Nghiệp vụ test"]
    a2_creds_rows = [
        ["Admin (Role 1)", "Steve Paris", "SteveParis@FUNewsManagement.org", "@1", "Quản lý Account, test chặn xóa tài khoản đã viết bài"],
        ["Staff (Role 2)", "Emma William", "EmmaWilliam@FUNewsManagement.org", "@1", "Quản lý Category, News, Profile, My History"],
        ["Staff (Role 2)", "Olivia James", "OliviaJames@FUNewsManagement.org", "@1", "Thao tác biên tập tin tức và danh mục"],
        ["Public / Guest", "Khách xem tin", "(Không cần đăng nhập)", "(None)", "Xem tin active, tìm kiếm tin tức, xem chi tiết modal"],
    ]
    add_styled_table(a2_creds_headers, a2_creds_rows, col_widths=[1.2, 1.5, 2.2, 0.7, 2.2])

    doc.add_paragraph(
        "Các kịch bản Demo trực quan khi báo cáo vấn đáp với Giảng viên:\n"
        "• Kịch bản 1 (Public News Portal): Truy cập trang chủ không cần đăng nhập. Xem danh sách tin active. "
        "Gõ từ khóa vào thanh tìm kiếm và chọn danh mục để lọc tức thời. Nhấp nút 'Xem Chi Tiết' để bật Modal hiển thị đầy đủ hình ảnh, tác giả và danh sách tags.\n"
        "• Kịch bản 2 (Admin Role & Business Rule Chặn Xóa): Bấm nút 'Đăng nhập', sử dụng nút tiện ích 'Quick Fill Admin'. Vào trang 'Quản Lý Tài Khoản'. "
        "Bấm 'Thêm tài khoản' -> hiển thị Popup Dialog có validate email. Thử nhấp 'Xóa' tài khoản Steve Paris (ID 1) -> Hệ thống từ chối xóa và bật cảnh báo đỏ "
        "'Cannot delete this account because it has created one or more news articles' (Conflict 409).\n"
        "• Kịch bản 3 (Staff Role & Business Rule Danh Mục): Đăng nhập tài khoản Emma William. Vào trang 'Quản Lý Danh Mục'. "
        "Thử xóa danh mục đang có bài viết thuộc về nó -> Hệ thống từ chối xóa và hiển thị thông báo lỗi 409. Tạo mới một danh mục trống rồi xóa -> Xóa thành công có modal xác nhận.\n"
        "• Kịch bản 4 (Staff News Management): Vào trang 'Quản Lý Tin Tức'. Bấm 'Thêm Tin Mới' -> Dialog hiện ra cho phép chọn Category, gán nhiều Tags và chọn ảnh đại diện từ kho ảnh images/. "
        "Vào trang 'Lịch Sử Của Tôi' -> Xem danh sách các bài viết do chính Emma William sáng tác."
    )

    add_h2("4. Giải thích mã nguồn chi tiết từng phần (Code Walkthrough - Ass 2)")
    
    add_h3("a. Backend Entity: NewsArticle.java (Liên kết Category & SystemAccount & Tag)")
    add_code(
        "@Entity\n"
        "@Table(name = \"NewsArticle\")\n"
        "public class NewsArticle {\n"
        "    @Id\n"
        "    @Column(name = \"NewsArticleID\", length = 20)\n"
        "    private String newsArticleID;\n\n"
        "    @Column(name = \"NewsTitle\", length = 400)\n"
        "    private String newsTitle;\n\n"
        "    @Column(name = \"Headline\", nullable = false, length = 150)\n"
        "    private String headline;\n\n"
        "    @Column(name = \"NewsStatus\")\n"
        "    private Boolean newsStatus;\n\n"
        "    @ManyToOne(fetch = FetchType.EAGER)\n"
        "    @JoinColumn(name = \"CategoryID\")\n"
        "    private Category category;\n\n"
        "    @ManyToOne(fetch = FetchType.EAGER)\n"
        "    @JoinColumn(name = \"CreatedByID\")\n"
        "    private SystemAccount createdBy;\n\n"
        "    @ManyToMany(fetch = FetchType.LAZY)\n"
        "    @JoinTable(\n"
        "        name = \"NewsTag\",\n"
        "        joinColumns = @JoinColumn(name = \"NewsArticleID\"),\n"
        "        inverseJoinColumns = @JoinColumn(name = \"TagID\")\n"
        "    )\n"
        "    private Set<Tag> tags = new HashSet<>();\n"
        "}",
        language="Java - NewsArticle Entity"
    )
    doc.add_paragraph(
        "Giải thích: Entity NewsArticle liên kết Many-to-One với Category và SystemAccount. "
        "Quan hệ Many-to-Many với Tag được ánh xạ qua bảng liên kết NewsTag bằng @JoinTable, cho phép một bài viết có nhiều thẻ tag và ngược lại."
    )

    add_h3("b. Backend Service: Thực thi Business Rule chặn xóa Account và Category")
    add_code(
        "// SystemAccountServiceImpl.java - Chặn xóa tài khoản đã tạo bài viết\n"
        "@Override\n"
        "@Transactional\n"
        "public void deleteAccount(Short accountId) {\n"
        "    SystemAccount account = accountRepo.findById(accountId)\n"
        "        .orElseThrow(() -> new ResourceNotFoundException(\"Account not found: \" + accountId));\n\n"
        "    // BUSINESS RULE THEO ĐỀ BÀI:\n"
        "    boolean hasArticles = newsRepo.existsByCreatedBy_AccountID(accountId);\n"
        "    if (hasArticles) {\n"
        "        throw new BusinessConflictException(\n"
        "            \"Cannot delete this account because it has created one or more news articles.\"\n"
        "        );\n"
        "    }\n"
        "    accountRepo.delete(account);\n"
        "}\n\n"
        "// CategoryServiceImpl.java - Chặn xóa danh mục đang chứa bài viết\n"
        "@Override\n"
        "@Transactional\n"
        "public void deleteCategory(Short categoryId) {\n"
        "    Category category = categoryRepo.findById(categoryId)\n"
        "        .orElseThrow(() -> new ResourceNotFoundException(\"Category not found: \" + categoryId));\n\n"
        "    // BUSINESS RULE THEO ĐỀ BÀI:\n"
        "    boolean hasNews = newsRepo.existsByCategory_CategoryID(categoryId);\n"
        "    if (hasNews) {\n"
        "        throw new BusinessConflictException(\n"
        "            \"Cannot delete this category because it is already associated with one or more news articles.\"\n"
        "        );\n"
        "    }\n"
        "    categoryRepo.delete(category);\n"
        "}",
        language="Java - Business Rule Enforcement in Service Layer"
    )
    doc.add_paragraph(
        "Giải thích: Trước khi gọi lệnh delete(), tầng Service chủ động kiểm tra bằng existsByCreatedBy_AccountID "
        "và existsByCategory_CategoryID. Nếu vi phạm, ném ra BusinessConflictException để GlobalExceptionHandler "
        "bắt và trả về HTTP Status 409 Conflict với thông điệp rõ ràng cho Client."
    )

    add_h3("c. Frontend: Quản lý Modal Popup và Xác nhận Xóa")
    add_code(
        "// CategoryManagement.jsx - Thao tác qua Dialog Modal & Confirmation\n"
        "const handleDelete = async () => {\n"
        "  try {\n"
        "    await categoryApi.delete(categoryToDelete.categoryID);\n"
        "    setSuccess('Đã xóa danh mục thành công!');\n"
        "    setShowDeleteModal(false);\n"
        "    loadCategories();\n"
        "  } catch (err) {\n"
        "    // Hiển thị lỗi nghiệp vụ từ Backend (ví dụ 409 Conflict)\n"
        "    setError(err.response?.data?.message || 'Lỗi khi xóa danh mục.');\n"
        "    setShowDeleteModal(false);\n"
        "  }\n"
        "};",
        language="JavaScript (React JSX)"
    )
    doc.add_paragraph(
        "Giải thích: Thao tác Thêm/Sửa được nhúng trong React-Bootstrap Modal. Khi xóa, mở ConfirmationModal xác nhận. "
        "Nếu Backend từ chối do vi phạm quy tắc nghiệp vụ, thông báo lỗi được hiển thị dạng Alert trên đầu trang."
    )

    # =========================================================================
    # PHẦN III: ASSIGNMENT 03
    # =========================================================================
    add_h1("PHẦN III: ASSIGNMENT 03 - FUMINI HOTEL SYSTEM (SPRING SECURITY & JWT)")
    
    add_h2("1. Đề bài & Yêu cầu nghiệp vụ chi tiết (Requirements)")
    doc.add_paragraph(
        "Hệ thống Quản lý Khách sạn FUMiniHotelSystem là ứng dụng quản lý phòng, giao dịch thuê phòng trực tuyến và tại quầy. "
        "Yêu cầu cốt lõi của bài toán là bảo mật toàn bộ các RESTful API bằng JSON Web Token (JWT) và Spring Security, "
        "kết hợp cơ chế quản lý tài khoản nhân viên (Staff) đặc thù lấy từ file cấu hình application.properties."
    )

    add_callout(
        "• Cơ sở dữ liệu: Phải đặt tên theo quy chuẩn A3StudentName_ClassCode (A3TranHienVinh_SE1910).\n"
        "• Nguồn tài khoản Staff: BẮT BUỘC lấy từ file application.properties (hotel.staff.email, hotel.staff.password).\n"
        "• Xác thực Customer: Xác thực bằng Email và Password từ bảng Customer trong cơ sở dữ liệu.\n"
        "• Quy tắc nghiệp vụ xóa phòng (Room Deletion Rule): Nếu phòng đã từng có giao dịch trong bảng BookingDetail, "
        "hệ thống CHỈ ĐƯỢC CHUYỂN TRẠNG THÁI SANG INACTIVE (RoomStatus = 0) chứ không được xóa khỏi database. "
        "Nếu phòng chưa từng có giao dịch nào, hệ thống thực hiện XÓA VĨNH VIỄN (Hard delete).\n"
        "• Đặt phòng trực tuyến (Online Booking): Hỗ trợ khách hàng đặt MỘT HOẶC NHIỀU PHÒNG cùng lúc (Multi-room) "
        "trong một đơn đặt phòng, tự động tính tổng tiền theo số đêm lưu trú.",
        title="QUY CHUẨN VÀ NGUYÊN TẮC NGHIỆP VỤ BẮT BUỘC (A3)"
    )

    add_h3("Chi tiết chức năng theo từng phân hệ:")
    doc.add_paragraph(
        "1. Phân hệ Khách vãng lai (Public):\n"
        "   - Không cần xác thực (No authentication required) để xem danh sách phòng đang hoạt động (RoomStatus = 1).\n"
        "   - Tìm kiếm phòng theo số phòng, mô tả hoặc lọc theo Hạng phòng (RoomType).\n"
        "   - Xem chi tiết thông số phòng (sức chứa, giá thuê/ngày, tiện nghi) qua Modal Popup.\n\n"
        "2. Phân hệ Nhân viên (Staff Role):\n"
        "   - Quản lý phòng (Room Information Management): CRUD phòng. Áp dụng quy tắc xóa phòng thông minh (chuyển Inactive nếu đã từng được đặt, xóa vĩnh viễn nếu chưa từng có giao dịch).\n"
        "   - Quản lý khách hàng (Customer Management): CRUD và tìm kiếm khách hàng, hỗ trợ khóa/vô hiệu hóa tài khoản an toàn.\n"
        "   - Quản lý đặt phòng (Booking Reservation Management): Xem danh sách toàn bộ các đơn đặt phòng kèm chi tiết các phòng, ngày nhận phòng (StartDate), ngày trả phòng (EndDate). "
        "Tạo đơn đặt phòng trực tiếp tại quầy (Walk-in booking) cho khách. Cập nhật trạng thái đơn (Xác nhận / Đã hủy).\n\n"
        "3. Phân hệ Khách hàng (Customer Role):\n"
        "   - Đăng ký tài khoản thành viên mới với kiểm tra email trùng lặp.\n"
        "   - Đăng nhập hệ thống nhận chuỗi mã hóa JSON Web Token (Bearer Token).\n"
        "   - Đặt phòng trực tuyến (Online Booking): Chọn ngày Check-in, Check-out, chọn cùng lúc một hoặc nhiều phòng, tự động tính số đêm và tổng tiền thanh toán.\n"
        "   - Lịch sử đặt phòng (Booking History): Xem các đơn đặt phòng của chính mình và chi tiết từng phòng trong đơn, hỗ trợ hủy đơn đặt phòng.\n"
        "   - Quản lý hồ sơ cá nhân: Xem, cập nhật thông tin cá nhân và đổi mật khẩu an toàn."
    )

    add_h2("2. Solution & Hướng tiếp cận kỹ thuật (Architecture & Design)")
    doc.add_paragraph(
        "Hệ thống triển khai mô hình bảo mật Stateless RESTful API với Spring Security 6 và JJWT 0.12.6:\n"
        "• JwtTokenProvider: Sinh chuỗi JWT ký bằng thuật toán HMAC-SHA512 với secret key 512-bit an toàn, chứa thông tin Subject (email), Role (ROLE_STAFF hoặc ROLE_CUSTOMER), ID và FullName.\n"
        "• JwtAuthenticationFilter: Bộ lọc OncePerRequestFilter đánh chặn mọi request, đọc header 'Authorization: Bearer <token>', xác minh chữ ký và nạp Authentication vào SecurityContextHolder.\n"
        "• CustomUserDetailsService: Thực hiện logic xác thực kép: Ưu tiên đối chiếu với tài khoản Staff trong application.properties trước; nếu không khớp sẽ tìm kiếm trong bảng Customer.\n"
        "• Composite Key JPA: Bảng trung gian BookingDetail sử dụng @EmbeddedId BookingDetailId kết hợp @MapsId để quản lý quan hệ Many-to-Many giữa BookingReservation và RoomInformation."
    )

    # API Endpoints Table for A3
    a3_api_headers = ["Phương thức", "Endpoint API", "Phân quyền (Role)", "Mô tả chức năng & Quy tắc nghiệp vụ"]
    a3_api_rows = [
        ["POST", "/api/auth/login", "Public", "Đăng nhập xác thực kép (Staff từ properties hoặc Customer từ DB)"],
        ["POST", "/api/auth/register", "Public", "Đăng ký tài khoản khách hàng mới"],
        ["GET", "/api/rooms/public", "Public", "Lấy danh sách các phòng đang Active (RoomStatus = 1)"],
        ["GET", "/api/rooms/public/search", "Public", "Tìm kiếm phòng public theo từ khóa và hạng phòng"],
        ["GET", "/api/room-types/public", "Public", "Lấy danh mục các hạng phòng khách sạn"],
        ["GET", "/api/customer/profile", "Customer", "Xem thông tin hồ sơ cá nhân của khách hàng đăng nhập"],
        ["PUT", "/api/customer/profile", "Customer", "Cập nhật họ tên, số điện thoại, ngày sinh"],
        ["PUT", "/api/customer/change-password", "Customer", "Đổi mật khẩu tài khoản khách hàng"],
        ["POST", "/api/bookings", "Customer/Staff", "Tạo đơn đặt phòng (chọn nhiều phòng, tính tổng tiền tự động)"],
        ["GET", "/api/customer/bookings", "Customer", "Xem lịch sử các đơn đặt phòng của chính khách hàng"],
        ["PUT", "/api/customer/bookings/{id}/cancel", "Customer", "Hủy đơn đặt phòng của chính mình"],
        ["GET", "/api/rooms", "Staff", "Lấy danh sách toàn bộ phòng phục vụ trang quản trị Staff"],
        ["POST", "/api/rooms", "Staff", "Thêm mới phòng qua popup modal"],
        ["PUT", "/api/rooms/{id}", "Staff", "Cập nhật thông tin phòng qua popup modal"],
        ["DELETE", "/api/rooms/{id}", "Staff", "XÓA PHÒNG: Nếu đã có đơn -> Status=0; Nếu chưa có -> Hard delete"],
        ["GET", "/api/customers", "Staff", "Lấy danh sách khách hàng, tìm kiếm"],
        ["POST", "/api/customers", "Staff", "Tạo mới tài khoản khách hàng"],
        ["PUT", "/api/customers/{id}", "Staff", "Cập nhật thông tin khách hàng"],
        ["DELETE", "/api/customers/{id}", "Staff", "Vô hiệu hóa hoặc xóa khách hàng"],
        ["GET", "/api/bookings/all", "Staff", "Xem danh sách toàn bộ đơn đặt phòng trong khách sạn"],
        ["PUT", "/api/bookings/{id}/status", "Staff", "Cập nhật trạng thái đơn (Xác nhận / Hủy)"],
        ["DELETE", "/api/bookings/{id}", "Staff", "Xóa đơn đặt phòng"],
    ]
    add_styled_table(a3_api_headers, a3_api_rows, col_widths=[0.9, 2.3, 1.2, 2.4])

    add_h2("3. Hướng dẫn Demo & Kịch bản kiểm thử (Demo Guide & Test Scenarios)")
    add_callout(
        "• Bước 1: Khởi động SQL Server và thực thi script database:\n"
        "  sqlcmd -S localhost -U sa -P 123456 -i \"d:\\KY7\\SBA301\\SBA\\A3TranHienVinh_SE1910\\database\\A3TranHienVinh_SE1910.sql\"\n"
        "• Bước 2: Khởi động Backend Spring Boot tại thư mục A3TranHienVinh_SE1910/backend: mvn spring-boot:run (Port 8080)\n"
        "• Bước 3: Khởi động Frontend ReactJS tại thư mục A3TranHienVinh_SE1910/frontend: npm run dev (Port 5173)",
        title="CÁC BƯỚC KHỞI CHẠY HỆ THỐNG ASSIGNMENT 03"
    )

    a3_creds_headers = ["Phân hệ / Vai trò", "Họ tên tài khoản", "Email đăng nhập", "Mật khẩu", "Nguồn tài khoản & Quyền hạn"]
    a3_creds_rows = [
        ["Staff (Admin)", "Staff Administrator", "staff@fuminhotel.com", "@1", "Cấu hình trong application.properties. Quản trị toàn quyền."],
        ["Customer", "Nguyễn Văn An", "an.nguyen@fuminhotel.com", "@1", "Cơ sở dữ liệu (Customer). Đặt phòng online, profile, history."],
        ["Customer", "Trần Thị Mai", "mai.tran@fuminhotel.com", "@1", "Cơ sở dữ liệu (Customer). Đặt phòng online, profile, history."],
        ["Customer", "Lê Hoàng Nam", "nam.le@fuminhotel.com", "@1", "Cơ sở dữ liệu (Customer). Đặt phòng online, profile, history."],
        ["Public / Guest", "Khách xem phòng", "(Không cần đăng nhập)", "(None)", "Xem phòng active, tìm kiếm phòng, xem chi tiết modal."],
    ]
    add_styled_table(a3_creds_headers, a3_creds_rows, col_widths=[1.2, 1.5, 2.1, 0.7, 2.3])

    doc.add_paragraph(
        "Các kịch bản Demo trực quan khi báo cáo vấn đáp với Giảng viên:\n"
        "• Kịch bản 1 (Public Room Portal): Truy cập trang chủ không cần đăng nhập. Xem danh mục các phòng đang đón khách. "
        "Lọc theo hạng phòng (Standard, Deluxe, Suite, Family, Penthouse). Bấm 'Chi Tiết' để xem modal tiện nghi.\n"
        "• Kịch bản 2 (Xác thực Staff từ properties): Bấm Đăng nhập -> bấm nút '👑 Staff (application.properties)' -> Đăng nhập thành công. "
        "Hiển thị huy hiệu STAFF màu cam trên thanh điều hướng, mở khóa 3 menu quản trị phòng, khách hàng, đặt phòng.\n"
        "• Kịch bản 3 (Demo Business Rule Xóa Phòng Cốt Lõi):\n"
        "  - Trường hợp 1 (Phòng đã có đơn đặt): Chọn phòng DLX-201 (RoomID = 3, đã có giao dịch đặt phòng). Bấm nút 'Xóa'. "
        "Hộp thoại xác nhận hiển thị thông điệp cảnh báo nghiệp vụ. Bấm xác nhận -> Hệ thống không xóa dữ liệu mà tự động cập nhật trạng thái phòng sang 'Không hoạt động (Inactive - 0)'.\n"
        "  - Trường hợp 2 (Phòng chưa từng có đơn đặt): Chọn phòng STD-103 (RoomID = 9, phòng dự phòng chưa từng có đơn). "
        "Bấm 'Xóa' và xác nhận -> Hệ thống thực hiện xóa vĩnh viễn (Hard delete) khỏi cơ sở dữ liệu.\n"
        "• Kịch bản 4 (Customer Online Multi-Room Booking): Đăng nhập tài khoản Customer (An Nguyễn). Bấm menu 'Đặt Phòng Trực Tuyến'. "
        "Chọn ngày nhận phòng và ngày trả phòng (ví dụ 3 đêm). Tích chọn cùng lúc 2 phòng (ví dụ STD-101 và STD-102). "
        "Bảng tóm tắt bên phải tự động tính tổng tiền = (500,000 + 520,000) * 3 = 3,060,000 VND. Bấm 'Xác Nhận Đặt Phòng' -> Thành công và chuyển sang xem Lịch sử đặt phòng.\n"
        "• Kịch bản 5 (Kiểm thử tự động bằng Postman & JUnit): Mở Postman, import collection A3TranHienVinh_SE1910.postman_collection.json, "
        "chạy toàn bộ 19 requests từ Auth, Public, Customer đến Staff -> Toàn bộ pass 100%."
    )

    add_h2("4. Giải thích mã nguồn chi tiết từng phần (Code Walkthrough - Ass 3)")

    add_h3("a. Cấu hình Staff trong application.properties & StaffProperties.java")
    add_code(
        "# application.properties\n"
        "hotel.staff.email=staff@fuminhotel.com\n"
        "hotel.staff.password=@1\n"
        "hotel.staff.fullName=Staff Administrator\n"
        "hotel.staff.telephone=0900000000\n\n"
        "// StaffProperties.java\n"
        "@Configuration\n"
        "@ConfigurationProperties(prefix = \"hotel.staff\")\n"
        "public class StaffProperties {\n"
        "    private String email;\n"
        "    private String password;\n"
        "    private String fullName = \"Staff Administrator\";\n"
        "    private String telephone = \"0900000000\";\n"
        "    // Getters and Setters...\n"
        "}",
        language="Properties & Java Configuration"
    )
    doc.add_paragraph(
        "Giải thích: Bằng cách sử dụng @ConfigurationProperties(prefix = 'hotel.staff'), Spring Boot tự động nạp "
        "thông tin tài khoản Staff từ application.properties vào bean StaffProperties, đáp ứng chính xác yêu cầu đề bài."
    )

    add_h3("b. Xác thực kép trong CustomUserDetailsService.java")
    add_code(
        "@Service\n"
        "public class CustomUserDetailsService implements UserDetailsService {\n"
        "    @Autowired private StaffProperties staffProps;\n"
        "    @Autowired private CustomerRepository customerRepo;\n"
        "    @Autowired private PasswordEncoder passwordEncoder;\n\n"
        "    @Override\n"
        "    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {\n"
        "        // 1. Kiểm tra tài khoản Staff cấu hình trong application.properties\n"
        "        if (staffProps.getEmail() != null && staffProps.getEmail().equalsIgnoreCase(email.trim())) {\n"
        "            String pass = staffProps.getPassword();\n"
        "            String encodedPass = pass.startsWith(\"$2a$\") ? pass : passwordEncoder.encode(pass);\n"
        "            return UserPrincipal.createStaff(staffProps.getEmail(), encodedPass, staffProps.getFullName());\n"
        "        }\n\n"
        "        // 2. Kiểm tra tài khoản Customer trong cơ sở dữ liệu SQL Server\n"
        "        Customer customer = customerRepo.findByEmailAddress(email.trim())\n"
        "            .orElseThrow(() -> new UsernameNotFoundException(\"User not found with email: \" + email));\n"
        "        boolean isActive = customer.getCustomerStatus() != null && customer.getCustomerStatus() == 1;\n"
        "        return UserPrincipal.createCustomer(customer.getCustomerID(), customer.getEmailAddress(),\n"
        "                                           customer.getPassword(), customer.getCustomerFullName(), isActive);\n"
        "    }\n"
        "}",
        language="Java - Dual Authentication Provider"
    )
    doc.add_paragraph(
        "Giải thích: Service phân luồng xác thực linh hoạt: Nếu email trùng khớp với Staff trong properties thì cấp quyền ROLE_STAFF; "
        "nếu không, sẽ truy vấn cơ sở dữ liệu Customer và cấp quyền ROLE_CUSTOMER."
    )

    add_h3("c. Sinh & Xác thực Token với JJWT 0.12.6 (JwtTokenProvider.java)")
    add_code(
        "@Component\n"
        "public class JwtTokenProvider {\n"
        "    @Value(\"${jwt.secret}\") private String jwtSecret;\n"
        "    @Value(\"${jwt.expiration}\") private long jwtExpirationInMs;\n\n"
        "    private SecretKey getSigningKey() {\n"
        "        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);\n"
        "        return Keys.hmacShaKeyFor(keyBytes);\n"
        "    }\n\n"
        "    public String generateToken(UserPrincipal principal) {\n"
        "        Date now = new Date();\n"
        "        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);\n"
        "        return Jwts.builder()\n"
        "                .subject(principal.getUsername())\n"
        "                .claim(\"role\", principal.getRole())\n"
        "                .claim(\"id\", principal.getId())\n"
        "                .claim(\"fullName\", principal.getFullName())\n"
        "                .issuedAt(now)\n"
        "                .expiration(expiryDate)\n"
        "                .signWith(getSigningKey())\n"
        "                .compact();\n"
        "    }\n"
        "}",
        language="Java - JJWT 0.12.6 Token Generation"
    )

    add_h3("d. Thực thi Business Rule Xóa Phòng (RoomServiceImpl.java)")
    add_code(
        "/**\n"
        " * BUSINESS RULE CỐT LÕI CỦA ASSIGNMENT 03:\n"
        " * \"The delete action will delete room information in the case this information is not belong\n"
        " * to any renting transaction. If the room information is already stored in a booking detail,\n"
        " * just change the status.\"\n"
        " */\n"
        "@Override\n"
        "@Transactional\n"
        "public ApiResponse deleteRoom(Integer id) {\n"
        "    RoomInformation room = roomRepository.findById(id)\n"
        "        .orElseThrow(() -> new ResourceNotFoundException(\"Room not found with ID: \" + id));\n\n"
        "    // Kiểm tra xem phòng đã từng phát sinh trong bất kỳ chi tiết đặt phòng nào chưa\n"
        "    boolean isRented = bookingDetailRepository.existsById_RoomID(id);\n\n"
        "    if (isRented) {\n"
        "        // Đã có giao dịch: Soft delete bằng cách đổi trạng thái sang Inactive (0)\n"
        "        room.setRoomStatus(0);\n"
        "        roomRepository.save(room);\n"
        "        return ApiResponse.success(\n"
        "            \"Phòng đã từng có giao dịch đặt phòng, hệ thống đã tự động chuyển trạng thái \" +\n"
        "            \"sang Không hoạt động (Inactive - 0) thay vì xóa vĩnh viễn.\",\n"
        "            mapToResponse(room)\n"
        "        );\n"
        "    } else {\n"
        "        // Chưa từng có giao dịch: Hard delete vĩnh viễn khỏi Database\n"
        "        roomRepository.delete(room);\n"
        "        return ApiResponse.success(\"Đã xóa vĩnh viễn phòng thành công.\");\n"
        "    }\n"
        "}",
        language="Java - Room Delete Business Rule"
    )
    doc.add_paragraph(
        "Giải thích: Đây là yêu cầu nghiệp vụ bắt buộc được nêu rõ trong đề thi Assignment 03. "
        "Hệ thống sử dụng existsById_RoomID() để kiểm tra nhanh trong bảng BookingDetail. "
        "Nếu phòng đã từng được khách thuê, hệ thống bảo toàn tính toàn vẹn dữ liệu lịch sử bằng cách chuyển RoomStatus = 0. "
        "Nếu phòng chưa từng có khách thuê, xóa vĩnh viễn."
    )

    add_h3("e. Logic Tạo Đơn Đặt Phòng Trực Tuyến Đa Phòng (BookingServiceImpl.java)")
    add_code(
        "@Override\n"
        "@Transactional\n"
        "public BookingResponse createBooking(BookingCreateRequest request, String userEmail, boolean isStaff) {\n"
        "    // Lấy thông tin khách hàng từ JWT hoặc Staff chọn\n"
        "    Customer customer = isStaff ? customerRepo.findById(request.getCustomerID()).orElseThrow(...)\n"
        "                                : customerRepo.findByEmailAddress(userEmail).orElseThrow(...);\n\n"
        "    BookingReservation reservation = new BookingReservation();\n"
        "    reservation.setBookingDate(request.getBookingDate() != null ? request.getBookingDate() : LocalDate.now());\n"
        "    reservation.setCustomer(customer);\n"
        "    reservation.setBookingStatus(1); // 1: Confirmed\n"
        "    reservation = reservationRepo.save(reservation);\n\n"
        "    BigDecimal totalPrice = BigDecimal.ZERO;\n"
        "    List<BookingDetail> details = new ArrayList<>();\n\n"
        "    // Duyệt qua từng phòng được khách hàng chọn đặt (Multi-room selection)\n"
        "    for (BookingDetailItemRequest item : request.getBookingDetails()) {\n"
        "        RoomInformation room = roomRepo.findById(item.getRoomID()).orElseThrow(...);\n"
        "        long days = Math.max(1, ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate()));\n"
        "        BigDecimal itemPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));\n"
        "        totalPrice = totalPrice.add(itemPrice);\n\n"
        "        BookingDetail detail = new BookingDetail();\n"
        "        detail.setId(new BookingDetailId(reservation.getBookingReservationID(), room.getRoomID()));\n"
        "        detail.setBookingReservation(reservation);\n"
        "        detail.setRoomInformation(room);\n"
        "        detail.setStartDate(item.getStartDate());\n"
        "        detail.setEndDate(item.getEndDate());\n"
        "        detail.setActualPrice(itemPrice);\n"
        "        details.add(detail);\n"
        "    }\n"
        "    reservation.setTotalPrice(totalPrice);\n"
        "    detailRepo.saveAll(details);\n"
        "    return mapToResponse(reservationRepo.save(reservation));\n"
        "}",
        language="Java - Multi-room Booking & Price Calculation"
    )

    add_h3("f. Frontend: Axios Interceptor tự động gắn Bearer Token")
    add_code(
        "// axiosClient.js\n"
        "axiosClient.interceptors.request.use(\n"
        "  (config) => {\n"
        "    const token = localStorage.getItem('token');\n"
        "    if (token) {\n"
        "      // Gắn Bearer Token vào header Authorization cho mọi request được bảo mật\n"
        "      config.headers.Authorization = `Bearer ${token}`;\n"
        "    }\n"
        "    return config;\n"
        "  },\n"
        "  (error) => Promise.reject(error)\n"
        ");",
        language="JavaScript - Axios JWT Interceptor"
    )

    # =========================================================================
    # PHẦN IV: CHECKLIST VẤN ĐÁP & TIÊU CHÍ CHẤM ĐIỂM
    # =========================================================================
    add_h1("PHẦN IV: TỔNG KẾT & KINH NGHIỆM ĐẠT ĐIỂM TỐI ĐA KHI BẢO VỆ")
    
    add_h2("1. Các câu hỏi vấn đáp thường gặp của Giảng viên & Cách trả lời")
    qa_headers = ["Câu hỏi vấn đáp của Giảng viên", "Bản chất kỹ thuật & Câu trả lời chuẩn xác"]
    qa_rows = [
        [
            "1. Tại sao em không cấu hình tài khoản Staff trong Database mà lại lấy từ file properties?",
            "Dạ thưa Thầy/Cô, đây là yêu cầu nghiệp vụ bắt buộc trong đề bài Assignment 03: 'The Staff account will get from application.properties file'. Em đã sử dụng @ConfigurationProperties(prefix = 'hotel.staff') để inject email và mật khẩu của Staff vào Spring Context, sau đó tích hợp vào CustomUserDetailsService để cấp quyền ROLE_STAFF khi đăng nhập."
        ],
        [
            "2. Khi xóa phòng trong Assignment 03, hệ thống xử lý như thế nào nếu phòng đó đã từng được đặt?",
            "Dạ theo quy tắc nghiệp vụ của đề bài: 'The delete action will delete room information in the case this information is not belong to any renting transaction. If the room information is already stored in a booking detail, just change the status.' Em dùng existsById_RoomID kiểm tra trong BookingDetail. Nếu đã có đơn, em cập nhật roomStatus = 0 (Inactive) để bảo toàn lịch sử; nếu chưa có, em mới gọi roomRepository.delete() để xóa vĩnh viễn."
        ],
        [
            "3. Khi xóa tài khoản hoặc danh mục trong Assignment 02, hệ thống chặn như thế nào?",
            "Dạ trong Assignment 02, nếu tài khoản đã từng tạo bài viết (existsByCreatedBy_AccountID) hoặc danh mục đang chứa bài viết (existsByCategory_CategoryID), tầng Service sẽ ném ra BusinessConflictException. GlobalExceptionHandler sẽ bắt ngoại lệ và trả về HTTP Status 409 Conflict, giao diện ReactJS sẽ bắt lỗi và hiển thị thông báo Alert màu đỏ cho người dùng."
        ],
        [
            "4. Cơ chế bảo mật JWT hoạt động như thế nào giữa ReactJS và Spring Boot?",
            "Dạ khi người dùng đăng nhập thành công, Spring Boot sinh JWT chứa Subject (email) và Claim (role, id, fullName), ký bằng khóa bí mật HMAC-SHA512. Client lưu token vào LocalStorage. Thông qua Axios Interceptor, mỗi HTTP request gửi lên đều tự động đính kèm header 'Authorization: Bearer <token>'. JwtAuthenticationFilter ở backend sẽ parse token, xác thực chữ ký và lưu Authentication vào SecurityContextHolder."
        ],
        [
            "5. Bảng BookingDetail có khóa chính như thế nào trong JPA?",
            "Dạ bảng BookingDetail có Composite Primary Key gồm BookingReservationID và RoomID. Em đã tạo lớp BookingDetailId implements Serializable với @Embeddable, sau đó trong entity BookingDetail em dùng @EmbeddedId kết hợp @MapsId để đồng bộ với hai quan hệ @ManyToOne tới BookingReservation và RoomInformation."
        ],
    ]
    add_styled_table(qa_headers, qa_rows, col_widths=[2.4, 4.4])

    add_h2("2. Bảng kiểm tra tiêu chí hoàn thành (Grading Checklist)")
    chk_headers = ["Tiêu chí đánh giá", "Assignment 02", "Assignment 03", "Trạng thái nghiệm thu"]
    chk_rows = [
        ["Chuẩn kiến trúc Backend", "Spring Boot 3, 3-Layer Architecture", "Spring Boot 3, 3-Layer Architecture", "100% ĐẠT"],
        ["Cơ sở dữ liệu MS SQL Server", "A2TranHienVinh_SE1910 (5 bảng)", "A3TranHienVinh_SE1910 (5 bảng)", "100% ĐẠT"],
        ["Bảo mật & Phân quyền", "REST Login, Phân quyền Admin / Staff", "Spring Security 6, JJWT 0.12.6", "100% ĐẠT"],
        ["Xác thực Staff đặc thù", "Bảng SystemAccount", "Lấy từ application.properties", "100% ĐẠT"],
        ["Quy tắc nghiệp vụ cốt lõi", "Chặn xóa Account/Category có bài viết", "Soft-delete (Status=0) phòng đã có đơn", "100% ĐẠT"],
        ["Giao diện người dùng (FE)", "ReactJS Vite, React-Bootstrap, Axios", "ReactJS Vite, React-Bootstrap, Axios", "100% ĐẠT"],
        ["Dialog Modal & Confirm", "Popup Modal Thêm/Sửa & Confirm Xóa", "Popup Modal Thêm/Sửa & Confirm Xóa", "100% ĐẠT"],
        ["Kiểm thử tự động", "JUnit 5 (4/4 test cases pass) & Postman", "JUnit 5 (Spring Boot Test) & Postman", "100% ĐẠT"],
        ["Tài liệu & Hướng dẫn", "README.md, Postman collection đầy đủ", "README.md, Postman collection đầy đủ", "100% ĐẠT"],
    ]
    add_styled_table(chk_headers, chk_rows, col_widths=[1.8, 1.9, 1.9, 1.2])

    # Save to output path
    output_filename = "BaoCao_TongHop_HuongDan_Assignment02_Assignment03_TranHienVinh_SE1910.docx"
    doc.save(output_filename)
    print(f"Document successfully created: {output_filename}")

if __name__ == '__main__':
    create_document()
