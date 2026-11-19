import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useActiveLevel } from '../utils/useActiveLevel';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const { isN4, isN5, switchLevel } = useActiveLevel();

  const isLanding = location.pathname === '/' || location.pathname === '';

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        {/* Brand Logo on Left */}
        <NavLink to="/" className="brand-logo" title="Ken Japanese Learning Portal">
          <div className="brand-icon">{isLanding ? '日' : (isN4 ? '二' : 'あ')}</div>
          <div className="brand-text">
            <span>Ken Japanese</span>
            <span className="sub">
              {isLanding
                ? 'JLPT Learning Portal · Course & Level Track'
                : (isN4 ? 'JLPT N4 · Minna no Nihongo 初級 II' : 'JLPT N5 · Minna no Nihongo 初級 I')}
            </span>
          </div>
        </NavLink>

        {/* Desktop Center Actions */}
        {!isLanding ? (
          <div className="header-level-toggle desktop-only" role="group" aria-label="JLPT Level Selector">
            <button
              type="button"
              className={`level-btn ${isN5 ? 'active' : ''}`}
              onClick={() => switchLevel('n5')}
              title="Switch to JLPT N5 (初級 1 · Lessons 1–25)"
            >
              <span className="lvl-badge">N5</span>
              <span className="lvl-name">初級 1</span>
            </button>
            <button
              type="button"
              className={`level-btn ${isN4 ? 'active' : ''}`}
              onClick={() => switchLevel('n4')}
              title="Switch to JLPT N4 (初級 2 · Lessons 26–50)"
            >
              <span className="lvl-badge">N4</span>
              <span className="lvl-name">初級 2</span>
            </button>
          </div>
        ) : (
          <div className="portal-indicator-pill desktop-only">
            <span className="portal-dot"></span>
            <span>All Courses</span>
          </div>
        )}

        <div className="header-powered desktop-only">
          <span>Developed by</span>
          <strong className="author-name">Ken Nebula</strong>
        </div>

        {/* Right Action Cluster (Always right-aligned together) */}
        <div className="header-right-cluster">
          {!isLanding && (
            <NavLink
              to="/"
              className="header-portal-btn"
              title="Return to Level Selection Portal"
            >
              <span className="portal-icon">⌂</span>
              <span className="portal-text">Portal</span>
            </NavLink>
          )}

          {/* Mobile & Tablet Hamburger Button */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      <nav className={`mobile-nav-menu ${mobileOpen ? 'open' : ''}`}>
        {/* Mobile Return to Portal button */}
        {!isLanding && (
          <div className="mobile-portal-action-row">
            <NavLink
              to="/"
              className="mobile-portal-back-btn"
              onClick={() => setMobileOpen(false)}
            >
              <div className="mpb-left">
                <span className="mpb-icon">⌂</span>
                <div>
                  <div className="mpb-title">Return to Course Portal</div>
                  <div className="mpb-sub">Select Level · N5 or N4 Tracks</div>
                </div>
              </div>
              <span className="mpb-arrow">→</span>
            </NavLink>
          </div>
        )}

        {/* Mobile Level Switcher */}
        {!isLanding && (
          <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'center' }}>
            <div className="header-level-toggle" style={{ width: '100%', maxWidth: '280px', justifyContent: 'center' }}>
              <button
                type="button"
                className={`level-btn ${isN5 ? 'active' : ''}`}
                onClick={() => switchLevel('n5')}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span className="lvl-badge">N5</span>
                <span className="lvl-name">初級 1</span>
              </button>
              <button
                type="button"
                className={`level-btn ${isN4 ? 'active' : ''}`}
                onClick={() => switchLevel('n4')}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span className="lvl-badge">N4</span>
                <span className="lvl-name">初級 2</span>
              </button>
            </div>
          </div>
        )}

        {isLanding ? (
          <div className="mobile-landing-nav-group">
            <div className="mobile-nav-heading">Select Course Track</div>
            <NavLink to="/n5/lessons" className="nav-item">
              <span className="nav-jp">五</span> <strong>JLPT N5</strong> · Lessons 1–25
            </NavLink>
            <NavLink to="/n4/lessons" className="nav-item">
              <span className="nav-jp">四</span> <strong>JLPT N4</strong> · Lessons 26–50
            </NavLink>
            <NavLink to="/n5/kotoba" className="nav-item">
              <span className="nav-jp">語</span> N5 Kotoba (1,523 Words)
            </NavLink>
            <NavLink to="/n4/kotoba" className="nav-item">
              <span className="nav-jp">語</span> N4 Kotoba (918 Words)
            </NavLink>
          </div>
        ) : isN4 ? (
          <>
            <NavLink to="/n4/lessons" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">課</span> Lessons (26–50)
            </NavLink>
            <NavLink to="/n4/kotoba" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">語</span> Kotoba (918 Vocab)
            </NavLink>
            <NavLink to="/n4/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">問</span> Quiz (N4)
            </NavLink>
            <NavLink to="/n5/basics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">基</span> N5 Basics
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/n5/hiragana" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">あ</span> Hiragana
            </NavLink>
            <NavLink to="/n5/katakana" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">ア</span> Katakana
            </NavLink>
            <NavLink to="/n5/basics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">基</span> Basics
            </NavLink>
            <NavLink to="/n5/kotoba" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">語</span> Kotoba (Vocab)
            </NavLink>
            <NavLink to="/n5/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">問</span> Quiz
            </NavLink>
            <NavLink to="/n5/lessons" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <span className="nav-jp">課</span> Lessons (1–25)
            </NavLink>
          </>
        )}
        <div className="mobile-nav-footer">
          <span>Developed by <strong>Ken Nebula</strong></span>
        </div>
      </nav>
    </header>
  );
}
