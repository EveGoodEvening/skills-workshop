#!/usr/bin/env python3
"""Export the speaker notes in index.html (<aside> of each slide) to speech.md.

Usage: python3 tools/export_speech.py
The slides are the single source of truth for the script: edit the <aside> in
index.html, then re-run this to refresh speech.md.
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"
OUT = ROOT / "speech.md"

CHAPTERS = {"mp": "第 1 章 · mattpocock/skills", "ps": "第 2 章 · pstack", "pl": "第 3 章 · plannotator", "mix": "第 4 章 · 组合用法"}
CHARS_PER_MIN = 260  # 中文口播的大致语速


def text(fragment: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def main() -> None:
    doc = SRC.read_text(encoding="utf-8")
    slides = re.findall(r"<section class=\"slide[^\"]*\"([^>]*)>(.*?)</section>", doc, flags=re.S)
    lines = ["# Agent Skills 分享 · 演讲稿", ""]
    lines.append("> 由 `tools/export_speech.py` 从 `index.html` 每页的讲稿（`<aside>`）导出。改讲稿请改 `index.html`，再重新运行脚本。")
    lines.append("")
    body, total_chars, last_ch = [], 0, None
    for n, (attrs, inner) in enumerate(slides, 1):
        title = re.search(r'data-title="([^"]*)"', attrs)
        ch = re.search(r'data-ch="([^"]*)"', attrs)
        ch = ch.group(1) if ch else "intro"
        if ch != last_ch and ch in CHAPTERS:
            body += ["---", "", "# " + CHAPTERS[ch], ""]
        last_ch = ch
        aside = re.search(r"<aside>(.*?)</aside>", inner, flags=re.S)
        paras = [text(p) for p in re.findall(r"<p>(.*?)</p>", aside.group(1), flags=re.S)] if aside else []
        chars = sum(len(p) for p in paras)
        total_chars += chars
        body.append("## %d. %s" % (n, title.group(1) if title else "(untitled)"))
        body.append("")
        body.append("*约 %d 字 · %.1f 分钟*" % (chars, chars / CHARS_PER_MIN))
        body.append("")
        for p in paras:
            body += [p, ""]
    lines.append("全稿约 %d 字，按每分钟 %d 字估算，纯念稿约 %d 分钟（不含演示和提问）。" % (total_chars, CHARS_PER_MIN, round(total_chars / CHARS_PER_MIN)))
    lines.append("")
    OUT.write_text("\n".join(lines + body), encoding="utf-8")
    print("wrote %s: %d slides, %d chars, ~%d min" % (OUT.name, len(slides), total_chars, round(total_chars / CHARS_PER_MIN)))


if __name__ == "__main__":
    main()
