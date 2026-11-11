import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KANA_ROWS, DAKUTEN, YOON } from '../data/kanaData';
import { WORDS, MINNA } from '../data/wordsData';
import { BASIC_COUNT, COUNTERS, GREETINGS } from '../data/topicsData';
import { speakJapanese, shuffle } from '../utils/speech';

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const queryType = searchParams.get('type') || 'kana';
  const queryLesson = searchParams.get('lesson') || '';

  // Settings
  const [quizType, setQuizType] = useState(queryType);
  const [scriptType, setScriptType] = useState('hiragana');
  const [questionCount, setQuestionCount] = useState(20);
  const [selectedLesson, setSelectedLesson] = useState(queryLesson || 'all');

  // Quiz running state
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [questions, setQuestions] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);

  useEffect(() => {
    if (queryLesson) {
      setQuizType('kotoba');
      setSelectedLesson(queryLesson);
    }
  }, [queryLesson]);

  function generateQuiz() {
    let pool = [];

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

      pool = basicList.map(item => {
        const char = scriptType === 'katakana' ? item.kata : item.hira;
        return {
          prompt: char,
          sub: scriptType === 'katakana' ? 'Katakana' : 'Hiragana',
          speakText: char,
          correctAnswer: item.rom,
          allPool: basicList.map(b => b.rom)
        };
      });
    } else if (quizType === 'kotoba') {
      let wordSubset = WORDS;
      if (selectedLesson !== 'all') {
        const lNum = parseInt(selectedLesson, 10);
        wordSubset = MINNA.filter(w => w.l === lNum);
        if (wordSubset.length < 5) wordSubset = MINNA;
      }

      pool = wordSubset.map(w => ({
        prompt: w.jp,
        sub: `${w.rd || ''} ${w.rom ? '(' + w.rom + ')' : ''}`,
        speakText: w.rd || w.jp,
        correctAnswer: `${w.en} · ${w.my}`,
        shortAnswer: w.en,
        allPool: wordSubset.map(item => `${item.en} · ${item.my}`)
      }));
    } else {
      // Basics pool
      const basicsList = [
        ...BASIC_COUNT.map(r => ({ prompt: r[1], sub: r[2], speakText: r[1], ans: `${r[3]} · ${r[4]}` })),
        ...COUNTERS.flatMap(c => c.rows.map(r => ({ prompt: r[1], sub: `${r[2]} (${c.name || c.en})`, speakText: r[1], ans: `${r[3]} · ${r[4]}` }))),
        ...GREETINGS.map(g => ({ prompt: g.jp, sub: g.rom, speakText: g.jp, ans: `${g.en} · ${g.my}` }))
      ];

      pool = basicsList.map(b => ({
        prompt: b.prompt,
        sub: b.sub,
        speakText: b.speakText,
        correctAnswer: b.ans,
        allPool: basicsList.map(item => item.ans)
      }));
    }

    const shuffled = shuffle(pool);
    const count = Math.min(questionCount, shuffled.length);
    const quizList = [];

    for (let i = 0; i < count; i++) {
      const target = shuffled[i];
      const wrongList = shuffle(target.allPool.filter(a => a !== target.correctAnswer)).slice(0, 3);
      const options = shuffle([
        { text: target.correctAnswer, isCorrect: true },
        ...wrongList.map(w => ({ text: w, isCorrect: false }))
      ]);

      quizList.push({
        prompt: target.prompt,
        sub: target.sub,
        speakText: target.speakText,
        options
      });
    }

    setQuestions(quizList);
    setCurIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOpt(null);
    setQuizState('playing');

    if (quizList[0]) {
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
  }

  function handleNext() {
    if (curIndex + 1 < questions.length) {
      const nextIdx = curIndex + 1;
      setCurIndex(nextIdx);
      setAnswered(false);
      setSelectedOpt(null);
      speakJapanese(questions[nextIdx].speakText);
    } else {
      setQuizState('result');
    }
  }

  const currentQ = questions[curIndex];

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Practice &amp; Testing</div>
        <h1 className="hero-title">Interactive Quiz (練習問題)</h1>
        <p className="hero-desc">
          Challenge your Japanese memory with customizable multiple choice questions. Tap audio speaker anytime to hear native pronunciation.
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
              Select target skill, script options, and question count
            </span>
          </div>

          {/* 1. QUIZ TYPE - VISUAL 3-CARD SELECTION */}
          <div className="quiz-select-group">
            <label className="form-label">
              1. Select Target Skill (問題の種類)
            </label>
            <div className="quiz-type-grid">
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

              <button
                type="button"
                className={`quiz-type-card ${quizType === 'kotoba' ? 'active' : ''}`}
                onClick={() => setQuizType('kotoba')}
              >
                <div className="quiz-type-icon jp">語</div>
                <div>
                  <div className="quiz-type-title">Kotoba</div>
                  <div className="quiz-type-desc">1,445 Vocabulary</div>
                </div>
              </button>

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
            </div>
          </div>

          {/* 2. SUB-OPTIONS (SCRIPT OR LESSON) */}
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
                2. Lesson Scope (課)
              </label>
              <select
                className="custom-select"
                value={selectedLesson}
                onChange={e => setSelectedLesson(e.target.value)}
              >
                <option value="all">All Lessons (1–25) · Full N5 Syllabus</option>
                {Array.from({ length: 25 }, (_, i) => i + 1).map(l => (
                  <option key={l} value={l}>
                    Minna no Nihongo Lesson {l} (第{l}課)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 3. QUESTION COUNT - PILL SELECTOR */}
          <div className="quiz-select-group">
            <label className="form-label">
              {quizType === 'basics' ? '2. Question Count (問題数)' : '3. Question Count (問題数)'}
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

          {/* 4. MODERN ACTION BUTTON */}
          <div style={{ marginTop: '28px' }}>
            <button
              type="button"
              className="btn-primary-action"
              onClick={generateQuiz}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>Start Quiz Now →</span>
            </button>
          </div>
        </section>
      )}

      {/* PLAYING CARD */}
      {quizState === 'playing' && currentQ && (
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--muted)' }}>
              Question {curIndex + 1} of {questions.length}
            </span>
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

          <div style={{ textAlign: 'center', margin: '26px 0 20px' }}>
            <div className="jp" style={{ fontSize: '38px', fontWeight: 900, color: 'var(--ink)' }}>
              {currentQ.prompt}
            </div>
            {currentQ.sub && (
              <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>
                {currentQ.sub}
              </div>
            )}
            <div style={{ marginTop: '12px' }}>
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
                <span>Listen Audio</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'quiz-opt-btn';
              if (answered) {
                if (opt.isCorrect) btnClass += ' correct';
                else if (selectedOpt === idx) btnClass += ' wrong';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={btnClass}
                  disabled={answered}
                  onClick={() => handleSelect(opt, idx)}
                  style={{ textAlign: 'left', padding: '12px 14px' }}
                >
                  <span style={{ fontWeight: 800, fontSize: '14px' }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

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
                className="lesson-action-btn primary"
                onClick={handleNext}
                style={{ padding: '10px 22px', fontSize: '14px' }}
              >
                {curIndex + 1 < questions.length ? 'Next Question →' : 'View Results →'}
              </button>
            )}
          </div>
        </section>
      )}

      {/* RESULT CARD */}
      {quizState === 'result' && (
        <section className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px' }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
            {score === questions.length ? '🌟 Perfect Score! အပြည့်အဝ တတ်မြောက်သွားပါပြီ!' : score >= questions.length * 0.7 ? '🎉 Great Job! တော်တော်လေး ကောင်းမွန်ပါတယ်!' : 'Keep practicing! ထပ်မံ လေ့ကျင့်ပါဦး!'}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '24px' }}>
            You scored {Math.round((score / questions.length) * 100)}% accuracy.
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              className="lesson-action-btn primary"
              onClick={generateQuiz}
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              Try Again ↺
            </button>
            <button
              type="button"
              className="lesson-action-btn"
              onClick={() => setQuizState('setup')}
              style={{ padding: '10px 22px', fontSize: '14px' }}
            >
              Change Settings ⚙
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
