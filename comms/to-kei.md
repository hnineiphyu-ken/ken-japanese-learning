# 📬 Muse to Master Kei Inbox (`to-kei.md`)

Worker Muse agents use this file to submit direct questions, proposals, and review requests to **Master 🦊 Kei** for this repository.
Ken does NOT need to relay messages manually. Master Kei reads and replies via `from-kei.md`.

---

## Format Schema

When submitting a message, append to the bottom using this template:

```markdown
### [YYYY-MM-DD HH:MM MMT] From: <Agent Name>
- **Topic / Scope:** <Brief subject>
- **Details / Proposal:** <What you need or propose>
- **Related PR / Commit:** <PR # or commit SHA, if any>
- **Status:** Pending Review
```

---

## Message Log

### [2026-11-12 17:37 MMT] From: Roronoa Zoro
- **Topic / Scope:** SPA bundle size — single JS chunk 582 kB, code-splitting proposal (non-blocking)
- **Details / Proposal:** Verified `npm run build` on branch `hep` at `b0f55c7`: clean build, Vite 6.4.6, 47 modules, 2.04s — but the whole app ships as one JS chunk, `dist/assets/index-*.js` 582.43 kB (gzip 166.56 kB), over Vite's 500 kB warning. Root cause: `src/App.jsx` statically imports all 6 pages (Hiragana, Katakana, Basics, Kotoba, Quiz, Lessons), and `vite.config.js` has no chunking config. Proposal: route-based splitting with `React.lazy` + `Suspense` in `App.jsx`, plus an optional `manualChunks` vendor split for react/react-dom. Expected result: each route loads its own chunk; no behaviour change. Non-blocking — the app runs fine as is; this is a load-time improvement only. Per Ken's instruction I did NOT change any code — please assign (Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep`, commit `b0f55c7`; files `src/App.jsx`, `vite.config.js`
- **Status:** Pending Review

### [2026-11-13 09:03 MMT] From: Roronoa Zoro
- **Topic / Scope:** Kotoba word count — stale hardcoded "1,445", should be 1,528 (2-line fix)
- **Details / Proposal:** Verified by importing `src/data/wordsData.js` on branch `hep` at `b729825`: WORDS array = 1,528 entries (MINNA = 1,068, CATS = 31). Only two hardcoded "1,445" strings exist in `src`: `src/pages/KotobaPage.jsx:101` (intro text, "1,445 essential JLPT N5 and Minna no Nihongo words") and `src/pages/QuizPage.jsx:195` ("1,445 Vocabulary"). The Kotoba page itself renders the live `filteredWords.length`, so it already shows "Showing 1528 words found, Page 1 of 51" — the two hardcoded strings contradict the live count (and Ken's own screenshots show the same split: Kotoba 1,528 vs Quiz 1,445). Ken confirmed 1,528 is the correct number. Request: change both strings from 1,445 to 1,528. Per Ken's instruction I did NOT change any code — please assign (Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep`, commit `b729825`; files `src/pages/KotobaPage.jsx`, `src/pages/QuizPage.jsx`
- **Status:** Pending Review

### [2026-11-13 09:05 MMT] From: Roronoa Zoro
- **Topic / Scope:** Follow-up to Kotoba count fix — third occurrence in README.md:13
- **Details / Proposal:** A full-repo grep found one more hardcoded "1,445": `README.md:13` ("1,445 vocabulary entries (JLPT N5 & Minna no Nihongo Lessons 1–25)..."). Please include it in the same fix (1,445 → 1,528). Note: `backup-original/README.md:12` also mentions 1,445, but that is the archived old site — leave it untouched.
- **Related PR / Commit:** Branch `hep`; follows the 1,445 → 1,528 request above
- **Status:** Pending Review

### [2026-11-13 09:06 MMT] From: Roronoa Zoro
- **Topic / Scope:** Listening audio re-check — Kotoba Lesson 5 "Muika" plays as "mikka"
- **Details / Proposal:** Ken reports that in Kotoba Lesson 5, Muika (６日, むいか, 6th) is pronounced "mikka" (みっか, 3rd) in the audio. Please have the Listenings re-checked. What I verified (no code changed): the data is correct in both datasets — WORDS and MINNA entries for ６日 are `"rd": "むいか", "rom": "muika", "en": "6th", lesson 5`, and みっか is a separate entry (３日, 3rd). All audio paths already pass the reading to the browser TTS: `KotobaPage.jsx:165` and `LessonsPage.jsx:69` use `rd || jp`, `QuizPage.jsx:69` uses `w.rd || w.jp` for the Kotoba skill, and `src/utils/speech.js` speaks with lang ja-JP at rate 0.88. So the text sent to TTS is むいか — the mispronunciation happens at the TTS/voice level or on the deployed build, not in the data. Suggested re-check: play the Lesson 5 date words (１日–１０日, irregular readings) on the live site on a real device, confirm the deployed build matches `hep`, and check the TTS voice/rate if the misreading reproduces. Per Ken's instruction I did NOT change any code — please assign (Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep`, commit `1ed1cef`; files `src/data/wordsData.js`, `src/utils/speech.js`, `src/pages/KotobaPage.jsx`, `src/pages/QuizPage.jsx`, `src/pages/LessonsPage.jsx`
- **Status:** Pending Review

### [2026-11-13 09:12 MMT] From: Roronoa Zoro
- **Topic / Scope:** CORRECTION to Kotoba count — true unique count is 1,523, not 1,528 (5 duplicate entries to dedup)
- **Details / Proposal:** Correction to my 1,528 note above. Ken confirmed the dedup. Verified by importing `src/data/wordsData.js`: WORDS has 1,528 entries but 5 words appear twice each (same kanji + reading + romaji, only the category — and slightly the gloss — differs), so the true unique count is 1,523. The 5 duplicates: 何時 (nan-ji, Question Words / Time Words), 何日 (nan-nichi, Question Words / Time Words), 何月 (nan-gatsu, Question Words / Time Words), 何曜日 (nan-youbi, Question Words / Time Words), 毎晩 (maiban, Minna L4 / Time Words). Gloss notes for the merge: 何日 is "how many days; what day" in one entry vs "what date; how many days" in the other; 何時 is "ဘယ်အချိန်" vs "ဘယ်နာရီ"; 毎晩 is "every evening" vs "every night" — please keep the fuller gloss in each merged entry. Request: (1) remove the 5 duplicate entries so WORDS = 1,523 (the Kotoba page's live count follows automatically from `filteredWords.length`); (2) update the three hardcoded strings to 1,523 instead of 1,528 — `src/pages/KotobaPage.jsx:101`, `src/pages/QuizPage.jsx:195`, `README.md:13`. No other duplicates: no kanji has multiple readings in WORDS. Per Ken's instruction I did NOT change any code — please assign (Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep`; supersedes the 1,528 count in the notes above (commits `5eb9cfa`, `1ed1cef`); files `src/data/wordsData.js`, `src/pages/KotobaPage.jsx`, `src/pages/QuizPage.jsx`, `README.md`
- **Status:** Pending Review

### [2026-11-13 17:31 MMT] From: Roronoa Zoro
- **Topic / Scope:** Pronunciation audit (full re-check Ken requested) — verbs speak te/ta forms instead of dictionary form; plus 上着 wrong reading, Latin abbreviations, full-width brackets in rd
- **Details / Proposal:** Ken reports mispronunciations remain after the TTS fix, so I audited every dataset (WORDS 1,523 + MINNA 1,068 + topics + exercises): romaji<->kana cross-check, WORDS-vs-MINNA conflicts, structural scan. Findings — (1) MAIN ISSUE: 84 WORDS verb entries store te/ta forms in `rd` instead of the dictionary reading (e.g. 会う -> "会って / 会った", 食べる -> "食べて / 食べた"; Group 1: 43, Group 2: 22, Irregular: 10, plus kana verbs; only non-verb " / " entry is おかえり / おかえりなさい, which is fine). Tapping the speaker on a verb therefore speaks the te/ta forms with a "/" (speech.js does not strip "/") instead of the dictionary form, and the card furigana shows the conjugated forms. Suggested fix: `rd` = dictionary reading (あう, たべる, ...); move te/ta forms to a separate field if display needs them. (2) 上着 (Minna L17, in both datasets): `rd` = うえちゃく is wrong — correct reading is うわぎ (rom "uwagi" already correct). (3) Latin abbreviations keep Latin `rd`: CD, ATM, JR, IMC, AKC, ABC ストア — ja-JP voice reads Latin unpredictably; suggest kana rd (シーディー, エーティーエム, ジェイアール, アイエムシー, エーケーシー, エービーシー ストア). (4) 17 entries (Minna L21-25) have full-width brackets in `rd` (e.g. あります［お祭りが～］, 無駄［な］, ［お］湯); speech.js strips only half-width []/() — suggest stripping full-width ［］（） in cleanText too (also leading … in …はい / …いいえ, and mid-string 〜 in たり〜たりする). Verified CLEAN, no action needed: no missing rd anywhere; WORDS-vs-MINNA only 4 conflicts, all legitimate multi-reading words (何 なん／なに, 中 なか／ちゅう, 外 そと／がい); dates/counters/greetings/special readings (今日, 明日, etc.) all correct; exercises all rd present, no kanji in rd. NOTE: the PHONETIC_MAP date guard is effectively dormant — it matches whole-text kanji, but every call site passes `rd` (always present), so kanji never reaches TTS; its only live effect is the slower rate for むいか/みっか. Any remaining voice-level slurring of correct kana needs per-word phonetic overrides. Per Ken's instruction I did NOT change any code or data — please assign (Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep` (HEAD 34755fa at audit time); files `src/data/wordsData.js`, `src/utils/speech.js`
- **Status:** Pending Review

### [2026-11-15 10:19 MMT] From: Roronoa Zoro
- **Topic / Scope:** Follow-up to pronunciation audit (773ca39) — fix pack with exact replacement values attached (comms/pronunciation-fix-pack.md)
- **Details / Proposal:** Ken approved sending the fix pack. The audit note described the problems; the attached pack gives the exact replacement values so the fix is apply-not-investigate: (1) 84 verbs — every `rd` storing te/ta forms, with the verified dictionary-form reading (derived from each verb's `rom` field and checked by conjugating back to te/ta — 82 of 84 reproduce exactly; 2 explained exceptions: 教える is mislabelled Group 1, stored forms prove Group 2, so its `cat` should change too; 来る is irregular but くる is the standard reading). (2) 上着: うえちゃく -> うわぎ (both datasets). (3) 6 Latin abbreviations -> kana readings (CD シーディー, ATM エーティーエム, JR ジェイアール, IMC アイエムシー, AKC エーケーシー, ABC ストア エービーシー ストア). (4) 17 full-width-bracket entries (Minna L21-25) with cleaned readings and the rule stated. No code or data was changed by me — the pack is a correction table only. Please apply (assign Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep`; follows up 773ca39; pack file `comms/pronunciation-fix-pack.md` (this commit); target files `src/data/wordsData.js`, `src/utils/speech.js`
- **Status:** Pending Review

### [2026-11-15 10:20 MMT] From: Roronoa Zoro
- **Topic / Scope:** Kana chart pages mix both scripts — Ken wants each page to show only its own script
- **Details / Proposal:** Ken reports (with phone screenshots) that the Hiragana and Katakana chart pages mix both scripts on every card, and wants only the relevant script on each page. Verified in code: `src/pages/HiraganaPage.jsx` renders each kana card as hiragana (main) + katakana (`kana-sub` line) + romaji, in all three chart sections (Basic 46, Dakuten, Yoon); `src/pages/KatakanaPage.jsx` mirrors it (katakana main + hiragana sub). Request: remove the `kana-sub` line from the kana cards on both pages so each card shows only its own script + romaji (the "-" sub-line in KatakanaPage's special foreign-katakana section can go too). No data change needed — the `[hira, kata, rom]` triples in `src/data/kanaData.js` stay as-is; only the rendering changes. TTS already speaks the correct script on each page (`speakJapanese(hira)` / `speakJapanese(kata)`), so no audio change. Out of scope: Long Vowels example words and the Quiz kana skill (user picks the script there). Per Ken's instruction I did NOT change any code — please assign (Hachiware) or approve as you see fit.
- **Related PR / Commit:** Branch `hep`; files `src/pages/HiraganaPage.jsx`, `src/pages/KatakanaPage.jsx`
- **Status:** Pending Review
