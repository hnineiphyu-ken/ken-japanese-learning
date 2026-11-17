import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MINNA_META } from '../data/topicsData';
import { MINNA } from '../data/wordsData';
import { speakJapanese, shuffle } from '../utils/speech';
import Pagination from '../components/Pagination';
import LessonExercises from '../components/LessonExercises';
import { LESSON_EXERCISES } from '../data/lessonExercises';
import { LESSON_CONTENT } from '../data/lessonContent';

export default function LessonsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected lesson filter: 'all' | number (e.g. 1, 2, ... 25)
  const queryLesson = searchParams.get('lesson');
  const initialLesson = queryLesson && !isNaN(Number(queryLesson)) ? Number(queryLesson) : 'all';
  const [selectedLessonFilter, setSelectedLessonFilter] = useState(initialLesson);

  // Active expanded lesson for study: number | null
  const [expandedLesson, setExpandedLesson] = useState(initialLesson !== 'all' ? initialLesson : null);
  // Active study section inside expanded lesson: 'vocab' | 'exercises' | 'sentences' | 'grammar' | 'dialogue'
  const [activeStudyTab, setActiveStudyTab] = useState('vocab');
  const [lessonWordPage, setLessonWordPage] = useState(1);
  const WORDS_PER_PAGE = 15;

  // Active quiz state: null | { lessonNum, questions, curIndex, score, answered, selectedOpt, finished }
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Group words by lesson
  const wordsByLesson = useMemo(() => {
    const map = {};
    MINNA.forEach(w => {
      if (!map[w.l]) map[w.l] = [];
      map[w.l].push(w);
    });
    return map;
  }, []);

  function handleSelectLesson(val) {
    if (val === 'all') {
      setSelectedLessonFilter('all');
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete('lesson');
        return next;
      });
    } else {
      const num = Number(val);
      setSelectedLessonFilter(num);
      setExpandedLesson(num);
      setActiveStudyTab('vocab');
      setLessonWordPage(1);
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('lesson', String(num));
        return next;
      });
    }
    if (activeQuiz) {
      setActiveQuiz(null);
    }
  }

  function handleToggleStudy(lessonNum) {
    if (selectedLessonFilter !== 'all') {
      if (expandedLesson === lessonNum) {
        setExpandedLesson(null);
      } else {
        setExpandedLesson(lessonNum);
        setActiveStudyTab('vocab');
        setLessonWordPage(1);
      }
    } else {
      // When in All Lessons overview, clicking Study Lesson directly focuses into this lesson
      handleSelectLesson(lessonNum);
    }
    if (activeQuiz && activeQuiz.lessonNum === lessonNum) {
      setActiveQuiz(null);
    }
  }

  const displayedLessons = useMemo(() => {
    if (selectedLessonFilter === 'all') {
      return MINNA_META;
    }
    return MINNA_META.filter(m => m.l === Number(selectedLessonFilter));
  }, [selectedLessonFilter]);

  function handleStartLessonQuiz(lessonNum) {
    const lessonWords = wordsByLesson[lessonNum] || [];
    if (lessonWords.length < 4) {
      navigate(`/quiz?type=kotoba&lesson=${lessonNum}`);
      return;
    }

    const shuffled = shuffle(lessonWords);
    const count = Math.min(10, shuffled.length);
    const questions = [];

    for (let i = 0; i < count; i++) {
      const target = shuffled[i];
      const otherWords = lessonWords.filter(w => w.en !== target.en);
      const wrongList = shuffle(otherWords).slice(0, 3);
      const options = shuffle([
        { text: `${target.en} · ${target.my}`, isCorrect: true },
        ...wrongList.map(w => ({ text: `${w.en} · ${w.my}`, isCorrect: false }))
      ]);

      questions.push({
        jp: target.jp,
        rd: target.rd,
        rom: target.rom,
        speakText: target.rd || target.jp,
        options
      });
    }

    setActiveQuiz({
      lessonNum,
      questions,
      curIndex: 0,
      score: 0,
      answered: false,
      selectedOpt: null,
      finished: false
    });

    if (questions[0]) {
      speakJapanese(questions[0].speakText);
    }
  }

  function handleQuizSelect(opt, optIdx) {
    if (!activeQuiz || activeQuiz.answered) return;
    const isCorrect = opt.isCorrect;
    setActiveQuiz(prev => ({
      ...prev,
      answered: true,
      selectedOpt: optIdx,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  }

  function handleQuizNext() {
    if (!activeQuiz) return;
    if (activeQuiz.curIndex + 1 < activeQuiz.questions.length) {
      const nextIdx = activeQuiz.curIndex + 1;
      setActiveQuiz(prev => ({
        ...prev,
        curIndex: nextIdx,
        answered: false,
        selectedOpt: null
      }));
      speakJapanese(activeQuiz.questions[nextIdx].speakText);
    } else {
      setActiveQuiz(prev => ({
        ...prev,
        finished: true
      }));
    }
  }

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Structured Coursework</div>
        <h1 className="hero-title">Minna no Nihongo Lessons 1–25 (第1課〜第25課)</h1>
        <p className="hero-desc">
          Complete Shokyu 1 syllabus. Study all 1,068 chapter vocabulary words with native pronunciation, or take a dedicated practice quiz for each lesson.
        </p>

        {/* Syllabus Roadmap Announcement */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'var(--bg-card-subtle)',
            border: '1.5px solid var(--line-soft)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '18px' }}>✨</span>
          <div style={{ flex: '1 1 300px', fontSize: '13px', lineHeight: '1.5', color: 'var(--ink)' }}>
            <b>Minna no Nihongo N5 Syllabus Roadmap:</b> All 1,068 vocabulary words are live. <b>Lessons 1 through 7 Complete Coursework (単語, 文型, 例文, 会話, 文法解説, 練習 A·B·C &amp; 問題)</b> are now 100% active with interactive self-testing &amp; native audio pronunciation!
          </div>
          <span className="badge-coming-soon" style={{ background: '#16a34a', color: '#ffffff' }}>Lessons 1–7 Live ✅</span>
        </div>
      </div>

      {/* Lesson Navigator & Select Bar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          background: '#ffffff',
          border: '2px solid var(--line)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 320px' }}>
          <label htmlFor="lesson-jump-select" style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
            📚 Select Lesson:
          </label>
          <select
            id="lesson-jump-select"
            className="custom-select"
            value={selectedLessonFilter}
            onChange={e => handleSelectLesson(e.target.value)}
            style={{ flex: 1, minWidth: '220px' }}
          >
            <option value="all">All Lessons (1–25 Syllabus Overview)</option>
            {MINNA_META.map(m => (
              <option key={m.l} value={m.l}>
                Lesson {m.l}: {m.jp} — {m.t} ({wordsByLesson[m.l]?.length || 0} words)
              </option>
            ))}
          </select>
        </div>

        {/* Quick Prev / Next / View All buttons */}
        {selectedLessonFilter !== 'all' ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="lesson-action-btn"
              disabled={Number(selectedLessonFilter) <= 1}
              onClick={() => handleSelectLesson(Number(selectedLessonFilter) - 1)}
              title="Previous Lesson"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              ◀ Prev
            </button>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)', padding: '0 4px' }}>
              L{selectedLessonFilter} / 25
            </span>
            <button
              type="button"
              className="lesson-action-btn"
              disabled={Number(selectedLessonFilter) >= 25}
              onClick={() => handleSelectLesson(Number(selectedLessonFilter) + 1)}
              title="Next Lesson"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              Next ▶
            </button>
            <button
              type="button"
              className="lesson-action-btn"
              onClick={() => handleSelectLesson('all')}
              title="Show All Lessons"
              style={{ padding: '7px 14px', fontSize: '12.5px' }}
            >
              View All (1–25)
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '12.5px', color: 'var(--muted)', fontWeight: 700 }}>
            Showing all 25 lessons
          </div>
        )}
      </div>

      {/* Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayedLessons.map(meta => {
          const words = wordsByLesson[meta.l] || [];
          const count = words.length;
          const isStudying = expandedLesson === meta.l;
          const isQuizzing = activeQuiz && activeQuiz.lessonNum === meta.l;

          // Pagination for studying words
          const totalWordPages = Math.ceil(count / WORDS_PER_PAGE);
          const paginatedWords = words.slice(
            (lessonWordPage - 1) * WORDS_PER_PAGE,
            lessonWordPage * WORDS_PER_PAGE
          );

          return (
            <div key={meta.l} className="card" style={{ padding: '20px 24px' }}>
              {/* Header row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      background: 'var(--ink)',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '15px',
                      borderRadius: 'var(--radius-md)',
                      width: '46px',
                      height: '46px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    L{meta.l}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="jp" style={{ fontWeight: 800, fontSize: '18px', color: 'var(--ink)' }}>
                        {meta.jp}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--muted)' }}>
                        {meta.t}
                      </span>
                      <span
                        className="word-tag"
                        style={{
                          background: count > 0 ? 'var(--primary-faint)' : 'var(--line)',
                          color: count > 0 ? 'var(--primary)' : 'var(--muted)',
                          fontWeight: 800
                        }}
                      >
                        {count} words
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--faint)', marginTop: '3px' }}>
                      {meta.d}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`lesson-action-btn ${isStudying ? 'primary' : ''}`}
                    onClick={() => handleToggleStudy(meta.l)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span>{isStudying ? 'Hide Lesson ▴' : 'Study Lesson ▾'}</span>
                  </button>
                  <button
                    type="button"
                    className="lesson-action-btn primary"
                    onClick={() => handleStartLessonQuiz(meta.l)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" />
                    </svg>
                    <span>Practice Quiz →</span>
                  </button>
                </div>
              </div>

              {/* EXPANDED LESSON STUDY PANEL */}
              {isStudying && (
                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '18px',
                    borderTop: '2px solid var(--line-soft)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  {/* Clean Study Section Select Box (replaces cluttered wrapping tabs) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap',
                      marginBottom: '18px',
                      padding: '10px 14px',
                      background: 'var(--bg-card-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--line-soft)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 280px' }}>
                      <label htmlFor={`study-section-${meta.l}`} style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                        🎯 Study Section:
                      </label>
                      <select
                        id={`study-section-${meta.l}`}
                        className="custom-select"
                        value={activeStudyTab}
                        onChange={e => setActiveStudyTab(e.target.value)}
                        style={{ flex: 1, minWidth: '220px' }}
                      >
                        <option value="vocab">📖 Vocabulary List ({count} words)</option>
                        <option value="exercises">
                          ✍️ Exercises (練習・問題) {LESSON_EXERCISES[meta.l] ? '— Live ✅' : '— Soon ⏳'}
                        </option>
                        <option value="sentences">
                          💬 Sentences (文型・例文) {LESSON_CONTENT[meta.l]?.bunkei ? '— Live ✅' : '— Soon ⏳'}
                        </option>
                        <option value="grammar">
                          📐 Grammar Notes (文法解説) {LESSON_CONTENT[meta.l]?.grammar ? '— Live ✅' : '— Soon ⏳'}
                        </option>
                        <option value="dialogue">
                          👥 Conversations (会話) {LESSON_CONTENT[meta.l]?.kaiwa ? '— Live ✅' : '— Soon ⏳'}
                        </option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {activeStudyTab === 'vocab' && (
                        <span className="word-tag" style={{ background: 'var(--primary-faint)', color: 'var(--primary)', fontWeight: 800 }}>
                          {count} Words
                        </span>
                      )}
                      {activeStudyTab === 'exercises' && (
                        LESSON_EXERCISES[meta.l] ? (
                          <span className="badge-coming-soon" style={{ background: '#16a34a', color: '#ffffff' }}>
                            Live ✅
                          </span>
                        ) : (
                          <span className="badge-coming-soon">Soon ⏳</span>
                        )
                      )}
                      {activeStudyTab === 'sentences' && (
                        LESSON_CONTENT[meta.l]?.bunkei ? (
                          <span className="badge-coming-soon" style={{ background: '#16a34a', color: '#ffffff' }}>
                            4 Patterns + 6 Examples Live ✅
                          </span>
                        ) : (
                          <span className="badge-coming-soon">Soon ⏳</span>
                        )
                      )}
                      {activeStudyTab === 'grammar' && (
                        LESSON_CONTENT[meta.l]?.grammar ? (
                          <span className="badge-coming-soon" style={{ background: '#16a34a', color: '#ffffff' }}>
                            7 Points Live ✅
                          </span>
                        ) : (
                          <span className="badge-coming-soon">Soon ⏳</span>
                        )
                      )}
                      {activeStudyTab === 'dialogue' && (
                        LESSON_CONTENT[meta.l]?.kaiwa ? (
                          <span className="badge-coming-soon" style={{ background: '#16a34a', color: '#ffffff' }}>
                            Full Dialogue Live ✅
                          </span>
                        ) : (
                          <span className="badge-coming-soon">Soon ⏳</span>
                        )
                      )}
                    </div>
                  </div>

                  {/* TAB 1: VOCABULARY LIST (ACTIVE) */}
                  {activeStudyTab === 'vocab' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
                          Lesson {meta.l} Vocabulary List ({count} words)
                        </span>
                        <span style={{ fontSize: '12.5px', color: 'var(--faint)' }}>
                          Page {lessonWordPage} of {totalWordPages}
                        </span>
                      </div>

                      <div className="rt-table">
                        {paginatedWords.map((w, wIdx) => {
                          const num = (lessonWordPage - 1) * WORDS_PER_PAGE + wIdx + 1;
                          return (
                            <div key={wIdx} className="rt-row">
                              <span className="rt-n">{num}.</span>
                              <span className="rt-j jp">
                                <div>{w.jp}</div>
                                {w.rd && w.rd !== w.jp && (
                                  <div className="rt-rd jp">
                                    {w.rd}
                                  </div>
                                )}
                              </span>
                              <span className="rt-r">{w.rom}</span>
                              <span className="rt-m">
                                <span style={{ fontWeight: 700 }}>{w.en}</span>
                                <br />
                                <span style={{ color: 'var(--muted)', fontSize: '12.5px' }}>{w.my}</span>
                              </span>
                              <button
                                type="button"
                                className="audio-btn"
                                onClick={() => speakJapanese(w.rd || w.jp)}
                                title="Listen Audio"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <Pagination
                        totalPages={totalWordPages}
                        currentPage={lessonWordPage}
                        onPageChange={p => setLessonWordPage(p)}
                      />
                    </div>
                  )}

                  {/* TAB 2: EXERCISES & DRILLS (練習・問題) */}
                  {activeStudyTab === 'exercises' && (
                    <LessonExercises lessonNum={meta.l} />
                  )}

                  {/* TAB 3: SENTENCES (文型 & 例文) */}
                  {activeStudyTab === 'sentences' && (
                    LESSON_CONTENT[meta.l]?.bunkei ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* 1. BUNKEI (文型) */}
                        <div
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid var(--line)',
                            borderRadius: 'var(--radius-md)',
                            padding: '18px 20px',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                                第{meta.l}課 文型 (Core Sentence Patterns)
                              </h3>
                              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '3px 0 0' }}>
                                Core grammatical sentence structures from textbook page 6.
                              </p>
                            </div>
                            <span className="badge-coming-soon" style={{ background: 'var(--ink)', color: '#fff' }}>
                              4 Sentence Patterns
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {LESSON_CONTENT[meta.l].bunkei.map(b => (
                              <div
                                key={b.no}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '12px 16px',
                                  background: 'var(--bg-card-subtle)',
                                  borderRadius: '8px',
                                  border: '1px solid var(--line-soft)',
                                  gap: '12px'
                                }}
                              >
                                <div style={{ flex: '1 1 auto' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ background: 'var(--ink)', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '1px 6px', borderRadius: '4px' }}>
                                      Pattern {b.no}
                                    </span>
                                    <span className="word-tag" style={{ fontSize: '11px', fontWeight: 800 }}>
                                      {b.pattern}
                                    </span>
                                  </div>
                                  <div className="jp" style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--ink)' }}>
                                    {b.jp}
                                    {b.altJp && <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '6px' }}>{b.altJp}</span>}
                                  </div>
                                  {b.rd && b.rd !== b.jp && (
                                    <div className="lesson-furigana jp">
                                      <span className="lesson-furigana-badge">Furigana</span>
                                      <span>{b.rd}</span>
                                    </div>
                                  )}
                                  {b.rom && (
                                    <div className="lesson-romaji">
                                      {b.rom}
                                    </div>
                                  )}
                                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>
                                    {b.my}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="audio-btn"
                                  onClick={() => speakJapanese(b.rd || b.jp)}
                                  title="Listen Sentence"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. REIBUN (例文) */}
                        <div
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid var(--line)',
                            borderRadius: 'var(--radius-md)',
                            padding: '18px 20px',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                                第{meta.l}課 例文 (Example Sentences &amp; Short Dialogues)
                              </h3>
                              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '3px 0 0' }}>
                                Natural conversational Q&amp;A pairs from textbook page 6.
                              </p>
                            </div>
                            <span className="badge-coming-soon" style={{ background: 'var(--primary)', color: '#fff' }}>
                              6 Dialogue Pairs
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {LESSON_CONTENT[meta.l].reibun.map(r => (
                              <div
                                key={r.no}
                                style={{
                                  border: '1px solid var(--line-soft)',
                                  borderRadius: '8px',
                                  padding: '14px 16px',
                                  background: '#ffffff'
                                }}
                              >
                                {/* Question */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                  <div style={{ flex: '1 1 auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                      <span style={{ fontWeight: 800, color: 'var(--muted)', fontSize: '13px' }}>{r.no})</span>
                                      <span className="jp" style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--ink)' }}>
                                        {r.q}
                                      </span>
                                    </div>
                                    {r.qRd && r.qRd !== r.q && (
                                      <div className="lesson-furigana jp" style={{ paddingLeft: '18px' }}>
                                        <span className="lesson-furigana-badge">Furigana</span>
                                        <span>{r.qRd}</span>
                                      </div>
                                    )}
                                    {r.qRom && (
                                      <div className="lesson-romaji" style={{ paddingLeft: '18px' }}>
                                        {r.qRom}
                                      </div>
                                    )}
                                    <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px', paddingLeft: '18px' }}>
                                      {r.qMy}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="audio-btn"
                                    onClick={() => speakJapanese(r.qRd || r.q)}
                                    title="Listen Question"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Answer */}
                                <div
                                  style={{
                                    marginTop: '8px',
                                    padding: '8px 12px',
                                    background: 'var(--bg-card-subtle)',
                                    borderRadius: '6px',
                                    borderLeft: '3px solid var(--primary)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '10px'
                                  }}
                                >
                                  <div>
                                    <div className="jp" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>
                                      {r.a}
                                    </div>
                                    {r.aRd && r.aRd !== r.a && (
                                      <div className="lesson-furigana jp">
                                        <span className="lesson-furigana-badge">Furigana</span>
                                        <span>{r.aRd}</span>
                                      </div>
                                    )}
                                    {r.aRom && (
                                      <div className="lesson-romaji">
                                        {r.aRom}
                                      </div>
                                    )}
                                    <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                                      {r.aMy}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className="audio-btn"
                                    onClick={() => speakJapanese(r.aRd || r.a)}
                                    title="Listen Answer"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Optional follow-up (Item 5) */}
                                {r.followUp && (
                                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--line-soft)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                      <div style={{ flex: '1 1 auto' }}>
                                        <div className="jp" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>
                                          {r.followUp.q}
                                        </div>
                                        {r.followUp.qRd && r.followUp.qRd !== r.followUp.q && (
                                          <div className="lesson-furigana jp">
                                            <span className="lesson-furigana-badge">Furigana</span>
                                            <span>{r.followUp.qRd}</span>
                                          </div>
                                        )}
                                        <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                                          {r.followUp.qMy}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        className="audio-btn"
                                        onClick={() => speakJapanese(r.followUp.qRd || r.followUp.q)}
                                        title="Listen Question"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div
                                      style={{
                                        marginTop: '6px',
                                        padding: '8px 12px',
                                        background: 'var(--bg-card-subtle)',
                                        borderRadius: '6px',
                                        borderLeft: '3px solid var(--primary)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '10px'
                                      }}
                                    >
                                      <div>
                                        <div className="jp" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>
                                          {r.followUp.a}
                                        </div>
                                        {r.followUp.aRd && r.followUp.aRd !== r.followUp.a && (
                                          <div className="lesson-furigana jp">
                                            <span className="lesson-furigana-badge">Furigana</span>
                                            <span>{r.followUp.aRd}</span>
                                          </div>
                                        )}
                                        <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                                          {r.followUp.aMy}
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        className="audio-btn"
                                        onClick={() => speakJapanese(r.followUp.aRd || r.followUp.a)}
                                        title="Listen Answer"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="coming-soon-card">
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
                          Lesson {meta.l} Example Sentences (例文・短文)
                        </h4>
                        <p style={{ color: 'var(--muted)', fontSize: '13.5px', maxWidth: '480px', margin: '0 auto 14px', lineHeight: '1.6' }}>
                          Curated example sentences illustrating core particles and sentence patterns for Lesson {meta.l}. Coming soon.
                        </p>
                        <span className="badge-coming-soon">Coming Soon ⏳</span>
                      </div>
                    )
                  )}

                  {/* TAB 4: GRAMMAR NOTES (文法解説) */}
                  {activeStudyTab === 'grammar' && (
                    LESSON_CONTENT[meta.l]?.grammar ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                              第{meta.l}課 文法解説 (Grammar Explanations)
                            </h3>
                            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '3px 0 0' }}>
                              Comprehensive rules, particles, and sentence structures explained in Myanmar.
                            </p>
                          </div>
                          <span className="badge-coming-soon" style={{ background: 'var(--ink)', color: '#fff' }}>
                            7 Grammar Points
                          </span>
                        </div>

                        {LESSON_CONTENT[meta.l].grammar.map(g => (
                          <div
                            key={g.no}
                            style={{
                              background: '#ffffff',
                              border: '1.5px solid var(--line)',
                              borderRadius: 'var(--radius-md)',
                              padding: '18px 20px',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                              <span style={{ background: 'var(--ink)', color: '#ffffff', fontWeight: 900, fontSize: '12px', padding: '2px 8px', borderRadius: '6px' }}>
                                Point {g.no}
                              </span>
                              <span className="jp" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                                {g.title}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}>
                                ({g.titleMy})
                              </span>
                            </div>

                            {/* Formula box */}
                            <div
                              style={{
                                padding: '8px 12px',
                                background: 'var(--bg-card-subtle)',
                                border: '1.5px dashed var(--line)',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                marginBottom: '12px'
                              }}
                            >
                              📐 ပုံသေနည်း (Formula): {g.formula}
                            </div>

                            {/* Explanations */}
                            <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: '1.6', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {g.explanationMy.map((exp, expIdx) => (
                                <div key={expIdx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                                  <span style={{ color: 'var(--primary)', fontWeight: 800 }}>•</span>
                                  <span>{exp}</span>
                                </div>
                              ))}
                            </div>

                            {/* Example Sentences */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
                                နမူနာဝါကျများ (Examples):
                              </span>
                              {g.examples.map((ex, exIdx) => (
                                <div
                                  key={exIdx}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 14px',
                                    background: 'var(--bg-card-subtle)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--line-soft)',
                                    gap: '12px'
                                  }}
                                >
                                  <div style={{ flex: '1 1 auto' }}>
                                    <div className="jp" style={{ fontSize: '15.5px', fontWeight: 800, color: 'var(--ink)' }}>
                                      {ex.jp}
                                    </div>
                                    {ex.rd && ex.rd !== ex.jp && (
                                      <div className="lesson-furigana jp">
                                        <span className="lesson-furigana-badge">Furigana</span>
                                        <span>{ex.rd}</span>
                                      </div>
                                    )}
                                    {ex.rom && (
                                      <div className="lesson-romaji">
                                        {ex.rom}
                                      </div>
                                    )}
                                    <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                                      {ex.my}
                                    </div>
                                    {ex.ans && (
                                      <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '2px', fontWeight: 700 }}>
                                        ➔ {ex.ans}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="audio-btn"
                                    onClick={() => speakJapanese(ex.rd || ex.jp)}
                                    title="Listen Sentence"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="coming-soon-card">
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📝</div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
                          Lesson {meta.l} Grammar Patterns (文法解説)
                        </h4>
                        <p style={{ color: 'var(--muted)', fontSize: '13.5px', maxWidth: '480px', margin: '0 auto 14px', lineHeight: '1.6' }}>
                          Step-by-step grammatical breakdowns with Burmese &amp; English explanations for Lesson {meta.l}. Coming soon.
                        </p>
                        <span className="badge-coming-soon">Coming Soon ⏳</span>
                      </div>
                    )
                  )}

                  {/* TAB 5: CONVERSATIONS (会話) */}
                  {activeStudyTab === 'dialogue' && (
                    LESSON_CONTENT[meta.l]?.kaiwa ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Dialogue Header Card */}
                        <div
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid var(--line)',
                            borderRadius: 'var(--radius-md)',
                            padding: '18px 20px',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ background: 'var(--ink)', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>
                                  {LESSON_CONTENT[meta.l].kaiwa.cd}
                                </span>
                                <span className="word-tag" style={{ fontSize: '11px', fontWeight: 800 }}>
                                  Textbook Page {LESSON_CONTENT[meta.l].kaiwa.page}
                                </span>
                              </div>
                              <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--ink)', margin: 0 }} className="jp">
                                第{meta.l}課 会話: {LESSON_CONTENT[meta.l].kaiwa.title} ({LESSON_CONTENT[meta.l].kaiwa.titleMy})
                              </h3>
                              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '4px 0 0' }}>
                                {LESSON_CONTENT[meta.l].kaiwa.settingMy}
                              </p>
                            </div>
                          </div>

                          {/* Character badges */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                            {LESSON_CONTENT[meta.l].kaiwa.characters.map((c, cIdx) => (
                              <div
                                key={cIdx}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--bg-card-subtle)',
                                  borderRadius: '6px',
                                  border: '1px solid var(--line-soft)',
                                  fontSize: '12px'
                                }}
                              >
                                <span style={{ fontWeight: 800, color: 'var(--ink)' }}>{c.name}:</span>{' '}
                                <span style={{ color: 'var(--muted)' }}>{c.note}</span>
                              </div>
                            ))}
                          </div>

                          {/* Script lines */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                            {LESSON_CONTENT[meta.l].kaiwa.lines.map((line, lIdx) => (
                              <div
                                key={lIdx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '12px',
                                  padding: '12px 14px',
                                  background: line.role === 'C' ? 'rgba(15, 23, 42, 0.03)' : '#ffffff',
                                  borderRadius: '8px',
                                  border: '1px solid var(--line-soft)'
                                }}
                              >
                                <div
                                  style={{
                                    background: line.role === 'A' ? '#0f172a' : line.role === 'B' ? '#334155' : '#475569',
                                    color: '#ffffff',
                                    fontWeight: 900,
                                    fontSize: '12px',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    minWidth: '55px',
                                    textAlign: 'center',
                                    flexShrink: 0
                                  }}
                                >
                                  {line.speaker}
                                </div>
                                <div style={{ flex: '1 1 auto' }}>
                                  <div className="jp" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                                    {line.jp}
                                  </div>
                                  {line.rd && line.rd !== line.jp && (
                                    <div className="lesson-furigana jp">
                                      <span className="lesson-furigana-badge">Furigana</span>
                                      <span>{line.rd}</span>
                                    </div>
                                  )}
                                  {line.rom && (
                                    <div className="lesson-romaji">
                                      {line.rom}
                                    </div>
                                  )}
                                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '3px' }}>
                                    {line.my}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="audio-btn"
                                  onClick={() => speakJapanese(line.rd || line.jp)}
                                  title="Listen Line"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Cultural & usage notes */}
                          <div
                            style={{
                              padding: '12px 16px',
                              background: 'var(--bg-card-subtle)',
                              borderRadius: '8px',
                              borderLeft: '4px solid var(--primary)'
                            }}
                          >
                            <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--ink)', marginBottom: '6px' }}>
                              💡 မိတ်ဆက်ခြင်းဆိုင်ရာ အရေးကြီးသော ယဉ်ကျေးမှုမှတ်စုများ (Cultural Notes):
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--muted)', lineHeight: '1.5' }}>
                              {LESSON_CONTENT[meta.l].kaiwa.culturalNotes.map((note, nIdx) => (
                                <div key={nIdx}>• {note}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="coming-soon-card">
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>🗣️</div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
                          Lesson {meta.l} Dialogue &amp; Conversation (会話)
                        </h4>
                        <p style={{ color: 'var(--muted)', fontSize: '13.5px', maxWidth: '480px', margin: '0 auto 14px', lineHeight: '1.6' }}>
                          Full real-world situational conversations with native audio pacing for Lesson {meta.l}. Coming soon.
                        </p>
                        <span className="badge-coming-soon">Coming Soon ⏳</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* DEDICATED INLINE QUIZ PANEL */}
              {isQuizzing && (
                <div
                  style={{
                    marginTop: '20px',
                    padding: '22px',
                    background: 'var(--bg-card-subtle)',
                    border: '2px solid var(--line)',
                    borderRadius: 'var(--radius-lg)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  {!activeQuiz.finished ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--muted)' }}>
                          Lesson {meta.l} Quiz — Question {activeQuiz.curIndex + 1} of {activeQuiz.questions.length}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--primary)' }}>
                          Score: {activeQuiz.score}
                        </span>
                      </div>

                      <div className="quiz-progress-track">
                        <div
                          className="quiz-progress-bar"
                          style={{
                            width: `${((activeQuiz.curIndex + 1) / activeQuiz.questions.length) * 100}%`
                          }}
                        />
                      </div>

                      <div style={{ textAlign: 'center', margin: '24px 0 20px' }}>
                        <div className="jp" style={{ fontSize: '36px', fontWeight: 900, color: 'var(--ink)' }}>
                          {activeQuiz.questions[activeQuiz.curIndex].jp}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>
                          {activeQuiz.questions[activeQuiz.curIndex].rd && (
                            <span className="jp" style={{ marginRight: '6px' }}>
                              {activeQuiz.questions[activeQuiz.curIndex].rd}
                            </span>
                          )}
                          ({activeQuiz.questions[activeQuiz.curIndex].rom})
                        </div>

                        {/* CLEAN LISTEN BUTTON WITH SVG ICON & TEXT — PROPER PILL SHAPE */}
                        <div style={{ marginTop: '12px' }}>
                          <button
                            type="button"
                            className="audio-pill-btn"
                            onClick={() => speakJapanese(activeQuiz.questions[activeQuiz.curIndex].speakText)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                            <span>Listen Pronunciation</span>
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                        {activeQuiz.questions[activeQuiz.curIndex].options.map((opt, oIdx) => {
                          let btnClass = 'quiz-opt-btn';
                          if (activeQuiz.answered) {
                            if (opt.isCorrect) btnClass += ' correct';
                            else if (activeQuiz.selectedOpt === oIdx) btnClass += ' wrong';
                          }
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              className={btnClass}
                              disabled={activeQuiz.answered}
                              onClick={() => handleQuizSelect(opt, oIdx)}
                              style={{ textAlign: 'left', padding: '14px 16px' }}
                            >
                              <span style={{ fontWeight: 800, fontSize: '14px' }}>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--faint)', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700 }}
                          onClick={() => setActiveQuiz(null)}
                        >
                          ← Exit Quiz
                        </button>

                        {activeQuiz.answered && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={handleQuizNext}
                          >
                            <span>{activeQuiz.curIndex + 1 < activeQuiz.questions.length ? 'Next Question →' : 'View Result →'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <div style={{ fontSize: '42px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px' }}>
                        {activeQuiz.score} / {activeQuiz.questions.length}
                      </div>
                      <div style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>
                        Lesson {meta.l} Quiz Completed!
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '20px' }}>
                        You scored {Math.round((activeQuiz.score / activeQuiz.questions.length) * 100)}% accuracy.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => handleStartLessonQuiz(meta.l)}
                        >
                          Try Again ↺
                        </button>
                        <button
                          type="button"
                          className="lesson-action-btn"
                          onClick={() => setActiveQuiz(null)}
                        >
                          Close Quiz
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
