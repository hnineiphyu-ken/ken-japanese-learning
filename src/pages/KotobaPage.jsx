import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { WORDS, MINNA, CATS } from '../data/wordsData';
import { speakJapanese } from '../utils/speech';

export default function KotobaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialLesson = searchParams.get('lesson') || 'all';
  const initialCat = searchParams.get('cat') || 'All';

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedLesson, setSelectedLesson] = useState(initialLesson);
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;

  // Sync if URL query param changes
  useEffect(() => {
    const qLesson = searchParams.get('lesson');
    if (qLesson) {
      setSelectedLesson(qLesson);
      setPage(1);
    }
    const qCat = searchParams.get('cat');
    if (qCat) {
      setSelectedCat(qCat);
      setPage(1);
    }
  }, [searchParams]);

  // Filter words
  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sourcePool = selectedLesson !== 'all' ? MINNA : WORDS;

    return sourcePool.filter(w => {
      // Lesson filter
      if (selectedLesson !== 'all') {
        const lNum = parseInt(selectedLesson, 10);
        if (w.l !== lNum) return false;
      }
      // Category filter (only applies to WORDS)
      if (selectedLesson === 'all' && selectedCat !== 'All') {
        if (w.cat !== selectedCat) return false;
      }
      // Search text
      if (q) {
        const matchJp = w.jp && w.jp.toLowerCase().includes(q);
        const matchRd = w.rd && w.rd.toLowerCase().includes(q);
        const matchRom = w.rom && w.rom.toLowerCase().includes(q);
        const matchEn = w.en && w.en.toLowerCase().includes(q);
        const matchMy = w.my && w.my.toLowerCase().includes(q);
        if (!matchJp && !matchRd && !matchRom && !matchEn && !matchMy) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedCat, selectedLesson]);

  const totalPages = Math.max(1, Math.ceil(filteredWords.length / PER_PAGE));

  // Reset page when filters change
  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleCatChange(e) {
    setSelectedCat(e.target.value);
    setPage(1);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (e.target.value === 'All') p.delete('cat');
      else p.set('cat', e.target.value);
      return p;
    });
  }

  function handleLessonChange(e) {
    setSelectedLesson(e.target.value);
    setPage(1);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (e.target.value === 'all') p.delete('lesson');
      else p.set('lesson', e.target.value);
      return p;
    });
  }

  const currentWords = filteredWords.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Core Lexicon</div>
        <h1 className="hero-title">Kotoba Vocabulary (単語)</h1>
        <p className="hero-desc">
          1,445 essential JLPT N5 and Minna no Nihongo (Lessons 1–25) words with Kanji, Furigana reading, Romaji, English and Myanmar translations. Click speaker icon for instant audio pronunciation.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-bar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search Kanji, Hiragana, Romaji, English, or Myanmar..."
          value={search}
          onChange={handleSearchChange}
          style={{ flex: '1 1 240px' }}
        />

        {/* Category dropdown */}
        <select
          className="custom-select"
          value={selectedCat}
          onChange={handleCatChange}
          style={{ flex: '1 1 180px' }}
        >
          {CATS.map(c => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>

        {/* Lesson dropdown */}
        <select
          className="custom-select"
          value={selectedLesson}
          onChange={handleLessonChange}
          style={{ flex: '1 1 160px' }}
        >
          <option value="all">All Lessons (1–25)</option>
          {Array.from({ length: 25 }, (_, i) => i + 1).map(l => (
            <option key={l} value={l}>
              Lesson {l} (第{l}課)
            </option>
          ))}
        </select>
      </div>

      {/* Result counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '13px', color: 'var(--muted)', fontWeight: 700 }}>
        <span>Showing {filteredWords.length} words found</span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Words Grid */}
      <div className="word-grid">
        {currentWords.map((w, idx) => (
          <div key={idx} className="word-card">
            <div className="word-top">
              <div>
                <div className="word-jp jp">{w.jp}</div>
                {w.rd && w.rd !== w.jp && <div className="word-rd jp">{w.rd}</div>}
                <div className="word-rom">{w.rom}</div>
              </div>
              <button
                type="button"
                className="audio-btn"
                onClick={() => speakJapanese(w.rd || w.jp)}
                title="Listen Pronunciation"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </button>
            </div>

            <div className="word-trans">
              <div className="word-en">{w.en}</div>
              <div className="word-my">{w.my}</div>
            </div>

            <div className="word-tags" style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              {w.l && <span className="word-tag" style={{ background: 'var(--primary-faint)', color: 'var(--primary)' }}>L{w.l}</span>}
              {w.cat && <span className="word-tag">{w.cat}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentWords.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--line)' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--muted)' }}>No words matched your search or filter.</p>
          <button
            type="button"
            className="btn-primary"
            style={{ marginTop: '12px' }}
            onClick={() => {
              setSearch('');
              setSelectedCat('All');
              setSelectedLesson('all');
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={page}
        onPageChange={p => setPage(p)}
      />
    </div>
  );
}
