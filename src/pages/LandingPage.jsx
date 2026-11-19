import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page-container">
      {/* Hero Welcome Banner */}
      <section className="portal-hero">
        <span className="portal-kanji-tag">日本語学習ポータル · JAPANESE LEARNING PORTAL</span>
        <h1 className="portal-title">Master Japanese with Clarity &amp; Purpose</h1>
        <p className="portal-desc">
          Choose your target JLPT level to enter your dedicated coursework, vocabulary lexicon, and interactive drills with authentic furigana and native audio.
        </p>
      </section>

      {/* Track Selection Section */}
      <section className="portal-tracks-section">
        <div className="portal-section-header">
          <span className="section-title-label">Select Your Learning Track (コースを選択)</span>
        </div>

        <div className="portal-tracks-grid">
          {/* N5 TRACK CARD */}
          <div className="portal-track-card n5-card">
            <div className="portal-watermark">五</div>
            <div className="card-header-row">
              <div className="track-level-pill n5-pill">JLPT N5 · 初級 1</div>
              <span className="track-status-badge n5-status">Live 100% ✅</span>
            </div>

            <h2 className="track-card-title">Minna no Nihongo I</h2>
            <div className="track-card-subtitle">Beginner Foundation · Lessons 1 through 25</div>
            <p className="track-card-desc">
              Master fundamental sentence patterns, Hiragana, Katakana, daily situational conversations, and 1,523 essential vocabulary words.
            </p>

            <div className="track-stats-grid">
              <div className="stat-box">
                <span className="stat-number">25</span>
                <span className="stat-caption">Lessons</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">1,523</span>
                <span className="stat-caption">Kotoba</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">780</span>
                <span className="stat-caption">Ruby Map</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-caption">Native Audio</span>
              </div>
            </div>

            <Link to="/n5/lessons" className="portal-enter-btn n5-btn">
              <span>Enter N5 Track</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <div className="track-quick-links">
              <Link to="/n5/lessons" className="quick-chip">課 L1–25</Link>
              <Link to="/n5/kotoba" className="quick-chip">語 Vocab</Link>
              <Link to="/n5/quiz" className="quick-chip">問 Quiz</Link>
              <Link to="/n5/hiragana" className="quick-chip">あ Kana</Link>
            </div>
          </div>

          {/* N4 TRACK CARD */}
          <div className="portal-track-card n4-card">
            <div className="portal-watermark">四</div>
            <div className="card-header-row">
              <div className="track-level-pill n4-pill">JLPT N4 · 初級 2</div>
              <span className="track-status-badge n4-status">Live 100% ✅</span>
            </div>

            <h2 className="track-card-title">Minna no Nihongo II</h2>
            <div className="track-card-subtitle">Pre-Intermediate · Lessons 26 through 50</div>
            <p className="track-card-desc">
              Advance into potential verbs, conditionals (〜たら・〜ば), giving &amp; receiving favors, passive, causation, and keigo.
            </p>

            <div className="track-stats-grid">
              <div className="stat-box">
                <span className="stat-number">25</span>
                <span className="stat-caption">Lessons</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">918</span>
                <span className="stat-caption">Kotoba</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">Full</span>
                <span className="stat-caption">Coursework</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">100%</span>
                <span className="stat-caption">Drills &amp; Key</span>
              </div>
            </div>

            <Link to="/n4/lessons" className="portal-enter-btn n4-btn">
              <span>Enter N4 Track</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <div className="track-quick-links">
              <Link to="/n4/lessons" className="quick-chip">課 L26–50</Link>
              <Link to="/n4/kotoba" className="quick-chip">語 Vocab</Link>
              <Link to="/n4/quiz" className="quick-chip">問 Quiz</Link>
              <Link to="/n5/basics" className="quick-chip">基 N5 Basics</Link>
            </div>
          </div>
        </div>

        {/* FUTURE EXPANSION ROADMAP CARD */}
        <div className="portal-roadmap-card">
          <div className="roadmap-left">
            <span className="roadmap-pill">JLPT N3 · N2 · N1</span>
            <div>
              <h3 className="roadmap-title">Intermediate &amp; Advanced Tracks</h3>
              <p className="roadmap-sub">Chukyu Coursework, Authentic Reading &amp; Advanced Grammar Roadmap</p>
            </div>
          </div>
          <span className="roadmap-badge">Future Expansion 🚀</span>
        </div>
      </section>

      {/* Architecture Highlights Strip */}
      <section className="portal-highlights-strip">
        <div className="highlight-item">
          <div className="highlight-icon">💎</div>
          <div className="highlight-text">
            <strong>Strict Dataset Isolation</strong>
            <span>N5 and N4 vocabulary and lessons never mix or clutter your workspace.</span>
          </div>
        </div>
        <div className="highlight-item">
          <div className="highlight-icon">🌸</div>
          <div className="highlight-text">
            <strong>Authentic Japanese Ruby</strong>
            <span>780+ Kanji entries rendered with native furigana annotations directly above.</span>
          </div>
        </div>
        <div className="highlight-item">
          <div className="highlight-icon">🔊</div>
          <div className="highlight-text">
            <strong>Native Audio Speech</strong>
            <span>Instant Web Speech API pronunciation for all vocabulary and quiz sentences.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
