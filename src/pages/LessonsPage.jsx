import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MINNA_META } from '../data/topicsData';
import { MINNA } from '../data/wordsData';
import { speakJapanese, shuffle } from '../utils/speech';
import Pagination from '../components/Pagination';
import LessonExercises from '../components/LessonExercises';
import { LESSON_EXERCISES } from '../data/lessonExercises';

export default function LessonsPage() {
  const navigate = useNavigate();

  // Active expanded lesson for study: number | null
  const [expandedLesson, setExpandedLesson] = useState(null);
  // Active study tab inside expanded lesson: 'vocab' | 'sentences' | 'grammar' | 'dialogue'
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

  function handleToggleStudy(lessonNum) {
    if (expandedLesson === lessonNum) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(lessonNum);
      setActiveStudyTab('vocab');
      setLessonWordPage(1);
      // Close quiz if it was open for this lesson
      if (activeQuiz && activeQuiz.lessonNum === lessonNum) {
        setActiveQuiz(null);
      }
    }
  }

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
            <b>Minna no Nihongo N5 Syllabus Roadmap:</b> All 1,068 vocabulary words are live. <b>Lesson 1 Complete Exercises (練習 A・B・C &amp; 問題)</b> are now 100% active with interactive self-testing &amp; pronunciation! Further lesson exercises will be added progressively.
          </div>
          <span className="badge-coming-soon" style={{ background: '#16a34a', color: '#ffffff' }}>Lesson 1 Active ✅</span>
        </div>
      </div>

      {/* Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MINNA_META.map(meta => {
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
                  {/* Category Tabs: Vocabulary vs Exercises vs Sentences vs Grammar vs Dialogue */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <button
                      type="button"
                      className={`lesson-action-btn ${activeStudyTab === 'vocab' ? 'primary' : ''}`}
                      onClick={() => setActiveStudyTab('vocab')}
                      style={{ fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      Vocabulary ({count})
                    </button>
                    <button
                      type="button"
                      className={`lesson-action-btn ${activeStudyTab === 'exercises' ? 'primary' : ''}`}
                      onClick={() => setActiveStudyTab('exercises')}
                      style={{ fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      <span>Exercises (練習・問題)</span>
                      {LESSON_EXERCISES[meta.l] ? (
                        <span className="badge-coming-soon" style={{ marginLeft: '6px', background: '#16a34a', color: '#ffffff' }}>
                          Live ✅
                        </span>
                      ) : (
                        <span className="badge-coming-soon" style={{ marginLeft: '6px' }}>Soon</span>
                      )}
                    </button>
                    <button
                      type="button"
                      className={`lesson-action-btn ${activeStudyTab === 'sentences' ? 'primary' : ''}`}
                      onClick={() => setActiveStudyTab('sentences')}
                      style={{ fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      Sentences (例文) <span className="badge-coming-soon" style={{ marginLeft: '4px' }}>Soon</span>
                    </button>
                    <button
                      type="button"
                      className={`lesson-action-btn ${activeStudyTab === 'grammar' ? 'primary' : ''}`}
                      onClick={() => setActiveStudyTab('grammar')}
                      style={{ fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      Grammar Notes (文法) <span className="badge-coming-soon" style={{ marginLeft: '4px' }}>Soon</span>
                    </button>
                    <button
                      type="button"
                      className={`lesson-action-btn ${activeStudyTab === 'dialogue' ? 'primary' : ''}`}
                      onClick={() => setActiveStudyTab('dialogue')}
                      style={{ fontSize: '12.5px', padding: '6px 14px' }}
                    >
                      Conversations (会話) <span className="badge-coming-soon" style={{ marginLeft: '4px' }}>Soon</span>
                    </button>
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
                                {w.jp}
                                {w.rd && w.rd !== w.jp && (
                                  <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)' }}>
                                    {w.rd}
                                  </span>
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

                  {/* TAB 3: SENTENCES (COMING SOON) */}
                  {activeStudyTab === 'sentences' && (
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
                  )}

                  {/* TAB 4: GRAMMAR NOTES (COMING SOON) */}
                  {activeStudyTab === 'grammar' && (
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
                  )}

                  {/* TAB 5: CONVERSATIONS (COMING SOON) */}
                  {activeStudyTab === 'dialogue' && (
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
