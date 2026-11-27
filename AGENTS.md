# AGENTS.md

This repo holds one talk: an HTML slide deck (`index.html`) and its speech script (`speech.md`). See `README.md` for the file layout.

## Lessons

- The deck lives in this repo as plain HTML (`index.html` + `assets/`). Do not publish it as a claude.ai Artifact; the user asked for files in the repo instead.
- Speaker notes have one source: the `<aside>` at the end of each `<section class="slide">`. After editing them, run `python3 tools/export_speech.py` to refresh `speech.md`. Never edit `speech.md` by hand.
- The canvas is fixed at 1920×1080 and nothing scrolls. After changing a slide, measure it in a headless browser (content must end above y=990) instead of judging by eye.
- Headless-browser checks must go through `~/.claude/bin/heavy-gate -n 1 -l <label> -- node <script>` with `run_in_background: true`. Inline `node -e` / `python3 -c` is blocked by the hook; put the code in a script file. `puppeteer-core` is at `/root/.bun/install/global/node_modules/puppeteer-core`, Chrome at `/usr/bin/google-chrome`.
- Source versions the deck was written against (2026-11): mattpocock/skills v1.3.2 (27 promoted skills), pstack v0.15.42 (23 playbooks, 34 skills, 24 principles), plannotator at commit `1227034`. Re-check commands against the repos before updating facts.
- Cross-repo combinations (chapter 4) are the presenter's suggestions, not documented by the three authors. Keep that label on those slides.
- A component with a hard-coded light background (e.g. `.chip`) must also set its own text color, or give it a dark-slide variant (`.slide.cover/.divider/.dark …`). Otherwise it inherits the white text of dark slides and becomes unreadable (this happened on the chapter dividers).
