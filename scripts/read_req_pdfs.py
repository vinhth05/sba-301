import pypdf
import glob
import os

out_dir = r"d:\KY7\SBA301\SBA\scripts"

for p in glob.glob(r"d:\KY7\SBA301\SBA\*\Assignment 02*.pdf"):
    reader = pypdf.PdfReader(p)
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"\n--- PAGE {i+1} ---\n" + (page.extract_text() or "")
    with open(os.path.join(out_dir, "ass2_req.txt"), "w", encoding="utf-8") as f:
        f.write(text)
    print("Extracted Ass 2, length:", len(text))

for p in glob.glob(r"d:\KY7\SBA301\SBA\*\Assignment 03*.pdf"):
    reader = pypdf.PdfReader(p)
    text = ""
    for i, page in enumerate(reader.pages):
        text += f"\n--- PAGE {i+1} ---\n" + (page.extract_text() or "")
    with open(os.path.join(out_dir, "ass3_req.txt"), "w", encoding="utf-8") as f:
        f.write(text)
    print("Extracted Ass 3, length:", len(text))

# Also inspect structure of Assignment 1 docx if exists
import docx
ass1_docs = glob.glob(r"d:\KY7\SBA301\SBA\*\BaoCao_GiaoDien*.docx")
if ass1_docs:
    doc = docx.Document(ass1_docs[0])
    text = f"=== {ass1_docs[0]} ===\n"
    for p in doc.paragraphs:
        if p.text.strip():
            text += f"{p.style.name}: {p.text}\n"
    with open(os.path.join(out_dir, "ass1_doc_structure.txt"), "w", encoding="utf-8") as f:
        f.write(text)
    print("Extracted Ass 1 doc structure, length:", len(text))
