import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-badge">JLPT N5 · 初級</div>
        <div className="footer-powered">
          <span>Powered by</span>
          <strong className="author-name">Ken Nebula</strong>
        </div>
        <p className="footer-sub">
          Japanese Self-Study Platform &bull; JLPT N5 &bull; Minna no Nihongo Syllabus
        </p>
      </div>
    </footer>
  );
}
