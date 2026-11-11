import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const headerRef = useRef(null);

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
        <NavLink to="/" className="brand-logo">
          <div className="brand-icon">あ</div>
          <div className="brand-text">
            <span>Ken Japanese</span>
            <span className="sub">JLPT N5 &amp; Minna no Nihongo</span>
          </div>
        </NavLink>
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
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <span className="nav-jp">あ</span> Hiragana
        </NavLink>
        <NavLink to="/katakana" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-jp">ア</span> Katakana
        </NavLink>
        <NavLink to="/basics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-jp">基</span> Basics
        </NavLink>
        <NavLink to="/kotoba" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-jp">語</span> Kotoba (Vocab)
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-jp">問</span> Quiz
        </NavLink>
        <NavLink to="/lessons" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-jp">課</span> Lessons (1-25)
        </NavLink>
      </nav>
    </header>
  );
}
