# Ken Japanese Learning

Japanese self-study materials (JLPT N5 level) and a practice website.

## Practice website

`website/index.html` — a single-file static site for practising Hiragana,
Katakana, Basics, Kotoba, Quiz and Lessons. Open it directly in a browser,
or serve the `website/` folder (e.g. GitHub Pages).

- Tabs: Hiragana, Katakana, Basic, Kotoba, Quiz, Lessons
- Kotoba: 1,445 words (N5 716 + Minna no Nihongo Lessons 1–25, deduplicated),
  filterable by lesson and category, with pagination
- Basics: Numbers, Counters (さい / にん / かい / つ / まい / ほん / ひき /
  さつ / だい / こ / はい), Time & Clock, Days / Months / Dates, Greetings
- Quiz: Kana multiple choice (Level 1–3), Kotoba multiple choice, lesson
  practice quizzes, with a Stop button
- No audio / listening — text practice only. Progress is session-only.

## Vocabulary

`vocabulary/` — CSV + PDF, Japanese + reading + romaji + English + Burmese
(Unicode).

| File | Entries |
| --- | --- |
| `n5-vocab.csv` / `JLPT-N5-Vocabulary.pdf` | 716 (JLPT N5, 30 categories) |
| `minna-1-lessons-01-25-unicode.csv` / `minna-1-lessons-01-25-unicode.pdf` | 1,068 (Minna no Nihongo Shokyu 1, Lessons 1–25) |

CSV columns: `lesson,japanese,reading,romaji,english,myanmar_unicode,myanmar_zawgyi_source`
(N5 file has no `lesson` column).
