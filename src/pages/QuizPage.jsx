import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KANA_ROWS, DAKUTEN } from '../data/kanaData';
import { WORDS, MINNA } from '../data/wordsData';
import { WORDS_N4, MINNA_N4 } from '../data/wordsDataN4';
import { BASIC_COUNT, COUNTERS, GREETINGS } from '../data/topicsData';
import { speakJapanese, shuffle } from '../utils/speech';
import { useActiveLevel } from '../utils/useActiveLevel';
import RubyText from '../utils/RubyText';

export default function QuizPage({ level: propLevel }) {
  const { isN4: hookIsN4 } = useActiveLevel();
  const isN4 = propLevel ? propLevel.toLowerCase() === 'n4' : hookIsN4;

  const [searchParams] = useSearchParams();
  const queryType = searchParams.get('type') || (isN4 ? 'kotoba' : 'kana');
  const queryLesson = searchParams.get('lesson') || '';

  const lessonStart = isN4 ? 26 : 1;
  const lessonEnd = isN4 ? 50 : 25;

  // Settings
  const [quizType, setQuizType] = useState(isN4 ? 'kotoba' : queryType);
  const [kotobaDirection, setKotobaDirection] = useState('jp-mm'); // 'jp-mm' | 'mm-jp' | 'mixed'
  const [scriptType, setScriptType] = useState('hiragana');
  const [questionCount, setQuestionCount] = useState(20);

  // Flexible Lesson Scope: 'all' | 'single' | 'range'
  const [lessonScopeMode, setLessonScopeMode] = useState(queryLesson ? 'single' : 'all');
  const [selectedLesson, setSelectedLesson] = useState(queryLesson || String(lessonStart));
  const [rangeFrom, setRangeFrom] = useState(lessonStart);
  const [rangeTo, setRangeTo] = useState(Math.min(lessonStart + 4, lessonEnd));

  // Quiz running state
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);

  // When level changes (N5 <-> N4), end any running quiz and reset to setup settings
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setQuizState('setup');
    setQuestions([]);
    setCurIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOpt(null);

    const start = isN4 ? 26 : 1;
    const end = isN4 ? 50 : 25;
    setRangeFrom(start);
    setRangeTo(Math.min(start + 4, end));

    const qL = searchParams.get('lesson');
    const num = qL && !isNaN(Number(qL)) ? Number(qL) : null;
    if (num && num >= start && num <= end) {
      setLessonScopeMode('single');
      setSelectedLesson(String(num));
    } else {
      setLessonScopeMode('all');
      setSelectedLesson(String(start));
    }

    if (isN4) {
      const qType = searchParams.get('type');
      const validN4Types = ['kotoba', 'grammar', 'conjunction'];
      setQuizType(validN4Types.includes(qType) ? qType : 'kotoba');
    } else {
      const qType = searchParams.get('type');
      setQuizType(qType || 'kana');
    }
  }, [isN4]);

  useEffect(() => {
    if (queryLesson) {
      const num = Number(queryLesson);
      if (!isNaN(num) && num >= lessonStart && num <= lessonEnd) {
        setQuizType('kotoba');
        setLessonScopeMode('single');
        setSelectedLesson(String(num));
      }
    }
  }, [queryLesson, lessonStart, lessonEnd]);

  function handleRangeFromChange(val) {
    const num = Number(val);
    setRangeFrom(num);
    if (num > rangeTo) setRangeTo(num);
  }

  function handleRangeToChange(val) {
    const num = Number(val);
    setRangeTo(num);
    if (num < rangeFrom) setRangeFrom(num);
  }

  function matchesLessonScope(lessonNumber) {
    if (lessonScopeMode === 'all') return true;
    if (lessonScopeMode === 'single') return Number(lessonNumber) === Number(selectedLesson);
    if (lessonScopeMode === 'range') {
      const n = Number(lessonNumber);
      return n >= rangeFrom && n <= rangeTo;
    }
    return true;
  }

  function shouldAutoSpeak(q) {
    return Boolean(q && q.speakText && q.type !== 'conjunction' && q.type !== 'grammar');
  }

  async function generateQuiz() {
    setLoadingQuiz(true);
    let quizList = [];

    try {
      if (quizType === 'kana') {
        const basicList = [];
        KANA_ROWS.forEach(r => {
          r.items.forEach(it => {
            if (it) basicList.push({ hira: it[0], kata: it[1], rom: it[2] });
          });
        });
        DAKUTEN.forEach(it => {
          basicList.push({ hira: it[0], kata: it[1], rom: it[2] });
        });

        const pool = basicList.map(item => {
          const char = scriptType === 'katakana' ? item.kata : item.hira;
          return {
            prompt: char,
            sub: scriptType === 'katakana' ? 'Katakana' : 'Hiragana',
            speakText: char,
            correctAnswer: item.rom,
            allPool: basicList.map(b => b.rom)
          };
        });

        const shuffled = shuffle(pool);
        const count = Math.min(questionCount, shuffled.length);
        for (let i = 0; i < count; i++) {
          const target = shuffled[i];
          const wrongList = shuffle(target.allPool.filter(a => a !== target.correctAnswer)).slice(0, 3);
          quizList.push({
            type: 'kana',
            prompt: target.prompt,
            sub: target.sub,
            speakText: target.speakText,
            options: shuffle([
              { text: target.correctAnswer, isCorrect: true },
              ...wrongList.map(w => ({ text: w, isCorrect: false }))
            ])
          });
        }
      } else if (quizType === 'kotoba') {
        const activeMinna = isN4 ? MINNA_N4 : MINNA;
        const activeWords = isN4 ? WORDS_N4 : WORDS;
        let wordSubset = lessonScopeMode === 'all'
          ? activeWords
          : activeMinna.filter(w => matchesLessonScope(w.l));

        if (wordSubset.length < 4) {
          wordSubset = activeMinna;
        }

        const meaningDistractorPool = [...new Set(activeMinna.map(item => `${item.en} · ${item.my}`))];
        const jpItemMap = new Map();
        activeMinna.forEach(item => {
          if (item.jp && !jpItemMap.has(item.jp)) jpItemMap.set(item.jp, item.rd || '');
        });
        const jpDistractorPool = Array.from(jpItemMap.entries()).map(([jp, rd]) => ({ jp, rd }));
        const shuffled = shuffle(wordSubset);
        const count = Math.min(questionCount, shuffled.length);

        for (let i = 0; i < count; i++) {
          const w = shuffled[i];
          const dir = kotobaDirection === 'mixed'
            ? (Math.random() < 0.5 ? 'jp-mm' : 'mm-jp')
            : kotobaDirection;

          const meaningText = [w.en, w.my].filter(Boolean).join(' · ');

          if (dir === 'mm-jp') {
            const wrongList = shuffle(jpDistractorPool.filter(item => item.jp !== w.jp)).slice(0, 3);
            const readingPart = w.rd && w.rd !== w.jp ? ` (${w.rd})` : '';
            const romPart = w.rom ? ` · ${w.rom}` : '';
            quizList.push({
              type: 'kotoba',
              direction: 'mm-jp',
              isMeaningPrompt: true,
              lessonBadge: w.l ? `Lesson ${w.l}` : null,
              cue: 'Choose the matching Japanese word (ဂျပန်စကားလုံး ရွေးပါ):',
              prompt: meaningText,
              sub: '',
              speakText: '',
              note: `${w.jp}${readingPart}${romPart}`,
              options: shuffle([
                { text: w.jp, rd: w.rd || '', isCorrect: true },
                ...wrongList.map(item => ({ text: item.jp, rd: item.rd, isCorrect: false }))
              ])
            });
          } else {
            const wrongList = shuffle(meaningDistractorPool.filter(a => a !== meaningText)).slice(0, 3);
            quizList.push({
              type: 'kotoba',
              direction: 'jp-mm',
              lessonBadge: w.l ? `Lesson ${w.l}` : null,
              prompt: w.jp,
              promptRd: w.rd || '',
              sub: `${w.rd || ''} ${w.rom ? '(' + w.rom + ')' : ''}`.trim(),
              speakText: w.rd || w.jp,
              options: shuffle([
                { text: meaningText, isCorrect: true },
                ...wrongList.map(text => ({ text, isCorrect: false }))
              ])
            });
          }
        }
      } else if (quizType === 'grammar' || quizType === 'conjunction') {
        const isGrammar = quizType === 'grammar';
        const mod = isGrammar
          ? await import('../data/grammarQuizData.js')
          : await import('../data/conjunctionData.js');
        const allItems = isGrammar
          ? (isN4 ? mod.GRAMMAR_QUESTIONS_N4 : mod.GRAMMAR_QUESTIONS_N5)
          : (isN4 ? mod.CONJUNCTION_QUESTIONS_N4 : mod.CONJUNCTION_QUESTIONS_N5);

        const cueText = isGrammar
          ? 'Choose the right grammar form (မှန်ကန်သော သဒ္ဒါပုံစံ ရွေးပါ):'
          : 'Choose the right particle / conjunction (စကားဆက် ရွေးပါ):';

        const filtered = allItems.filter(q => matchesLessonScope(q.l));
        const shuffled = shuffle(filtered);
        const count = Math.min(questionCount, shuffled.length);

        for (let i = 0; i < count; i++) {
          const item = shuffled[i];
          quizList.push({
            type: quizType,
            lessonBadge: `Lesson ${item.l}`,
            cue: cueText,
            prompt: item.jp,
            sub: item.my,
            speakText: item.fullJp,
            note: item.note,
            options: shuffle(
              item.options.map(optText => ({
                text: optText,
                isCorrect: optText === item.answer
              }))
            )
          });
        }
      } else {
        // Basics pool (N5)
        const basicsList = [
          ...BASIC_COUNT.map(r => ({ prompt: r[1], sub: r[2], speakText: r[1], ans: `${r[3]} · ${r[4]}` })),
          ...COUNTERS.flatMap(c => c.rows.map(r => ({ prompt: r[1], sub: `${r[2]} (${c.name || c.en})`, speakText: r[1], ans: `${r[3]} · ${r[4]}` }))),
          ...GREETINGS.map(g => ({ prompt: g.jp, sub: g.rom, speakText: g.jp, ans: `${g.en} · ${g.my}` }))
        ];

        const allAns = basicsList.map(item => item.ans);
        const shuffled = shuffle(basicsList);
        const count = Math.min(questionCount, shuffled.length);

        for (let i = 0; i < count; i++) {
          const target = shuffled[i];
          const wrongList = shuffle(allAns.filter(a => a !== target.ans)).slice(0, 3);
          quizList.push({
            type: 'basics',
            prompt: target.prompt,
            sub: target.sub,
            speakText: target.speakText,
            options: shuffle([
              { text: target.ans, isCorrect: true },
              ...wrongList.map(text => ({ text, isCorrect: false }))
            ])
          });
        }
      }
    } finally {
      setLoadingQuiz(false);
    }

    if (quizList.length === 0) return;

    setQuestions(quizList);
    setCurIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOpt(null);
    setQuizState('playing');

    if (shouldAutoSpeak(quizList[0])) {
      speakJapanese(quizList[0].speakText);
    }
  }

  function handleSelect(opt, idx) {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(idx);
    if (opt.isCorrect) {
      setScore(s => s + 1);
    }
    if (currentQ?.speakText && (currentQ.type === 'conjunction' || currentQ.type === 'grammar')) {
      speakJapanese(currentQ.speakText);
    }
  }

  function handleNext() {
    if (curIndex + 1 < questions.length) {
      const nextIdx = curIndex + 1;
      setCurIndex(nextIdx);
      setAnswered(false);
      setSelectedOpt(null);
      if (shouldAutoSpeak(questions[nextIdx])) {
        speakJapanese(questions[nextIdx].speakText);
      }
    } else {
      setQuizState('result');
    }
  }

  function renderQuizPrompt(q) {
    if (!q) return null;
    if ((q.type === 'conjunction' || q.type === 'grammar') && q.prompt.includes('（　　）')) {
      const parts = q.prompt.split('（　　）');
      const correctText = q.options.find(o => o.isCorrect)?.text || '　　';
      return (
        <span className="ruby-text">
          <RubyText text={parts[0]} />
          <span className={`quiz-blank-slot ${answered ? 'filled' : ''}`}>
            {answered ? <RubyText text={correctText} /> : '　　'}
          </span>
          <RubyText text={parts.slice(1).join('（　　）')} />
        </span>
      );
    }
    return <RubyText text={q.prompt} reading={q.promptRd} className="ruby-text" />;
  }

  const currentQ = questions[curIndex];
  const supportsLessonScope = ['kotoba', 'grammar', 'conjunction'].includes(quizType);
  const lessonNumbers = Array.from({ length: 25 }, (_, i) => i + lessonStart);

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">{isN4 ? 'JLPT N4 Practice · 初級 II' : 'JLPT N5 Practice · 初級 I'}</div>
        <h1 className="hero-title">Interactive Quiz (練習問題) — {isN4 ? 'JLPT N4' : 'JLPT N5'}</h1>
        <p className="hero-desc">
          {isN4
            ? 'Practice JLPT N4 Kotoba, Grammar patterns, and Particles & Conjunctions (စကားဆက်) across Lessons 26–50 with authentic Furigana and audio.'
            : 'Practice JLPT N5 Kana, Kotoba, Grammar patterns, Particles & Conjunctions (စကားဆက်), and Basics across Lessons 1–25 with authentic Furigana and audio.'}
        </p>
      </div>

      {/* SETUP CARD */}
      {quizState === 'setup' && (
        <section className="card">
          <div className="quiz-card-head" style={{ borderBottom: '2px solid var(--line-soft)', paddingBottom: '16px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 4px', color: 'var(--ink)' }}>
              Customize Your Quiz
            </h3>
            <span style={{ fontSize: '13.5px', color: 'var(--muted)', fontWeight: 600 }}>
              Select target skill, lesson scope (All / Single / From–To Range), and question count
            </span>
          </div>

          {/* 1. QUIZ TYPE */}
          <div className="quiz-select-group">
            <label className="form-label">
              1. Select Target Skill (問題の種類)
            </label>
            <div className="quiz-type-grid">
              {!isN4 && (
                <button
                  type="button"
                  className={`quiz-type-card ${quizType === 'kana' ? 'active' : ''}`}
                  onClick={() => setQuizType('kana')}
                >
                  <div className="quiz-type-icon jp">あ</div>
                  <div>
                    <div className="quiz-type-title">Kana</div>
                    <div className="quiz-type-desc">Hiragana &amp; Katakana</div>
                  </div>
                </button>
              )}

              <button
                type="button"
                className={`quiz-type-card ${quizType === 'kotoba' ? 'active' : ''}`}
                onClick={() => setQuizType('kotoba')}
              >
                <div className="quiz-type-icon jp">語</div>
                <div>
                  <div className="quiz-type-title">Kotoba</div>
                  <div className="quiz-type-desc">{isN4 ? '918 N4 Vocabulary' : '1,523 N5 Vocabulary'}</div>
                </div>
              </button>

              <button
                type="button"
                className={`quiz-type-card ${quizType === 'grammar' ? 'active' : ''}`}
                onClick={() => setQuizType('grammar')}
              >
                <div className="quiz-type-icon jp">文</div>
                <div>
                  <div className="quiz-type-title">Grammar Check</div>
                  <div className="quiz-type-desc">Patterns &amp; Usage (文法)</div>
                </div>
              </button>

              <button
                type="button"
                className={`quiz-type-card ${quizType === 'conjunction' ? 'active' : ''}`}
                onClick={() => setQuizType('conjunction')}
              >
                <div className="quiz-type-icon jp">助</div>
                <div>
                  <div className="quiz-type-title">စကားဆက်</div>
                  <div className="quiz-type-desc">Particles &amp; Conjunctions</div>
                </div>
              </button>

              {!isN4 && (
                <button
                  type="button"
                  className={`quiz-type-card ${quizType === 'basics' ? 'active' : ''}`}
                  onClick={() => setQuizType('basics')}
                >
                  <div className="quiz-type-icon jp">基</div>
                  <div>
                    <div className="quiz-type-title">Basics</div>
                    <div className="quiz-type-desc">Numbers &amp; Counters</div>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* 2. SUB-OPTIONS (SCRIPT OR FLEXIBLE LESSON SCOPE) */}
          {quizType === 'kana' && (
            <div className="quiz-select-group">
              <label className="form-label">
                2. Choose Script (文字)
              </label>
              <div className="pill-select-row">
                <button
                  type="button"
                  className={`pill-opt-btn ${scriptType === 'hiragana' ? 'active' : ''}`}
                  onClick={() => setScriptType('hiragana')}
                >
                  <span className="jp" style={{ fontWeight: 800 }}>あ</span> Hiragana (ひらがな)
                </button>
                <button
                  type="button"
                  className={`pill-opt-btn ${scriptType === 'katakana' ? 'active' : ''}`}
                  onClick={() => setScriptType('katakana')}
                >
                  <span className="jp" style={{ fontWeight: 800 }}>ア</span> Katakana (カタカナ)
                </button>
              </div>
            </div>
          )}

          {quizType === 'kotoba' && (
            <div className="quiz-select-group">
              <label className="form-label">
                2. Question Direction (မေးခွန်းပုံစံ)
              </label>
              <div className="pill-select-row">
                <button
                  type="button"
                  className={`pill-opt-btn ${kotobaDirection === 'jp-mm' ? 'active' : ''}`}
                  onClick={() => setKotobaDirection('jp-mm')}
                >
                  Japan → Meaning (EN · MM)
                </button>
                <button
                  type="button"
                  className={`pill-opt-btn ${kotobaDirection === 'mm-jp' ? 'active' : ''}`}
                  onClick={() => setKotobaDirection('mm-jp')}
                >
                  Meaning (EN · MM) → Japan
                </button>
                <button
                  type="button"
                  className={`pill-opt-btn ${kotobaDirection === 'mixed' ? 'active' : ''}`}
                  onClick={() => setKotobaDirection('mixed')}
                >
                  Mixed (နှစ်မျိုးစလုံး)
                </button>
              </div>
            </div>
          )}

          {supportsLessonScope && (
            <div className="quiz-select-group">
              <label className="form-label">
                {quizType === 'kotoba' ? '3. Lesson Scope (課の選択)' : '2. Lesson Scope (課の選択)'}
              </label>

              {/* 3-Mode Scope Selector Pills */}
              <div className="pill-select-row" style={{ marginBottom: '12px' }}>
                <button
                  type="button"
                  className={`pill-opt-btn ${lessonScopeMode === 'all' ? 'active' : ''}`}
                  onClick={() => setLessonScopeMode('all')}
                >
                  All Lessons ({lessonStart}–{lessonEnd})
                </button>
                <button
                  type="button"
                  className={`pill-opt-btn ${lessonScopeMode === 'single' ? 'active' : ''}`}
                  onClick={() => setLessonScopeMode('single')}
                >
                  Single Lesson (၁ ခန်းတည်း)
                </button>
                <button
                  type="button"
                  className={`pill-opt-btn ${lessonScopeMode === 'range' ? 'active' : ''}`}
                  onClick={() => setLessonScopeMode('range')}
                >
                  From–To Range (အခန်းတွဲ)
                </button>
              </div>

              {lessonScopeMode === 'single' && (
                <select
                  className="custom-select"
                  value={selectedLesson}
                  onChange={e => setSelectedLesson(e.target.value)}
                >
                  {lessonNumbers.map(l => (
                    <option key={l} value={l}>
                      Minna no Nihongo Lesson {l} (第{l}課)
                    </option>
                  ))}
                </select>
              )}

              {lessonScopeMode === 'range' && (
                <div className="quiz-range-row">
                  <div className="quiz-range-field">
                    <span className="quiz-range-label">From (မှ):</span>
                    <select
                      className="custom-select"
                      value={rangeFrom}
                      onChange={e => handleRangeFromChange(e.target.value)}
                    >
                      {lessonNumbers.map(l => (
                        <option key={l} value={l}>
                          Lesson {l} (第{l}課)
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="quiz-range-sep">→</span>
                  <div className="quiz-range-field">
                    <span className="quiz-range-label">To (အထိ):</span>
                    <select
                      className="custom-select"
                      value={rangeTo}
                      onChange={e => handleRangeToChange(e.target.value)}
                    >
                      {lessonNumbers.filter(l => l >= rangeFrom).map(l => (
                        <option key={l} value={l}>
                          Lesson {l} (第{l}課)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUESTION COUNT - PILL SELECTOR */}
          <div className="quiz-select-group">
            <label className="form-label">
              {`${quizType === 'kotoba' ? 4 : quizType === 'basics' ? 2 : 3}. Question Count (問題数)`}
            </label>
            <div className="pill-select-row">
              {[10, 20, 30, 50].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  className={`pill-opt-btn ${questionCount === cnt ? 'active' : ''}`}
                  onClick={() => setQuestionCount(cnt)}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          {/* 4. ACTION BUTTON */}
          <div style={{ marginTop: '28px' }}>
            <button
              type="button"
              className="btn-primary-action"
              onClick={generateQuiz}
              disabled={loadingQuiz}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>{loadingQuiz ? 'Preparing Quiz...' : 'Start Quiz Now →'}</span>
            </button>
          </div>
        </section>
      )}

      {/* PLAYING CARD */}
      {quizState === 'playing' && currentQ && (
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--muted)' }}>
                Question {curIndex + 1} of {questions.length}
              </span>
              {currentQ.lessonBadge && (
                <span className="word-tag" style={{ background: 'var(--bg-card-subtle)', color: 'var(--ink)', fontWeight: 800 }}>
                  {currentQ.lessonBadge}
                </span>
              )}
            </div>
            <span style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--primary)', background: 'var(--primary-faint)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
              Score: {score}
            </span>
          </div>

          <div className="quiz-progress-track">
            <div
              className="quiz-progress-bar"
              style={{ width: `${((curIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
            {currentQ.cue && (
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--faint)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {currentQ.cue}
              </div>
            )}

            <div
              className={`quiz-prompt ${currentQ.isMeaningPrompt ? 'quiz-prompt-meaning' : ['conjunction', 'grammar'].includes(currentQ.type) ? 'jp quiz-prompt-sentence' : 'jp'}`}
            >
              {renderQuizPrompt(currentQ)}
            </div>

            {currentQ.sub && (
              <div style={{ fontSize: '14.5px', color: 'var(--muted)', marginTop: '8px', fontWeight: 600 }}>
                {currentQ.sub}
              </div>
            )}

            {currentQ.speakText && (
              <div style={{ marginTop: '14px' }}>
                <button
                  type="button"
                  className="audio-pill-btn"
                  onClick={() => speakJapanese(currentQ.speakText)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  <span>{(currentQ.type === 'conjunction' || currentQ.type === 'grammar') && !answered ? 'Listen Full Sentence' : 'Listen Audio'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="quiz-options-grid">
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'quiz-opt-btn';
              if (answered) {
                if (opt.isCorrect) btnClass += ' correct';
                else if (selectedOpt === idx) btnClass += ' wrong';
              }
              const isJpOption = currentQ.type === 'conjunction' || currentQ.type === 'grammar' || currentQ.direction === 'mm-jp';
              return (
                <button
                  key={idx}
                  type="button"
                  className={btnClass}
                  disabled={answered}
                  onClick={() => handleSelect(opt, idx)}
                  style={{ textAlign: 'left', padding: '12px 14px' }}
                >
                  <span className="jp" style={{ fontWeight: 800, fontSize: isJpOption ? '16.5px' : '14px' }}>
                    {answered && opt.isCorrect ? '✓ ' : ''}
                    {answered && selectedOpt === idx && !opt.isCorrect ? '✗ ' : ''}
                    <RubyText text={opt.text} reading={opt.rd} />
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="quiz-feedback-box" role="status" aria-live="polite">
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: currentQ.options[selectedOpt]?.isCorrect ? 'var(--ok)' : 'var(--bad)' }}>
                {currentQ.options[selectedOpt]?.isCorrect
                  ? '✓ Correct! (မှန်ပါသည်)'
                  : `✗ Wrong — Correct answer: ${currentQ.options.find(o => o.isCorrect)?.text ?? ''}`}
              </p>
              {currentQ.note && (
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.55, fontWeight: 600 }}>
                  💡 {currentQ.note}
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--faint)', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              onClick={() => setQuizState('setup')}
            >
              ← End Quiz
            </button>

            {answered && (
              <button
                type="button"
                className="btn-primary-action"
                style={{ width: 'auto', padding: '10px 24px' }}
                onClick={handleNext}
              >
                {curIndex + 1 < questions.length ? 'Next Question →' : 'View Results'}
              </button>
            )}
          </div>
        </section>
      )}

      {/* RESULT CARD */}
      {quizState === 'result' && (
        <section className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
          <div style={{ fontSize: '42px', marginBottom: '12px' }}>
            {score / questions.length >= 0.8 ? '🎉' : score / questions.length >= 0.5 ? '👍' : '💪'}
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px', color: 'var(--ink)' }}>
            Quiz Complete!
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '24px', fontWeight: 600 }}>
            You scored <strong style={{ color: 'var(--ink)', fontSize: '22px' }}>{score}</strong> out of <strong>{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary-action"
              style={{ width: 'auto', padding: '12px 28px' }}
              onClick={generateQuiz}
            >
              Try Again
            </button>
            <button
              type="button"
              className="audio-pill-btn"
              style={{ padding: '12px 24px', fontSize: '14px' }}
              onClick={() => setQuizState('setup')}
            >
              Change Settings
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
