# Agent Skills 分享

一次分享的全部材料：幻灯片和演讲稿。内容介绍三个项目，以及它们怎么组合使用。

- [mattpocock/skills](https://github.com/mattpocock/skills)
- [cursor/plugins · pstack](https://github.com/cursor/plugins/tree/main/pstack)
- [backnotprop/plannotator](https://github.com/backnotprop/plannotator)

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 幻灯片。双击用浏览器打开即可，不需要服务器和网络。 |
| `speech.md` | 演讲稿，按页排列，带每页字数和估算时长。 |
| `assets/deck.css` `assets/deck.js` | 幻灯片的样式和翻页引擎。 |
| `tools/export_speech.py` | 从 `index.html` 导出 `speech.md`。 |

## 放映

| 按键 | 作用 |
| --- | --- |
| `→` `空格` | 下一步（先显示本页未出现的内容，再翻页） |
| `←` | 上一步 |
| `↓` `↑` | 跳到下一章、上一章 |
| `N` | 打开或关闭讲稿面板 |
| `O` | 总览，点缩略图跳转 |
| `F` | 全屏 |
| `?` | 帮助 |

地址栏的 `#12` 表示第 12 页，可以直接改数字跳转。打印（Ctrl/Cmd+P）可以导出 PDF，每页一张。

## 修改

每页是 `index.html` 里的一个 `<section class="slide">`，画布固定为 1920×1080。该页的讲稿是它末尾的 `<aside>`。

讲稿只在 `index.html` 里改，改完重新导出：

```bash
python3 tools/export_speech.py
```

## 时长

全稿照念约 109 分钟。压到 45 分钟左右时，建议按这个顺序删：

1. 先删：其它好用的小工具、23 个 playbook、Principles、构建清理验证、Claude Code 下的 pstack 与常见坑、同名与同类对照、配方 4 和 5；两处安装页各用一句话带过。
2. 再删：/wayfinder、过夜跑、设计力度阶梯、plannotator 进阶（只留 `--gate` 一句）。
3. 合并：“事后：reflect / correct / automate-me” 并入“把教训留在仓库里”，“Prototype playbook” 并入“两种 prototype”。两张场景速查不念，留作讲义。

## 内容来源

内容基于三个仓库 2026-11 的源码整理。仓库内部的 skill 顺序都有文档依据。第 4 章里跨仓库的组合是整理者的建议，三位作者没有写过。
