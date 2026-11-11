import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MINNA_META } from '../data/topicsData';
import { WORDS } from '../data/wordsData';

export default function LessonsPage() {
  const navigate = useNavigate();

  // Pre-calculate count of words per lesson
  const lessonCounts = useMemo(() => {
    const counts = {};
    WORDS.forEach(w => {
      if (w.l) counts[w.l] = (counts[w.l] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Structured Coursework</div>
        <h1 className="hero-title">Minna no Nihongo Lessons 1–25 (第1課〜第25課)</h1>
        <p className="hero-desc">
          Complete Shokyu 1 syllabus. Study vocabulary by lesson, listen to individual word pronunciations, or launch a dedicated practice quiz for each chapter.
        </p>
      </div>

      {/* Lesson List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {MINNA_META.map(meta => {
          const count = lessonCounts[meta.l] || 0;
          return (
            <div
              key={meta.l}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                padding: '16px 20px'
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
                    justifyContent: 'center'
                  }}
                >
                  L{meta.l}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span className="jp" style={{ fontWeight: 800, fontSize: '17px', color: 'var(--ink)' }}>
                      {meta.jp}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}>
                      {meta.t}
                    </span>
                    <span className="word-tag" style={{ background: 'var(--primary-faint)', color: 'var(--primary)', fontWeight: 800 }}>
                      {count} words
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--faint)', marginTop: '2px' }}>
                    {meta.d}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="lesson-action-btn"
                  onClick={() => navigate(`/kotoba?lesson=${meta.l}`)}
                >
                  Study Words
                </button>
                <button
                  type="button"
                  className="lesson-action-btn primary"
                  onClick={() => navigate(`/quiz?type=kotoba&lesson=${meta.l}`)}
                >
                  Practice Quiz →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
