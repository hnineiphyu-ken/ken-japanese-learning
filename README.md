# Ken Japanese Learning

Japanese self-study materials (JLPT N5 level) and an interactive multi-page practice web platform.

## Practice Website (Multi-Page Architecture)

Modern, mobile-responsive web application with Dark/Light mode support, Japanese Web Speech API (TTS pronunciation audio), and instant category/lesson filtering.

### Multi-Page Structure:
- **`index.html` (Hiragana)**: Full 46 basic characters, Dakuten/Handakuten, and Yoon with audio pronunciation.
- **`katakana.html` (Katakana)**: 46 basic characters, Dakuten/Handakuten, Yoon, and foreign extended sounds (特殊音).
- **`basics.html` (Basics)**: Numbers (1–10,000), Counters (助数詞), Time & Clock, Days of Week, Months & Dates, and Daily Greetings.
- **`kotoba.html` (Kotoba Vocabulary)**: 1,445 vocabulary entries (JLPT N5 & Minna no Nihongo Lessons 1–25) with search, category filtering, and pagination.
- **`quiz.html` (Interactive Quiz)**: Multiple-choice practice for Kana, Vocabulary, and Basics with progress bar, score calculation, and performance assessment.
- **`lessons.html` (Minna no Nihongo Lessons 1–25)**: Chapter-by-chapter vocabulary breakdown with direct links to take lesson quizzes.

### Shared Assets (`assets/`):
- `assets/css/app.css`: Modern card design system, glassmorphism header, responsive grids, and Dark/Light theme CSS variables.
- `assets/js/common.js`: Theme switcher (`data-theme="dark"`), local storage persistence, and Web Speech API (`ja-JP`) helper.
- `assets/data/`: Modular datasets (`kana-data.js`, `words-data.js`, `topics-data.js`).

## Original Theme Backup:
- Stored under `backup-original/` directory.

## Vocabulary Data
`vocabulary/` — CSV + PDF, Japanese + reading + romaji + English + Burmese (Unicode).
