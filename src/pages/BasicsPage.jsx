import React, { useState } from 'react';
import Accordion from '../components/Accordion';
import Pagination from '../components/Pagination';
import {
  NUM_TABLE,
  COUNTERS,
  GREETINGS,
  HOUR_TABLE,
  MIN_TABLE,
  WEEKDAY_TABLE,
  MONTH_TABLE,
  DATE_TABLE,
  REL_ROWS,
  MAI_TABLE,
  BASIC_COUNT
} from '../data/topicsData';
import { speakJapanese, shuffle } from '../utils/speech';

export default function BasicsPage() {
  // Numbers pagination
  const [numPage, setNumPage] = useState(1);
  const NUM_PER_PAGE = 20;
  const numTotalPages = Math.ceil(NUM_TABLE.length / NUM_PER_PAGE);
  const currentNumbers = NUM_TABLE.slice((numPage - 1) * NUM_PER_PAGE, numPage * NUM_PER_PAGE);

  // Greetings pagination
  const [greetPage, setGreetPage] = useState(1);
  const GREET_PER_PAGE = 10;
  const greetTotalPages = Math.ceil(GREETINGS.length / GREET_PER_PAGE);
  const currentGreetings = GREETINGS.slice((greetPage - 1) * GREET_PER_PAGE, greetPage * GREET_PER_PAGE);

  // Basics Quiz state
  const [quizState, setQuizState] = useState('idle'); // 'idle' | 'playing' | 'result'
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOptIndex, setSelectedOptIndex] = useState(null);

  function startQuiz() {
    // Pool: BASIC_COUNT + COUNTERS rows + GREETINGS
    const pool = [
      ...BASIC_COUNT.map(r => ({ jp: r[1], rom: r[2], en: r[3], my: r[4] })),
      ...COUNTERS.flatMap(c => c.rows.map(r => ({ jp: r[1], rom: r[2], en: `${r[3]} (${c.name || c.en})`, my: r[4] }))),
      ...GREETINGS.map(g => ({ jp: g.jp, rom: g.rom, en: g.en, my: g.my }))
    ];

    const shuffled = shuffle(pool);
    const questions = [];

    for (let i = 0; i < Math.min(10, shuffled.length); i++) {
      const target = shuffled[i];
      const wrong = shuffle(pool.filter(p => p.en !== target.en)).slice(0, 3);
      const options = shuffle([
        { en: target.en, my: target.my, isCorrect: true },
        ...wrong.map(w => ({ en: w.en, my: w.my, isCorrect: false }))
      ]);

      questions.push({
        jp: target.jp,
        rom: target.rom,
        en: target.en,
        my: target.my,
        options
      });
    }

    setQuizQuestions(questions);
    setCurrentQIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOptIndex(null);
    setQuizState('playing');

    if (questions[0]) {
      speakJapanese(questions[0].jp);
    }
  }

  function handleSelectOption(opt, index) {
    if (answered) return;
    setAnswered(true);
    setSelectedOptIndex(index);
    if (opt.isCorrect) {
      setScore(s => s + 1);
    }
  }

  function handleNextQuestion() {
    if (currentQIndex + 1 < quizQuestions.length) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setAnswered(false);
      setSelectedOptIndex(null);
      speakJapanese(quizQuestions[nextIdx].jp);
    } else {
      setQuizState('result');
    }
  }

  const currentQ = quizQuestions[currentQIndex];

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Grammar &amp; Number Foundation</div>
        <h1 className="hero-title">Essential Basics (基本)</h1>
        <p className="hero-desc">
          Numbers 0–100,000,000, 11 Counters, 20 Core Greetings, Time &amp; Clock, and Calendar Dates with native pronunciation audio.
        </p>
      </div>

      {/* 1. NUMBERS */}
      <Accordion
        jp="かず"
        title="Numbers (0 – 100,000,000)"
        desc="Counting, hundreds, thousands, and ten-thousands with pagination"
        defaultOpen={true}
      >
        <div className="rt-table">
          {currentNumbers.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{r[0]}</span>
              <span className="rt-j jp">{r[1]}</span>
              <span className="rt-r">{r[2]}</span>
              <span className="rt-m">{r[3]}</span>
              <button
                type="button"
                className="audio-btn"
                onClick={() => speakJapanese(r[1])}
                title="Listen Audio"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <Pagination
          totalPages={numTotalPages}
          currentPage={numPage}
          onPageChange={p => setNumPage(p)}
        />
      </Accordion>

      {/* 2. COUNTERS */}
      <Accordion
        jp="助数詞"
        title="11 Core Japanese Counters (助数詞)"
        desc="Age, People, Floors, General Things, Flat things, Long items, Animals, Books, Machines, Small objects, Cups"
        defaultOpen={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {COUNTERS.map((c, cIdx) => (
            <Accordion
              key={cIdx}
              jp={c.jp}
              title={`${c.name || c.en} (${c.en})`}
              desc={c.my}
              isSub={true}
              defaultOpen={false}
            >
              <div className="rt-table">
                {c.rows.map((r, rIdx) => (
                  <div key={rIdx} className="rt-row">
                    <span className="rt-n">{r[0]}</span>
                    <span className="rt-j jp">{r[1]}</span>
                    <span className="rt-r">{r[2]}</span>
                    <span className="rt-m">{r[3]} · {r[4]}</span>
                    <button
                      type="button"
                      className="audio-btn"
                      onClick={() => speakJapanese(r[1])}
                      title="Listen Audio"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </Accordion>
          ))}
        </div>
      </Accordion>

      {/* 3. GREETINGS */}
      <Accordion
        jp="あいさつ"
        title="Everyday Greetings (挨拶)"
        desc="20 everyday greetings with contextual usage notes"
        defaultOpen={false}
      >
        <div className="rt-table">
          {currentGreetings.map((g, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{(greetPage - 1) * GREET_PER_PAGE + idx + 1}.</span>
              <span className="rt-j jp">{g.jp}</span>
              <span className="rt-r">{g.rom}</span>
              <span className="rt-m">
                {g.en} · {g.my}
                <br />
                <span style={{ color: 'var(--faint)', fontSize: '12px' }}>သုံးသည့်အချိန် — {g.when}</span>
              </span>
              <button
                type="button"
                className="audio-btn"
                onClick={() => speakJapanese(g.jp)}
                title="Listen Audio"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <Pagination
          totalPages={greetTotalPages}
          currentPage={greetPage}
          onPageChange={p => setGreetPage(p)}
        />
        <p className="rt-note" style={{ marginTop: '14px' }}>
          These are the core greetings. The other 38 greetings &amp; expressions live in <b>Kotoba → Category: Greetings and Expressions</b>.
        </p>
      </Accordion>

      {/* 4. TIME & CLOCK */}
      <Accordion
        jp="じかん"
        title="Time &amp; Clock (時間・時・分)"
        desc="〜じ hours · 〜ふん/ぷん minutes · AM / PM relative times"
        defaultOpen={false}
      >
        <h4 style={{ margin: '14px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Hours (〜じ)
        </h4>
        <div className="rt-table">
          {HOUR_TABLE.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{r[0]}</span>
              <span className="rt-j jp">{r[1]}</span>
              <span className="rt-r">{r[2]}</span>
              <span className="rt-m">{r[3]}</span>
              <button type="button" className="audio-btn" onClick={() => speakJapanese(r[1])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /></svg>
              </button>
            </div>
          ))}
        </div>

        <h4 style={{ margin: '22px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Minutes (〜ふん / 〜ぷん)
        </h4>
        <div className="rt-table">
          {MIN_TABLE.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{r[0]}</span>
              <span className="rt-j jp">{r[1]}</span>
              <span className="rt-r">{r[2]}</span>
              <span className="rt-m">{r[3]}</span>
              <button type="button" className="audio-btn" onClick={() => speakJapanese(r[1])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /></svg>
              </button>
            </div>
          ))}
        </div>

        <h4 style={{ margin: '22px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Recurring Time (Every...)
        </h4>
        <div className="rt-table">
          {MAI_TABLE.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{idx + 1}</span>
              <span className="rt-j jp">{r[0]}</span>
              <span className="rt-r">{r[1]}</span>
              <span className="rt-m">{r[2]} · {r[3]}</span>
              <button type="button" className="audio-btn" onClick={() => speakJapanese(r[0])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /></svg>
              </button>
            </div>
          ))}
        </div>
      </Accordion>

      {/* 5. CALENDAR & DATES */}
      <Accordion
        jp="ひづけ"
        title="Calendar &amp; Dates (日付・月・曜日)"
        desc="Months 1–12 · Days of the month 1–31 · Days of the week · Past / Present / Future"
        defaultOpen={false}
      >
        <h4 style={{ margin: '14px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Months (〜がつ)
        </h4>
        <div className="rt-table">
          {MONTH_TABLE.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{r[0]}</span>
              <span className="rt-j jp">{r[1]}</span>
              <span className="rt-r">{r[2]}</span>
              <span className="rt-m">{r[3]}</span>
              <button type="button" className="audio-btn" onClick={() => speakJapanese(r[1])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /></svg>
              </button>
            </div>
          ))}
        </div>

        <h4 style={{ margin: '22px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Days of the Month (1st to 31st)
        </h4>
        <div className="rt-table">
          {DATE_TABLE.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{r[0]}</span>
              <span className="rt-j jp">{r[1]}</span>
              <span className="rt-r">{r[2]}</span>
              <span className="rt-m">{r[3]}</span>
              <button type="button" className="audio-btn" onClick={() => speakJapanese(r[1])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /></svg>
              </button>
            </div>
          ))}
        </div>

        <h4 style={{ margin: '22px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Days of the Week (〜ようび)
        </h4>
        <div className="rt-table">
          {WEEKDAY_TABLE.map((r, idx) => (
            <div key={idx} className="rt-row">
              <span className="rt-n">{r[0]}</span>
              <span className="rt-j jp">{r[1]}</span>
              <span className="rt-r">{r[2]}</span>
              <span className="rt-m">{r[3]}</span>
              <button type="button" className="audio-btn" onClick={() => speakJapanese(r[1])}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z" /></svg>
              </button>
            </div>
          ))}
        </div>

        <h4 style={{ margin: '22px 0 8px', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
          Relative Time (Past / Present / Future)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {REL_ROWS.map((group, gIdx) => (
            <div
              key={gIdx}
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '12px'
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '8px', color: 'var(--primary)' }}>
                {group[0]} · {group[1]}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
                {group[2].map((step, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => speakJapanese(step[0])}
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 10px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="jp" style={{ fontWeight: 800, fontSize: '13.5px' }}>{step[0]}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{step[1]}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--ink)' }}>{step[3]}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>

      {/* 6. BASICS QUIZ */}
      <section className="card" style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>
          Practice Quiz — Basics
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '16px' }}>
          Test your mastery of Numbers, Counters, and Greetings with 10 random multiple-choice questions.
        </p>

        {quizState === 'idle' && (
          <div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%' }}
              onClick={startQuiz}
            >
              Start Basics Quiz (10 Questions) →
            </button>
          </div>
        )}

        {quizState === 'playing' && currentQ && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--muted)' }}>
                Question {currentQIndex + 1} / {quizQuestions.length}
              </span>
              <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary)' }}>
                Score {score}
              </span>
            </div>

            <div className="quiz-progress-track">
              <div
                className="quiz-progress-bar"
                style={{ width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>

            <div className="quiz-q-box" style={{ textAlign: 'center', margin: '20px 0' }}>
              <div className="quiz-prompt jp" style={{ fontSize: '32px', fontWeight: 900 }}>
                {currentQ.jp}
              </div>
              <div className="quiz-prompt-sub" style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                {currentQ.rom}
              </div>
              <button
                type="button"
                className="audio-btn"
                style={{ margin: '10px auto 0' }}
                onClick={() => speakJapanese(currentQ.jp)}
              >
                🔊 Listen Again
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {currentQ.options.map((opt, oIdx) => {
                let btnClass = 'quiz-opt-btn';
                if (answered) {
                  if (opt.isCorrect) btnClass += ' correct';
                  else if (selectedOptIndex === oIdx) btnClass += ' wrong';
                }
                return (
                  <button
                    key={oIdx}
                    type="button"
                    className={btnClass}
                    disabled={answered}
                    onClick={() => handleSelectOption(opt, oIdx)}
                  >
                    <span style={{ fontWeight: 800, fontSize: '15px' }}>{opt.en}</span>
                    <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, marginTop: '2px' }}>
                      {opt.my}
                    </span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextQuestion}
                >
                  {currentQIndex + 1 < quizQuestions.length ? 'Next Question →' : 'View Results →'}
                </button>
              </div>
            )}
          </div>
        )}

        {quizState === 'result' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px' }}>
              {score} / {quizQuestions.length}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>
              {score >= 8 ? '🎉 Outstanding! Excellent mastery!' : 'Keep practicing to master your basics!'}
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={startQuiz}
            >
              Try Again ↺
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
