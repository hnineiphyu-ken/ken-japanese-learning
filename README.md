# Ken Japanese Learning

Japanese self-study materials (JLPT N5 level) and an interactive React Single Page Application (SPA).

## Modern React SPA Architecture (Vite + React Router)

Built with **React 18**, **Vite**, and **React Router DOM v6** for zero-reload, lightning-fast client-side routing, high-contrast light design system, and Web Speech API (`ja-JP`) text-to-speech audio pronunciation.

### Routes:
- **`/` (Hiragana)**: 46 basic characters (五十音), Dakuten/Handakuten, Yoon (拗音), and Long Vowels (長音) in collapsible cards with native Japanese audio pronunciation.
- **`/katakana` (Katakana)**: 46 basic characters, Dakuten/Handakuten, Yoon, Special Foreign Katakana (特別なカタカナ), and Long Vowel Dash rules (ー).
- **`/basics` (Basics)**: Numbers (0–100,000,000 with pagination), 11 Core Counters (助数詞), 20 Everyday Greetings with usage notes, Time & Clock, Calendar Dates, and an interactive Basics Quiz.
- **`/kotoba` (Kotoba Vocabulary)**: 1,445 vocabulary entries (JLPT N5 & Minna no Nihongo Lessons 1–25) with live multi-field search, semantic category filtering (30 categories), lesson filtering, and pagination.
- **`/quiz` (Interactive Quiz)**: Practice for Kana, Vocabulary, and Basics with selectable question volume (10/20/30/50), sound pronunciation, live progress track, and performance grading.
- **`/lessons` (Lessons 1–25)**: Chapter-by-chapter vocabulary syllabus for Minna no Nihongo with direct links to study words or launch lesson-specific quizzes.

### Navigation:
- **Desktop**: Fast sticky horizontal scroller navigation bar with active state indicator.
- **Mobile / Tablet (≤ 768px)**: Responsive hamburger dropdown navigation menu with outside-click dismissal.

### Development & Production:
```bash
# Install dependencies
npm install

# Start local Vite development server (http://localhost:3000)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

## Original Monolithic Backup:
- Stored under `backup-original/` directory.

## Vocabulary Data
`vocabulary/` — CSV + PDF, Japanese + reading + romaji + English + Burmese (Unicode).
