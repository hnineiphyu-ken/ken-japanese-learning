import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useActiveLevel } from '../utils/useActiveLevel';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);
  const { isN4, isN5, switchLevel } = useActiveLevel();

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
        <NavLink to={isN4 ? "/n4/lessons" : "/n5/hiragana"} className="brand-logo">
          <div className="brand-icon">{isN4 ? '二' : 'あ'}</div>
          <div className="brand-text">
            <span>Ken Japanese</span>
            <span className="sub">
              {isN4 ? 'JLPT N4 · Minna no Nihongo 初級 II' : 'JLPT N5 · Minna no Nihongo 初級 I'}
            </span>
          </div>
        </NavLink>

        {/* Global Level Switcher (N5 ↔ N4) */}
        <div className="header-level-toggle" role="group" aria-label="JLPT Level Selector">
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

        <div className="header-powered">
          <span>Developed by</span>
          <strong className="author-name">Ken Nebula</strong>
        </div>

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

      {/* Mobile Dropdown Navigation Menu */}
      <nav className={`mobile-nav-menu ${mobileOpen ? 'open' : ''}`}>
        {/* Mobile Level Switcher */}
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

        {isN4 ? (
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
