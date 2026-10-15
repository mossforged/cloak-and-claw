"""Render a study Markdown file to PDF.
Usage: python3 docs/studies/build_pdf.py docs/studies/<file>.md [out.pdf] [--chromium PATH]
Needs: pip install markdown ; a Chromium/Chrome binary (defaults tried below)."""
import sys, os, subprocess, tempfile, shutil
import markdown

CSS = """
@page { size: A4; margin: 18mm 16mm; }
body { font-family: Georgia, 'Times New Roman', serif; font-size: 10.5pt; line-height: 1.5; color: #222; }
h1 { font-size: 22pt; color: #5a2d1a; border-bottom: 3px solid #c8963e; padding-bottom: 6px; }
h2 { font-size: 15pt; color: #5a2d1a; margin-top: 22px; page-break-after: avoid; }
h3 { font-size: 12pt; color: #7a4a26; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 9.2pt; page-break-inside: avoid; }
th { background: #f1e3c6; text-align: left; }
th, td { border: 1px solid #d8c7a5; padding: 4px 6px; vertical-align: top; }
code { background: #f4efe6; padding: 0 3px; font-size: 9pt; }
hr { border: none; border-top: 1px solid #d8c7a5; margin: 18px 0; }
em { color: #555; }
a { color: #7a4a26; }
"""

def find_chromium(explicit):
    for c in [explicit, "/opt/pw-browsers/chromium",
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
              shutil.which("chromium"), shutil.which("google-chrome"), shutil.which("chrome")]:
        if c and os.path.exists(c):
            return c
    sys.exit("No Chromium/Chrome found; pass --chromium PATH")

def main():
    args = sys.argv[1:]
    chromium = None
    if "--chromium" in args:
        i = args.index("--chromium"); chromium = args[i + 1]; del args[i:i + 2]
    src = args[0]
    out = args[1] if len(args) > 1 else os.path.splitext(src)[0] + ".pdf"
    html = markdown.markdown(open(src, encoding="utf-8").read(), extensions=["tables"])
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(f"<!doctype html><meta charset='utf-8'><style>{CSS}</style><body>{html}</body>")
        tmp = f.name
    subprocess.run([find_chromium(chromium), "--headless", "--no-sandbox", "--disable-gpu",
                    "--no-pdf-header-footer", f"--print-to-pdf={os.path.abspath(out)}", "file://" + tmp],
                   check=True, capture_output=True)
    os.unlink(tmp)
    print(out)

if __name__ == "__main__":
    main()
