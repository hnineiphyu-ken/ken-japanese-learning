import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MINNA_META } from '../data/topicsData';
import { MINNA } from '../data/wordsData';
import { speakJapanese, shuffle } from '../utils/speech';
import Pagination from '../components/Pagination';

export default function LessonsPage() {
  const navigate = useNavigate();

  // Active expanded lesson for study
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [lessonWordPage, setLessonWordPage] = useState(1);
  const WORDS_PER_PAGE = 15;

  // Active quiz state
  // null | { lessonNum: number, questions: [], curIndex: 0, score: 0, answered: false, selectedOpt: null, finished: false }
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
      setLessonWordPage(1);
      // If quiz was open for this lesson, close it
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
            <div key={meta.l} className="card" style={{ padding: '18px 22px' }}>
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

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`lesson-action-btn ${isStudying ? 'primary' : ''}`}
                    onClick={() => handleToggleStudy(meta.l)}
                  >
                    {isStudying ? 'Hide Words ▴' : '📖 Study Words ▾'}
                  </button>
                  <button
                    type="button"
                    className="lesson-action-btn primary"
                    onClick={() => handleStartLessonQuiz(meta.l)}
                  >
                    🎯 Practice Quiz →
                  </button>
                </div>
              </div>

              {/* EXPANDED VOCABULARY STUDY PANEL */}
              {isStudying && (
                <div
                  style={{
                    marginTop: '18px',
                    paddingTop: '16px',
                    borderTop: '2px solid var(--line-soft)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
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

              {/* DEDICATED INLINE QUIZ PANEL */}
              {isQuizzing && (
                <div
                  style={{
                    marginTop: '18px',
                    padding: '18px',
                    background: 'var(--bg-card-subtle)',
                    border: '2px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  {!activeQuiz.finished ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--muted)' }}>
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

                      <div style={{ textAlign: 'center', margin: '20px 0 16px' }}>
                        <div className="jp" style={{ fontSize: '34px', fontWeight: 900 }}>
                          {activeQuiz.questions[activeQuiz.curIndex].jp}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                          {activeQuiz.questions[activeQuiz.curIndex].rd && (
                            <span className="jp" style={{ marginRight: '6px' }}>
                              {activeQuiz.questions[activeQuiz.curIndex].rd}
                            </span>
                          )}
                          ({activeQuiz.questions[activeQuiz.curIndex].rom})
                        </div>
                        <button
                          type="button"
                          className="audio-btn"
                          style={{ margin: '8px auto 0' }}
                          onClick={() => speakJapanese(activeQuiz.questions[activeQuiz.curIndex].speakText)}
                        >
                          🔊 Listen
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
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
                              style={{ textAlign: 'left', padding: '12px 14px' }}
                            >
                              <span style={{ fontWeight: 800, fontSize: '13.5px' }}>{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--faint)', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
                          onClick={() => setActiveQuiz(null)}
                        >
                          Close Quiz ✕
                        </button>

                        {activeQuiz.answered && (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={handleQuizNext}
                          >
                            {activeQuiz.curIndex + 1 < activeQuiz.questions.length ? 'Next Question →' : 'View Result →'}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <div style={{ fontSize: '38px', fontWeight: 900, color: 'var(--primary)', marginBottom: '6px' }}>
                        {activeQuiz.score} / {activeQuiz.questions.length}
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
                        Lesson {meta.l} Quiz Completed!
                      </div>
                      <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
                        You answered {Math.round((activeQuiz.score / activeQuiz.questions.length) * 100)}% correctly.
                      </p>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
