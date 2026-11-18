import React from 'react';
import { NavLink } from 'react-router-dom';
import { useActiveLevel } from '../utils/useActiveLevel';

export default function Navigation() {
  const { isN4 } = useActiveLevel();

  return (
    <div className="nav-scroller">
      <nav className="main-nav">
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
      </nav>
    </div>
  );
}
