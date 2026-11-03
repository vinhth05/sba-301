import os

C_STYLE_HEADER = """/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
"""

SQL_HEADER = """-- ============================================================================
-- Student Name: Trần Hiển Vinh
-- Student ID: CE190881
-- Class: SE1910
-- Course: SBA301 - Integrate Single Page Application with Spring Boot
-- ============================================================================
"""

PROPERTIES_HEADER = """# ============================================================================
# Student Name: Trần Hiển Vinh
# Student ID: CE190881
# Class: SE1910
# Course: SBA301 - Integrate Single Page Application with Spring Boot
# ============================================================================
"""

XML_HEADER = """<!--
  Student Name: Trần Hiển Vinh
  Student ID: CE190881
  Class: SE1910
  Course: SBA301 - Integrate Single Page Application with Spring Boot
-->
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Avoid duplicate header if already starts with student name
    if "Trần Hiển Vinh" in content[:200] or "Tran Hien Vinh" in content[:200]:
        return False

    ext = os.path.splitext(filepath)[1].lower()
    basename = os.path.basename(filepath).lower()

    new_content = None

    if ext in ('.java', '.js', '.jsx', '.css'):
        new_content = C_STYLE_HEADER + content
    elif ext == '.sql':
        new_content = SQL_HEADER + content
    elif ext == '.properties':
        new_content = PROPERTIES_HEADER + content
    elif ext == '.xml' or basename == 'pom.xml':
        if content.startswith('<?xml'):
            first_line_end = content.find('\n')
            if first_line_end != -1:
                first_line = content[:first_line_end + 1]
                rest = content[first_line_end + 1:]
                new_content = first_line + XML_HEADER + rest
            else:
                new_content = XML_HEADER + content
        else:
            new_content = XML_HEADER + content

    if new_content is not None:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def run():
    folders = ['A2TranHienVinh_SE1910', 'A3TranHienVinh_SE1910']
    exts = ('.java', '.js', '.jsx', '.css', '.sql', '.properties', '.xml')
    total_updated = 0

    for folder in folders:
        folder_updated = 0
        for root, dirs, filenames in os.walk(folder):
            if any(ignored in root for ignored in ['node_modules', 'target', '.git', 'dist', 'build']):
                continue
            for f in filenames:
                ext = os.path.splitext(f)[1].lower()
                if ext in exts or f.lower() == 'pom.xml':
                    path = os.path.join(root, f)
                    if process_file(path):
                        folder_updated += 1
                        total_updated += 1
        print(f"Updated {folder_updated} files in {folder}")

    print(f"Total files updated with student header: {total_updated}")

if __name__ == '__main__':
    run()
