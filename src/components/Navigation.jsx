import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <div className="nav-scroller">
      <nav className="main-nav">
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
    </div>
  );
}
