import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { WORDS, MINNA, CATS } from '../data/wordsData';
import { WORDS_N4, MINNA_N4, CATS_N4 } from '../data/wordsDataN4';
import { speakJapanese } from '../utils/speech';
import { useActiveLevel } from '../utils/useActiveLevel';

export default function KotobaPage({ level: propLevel }) {
  const { isN4: hookIsN4 } = useActiveLevel();
  const isN4 = propLevel ? propLevel.toLowerCase() === 'n4' : hookIsN4;

  const [searchParams, setSearchParams] = useSearchParams();
  const initialLesson = searchParams.get('lesson') || 'all';
  const initialCat = searchParams.get('cat') || 'All';

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedLesson, setSelectedLesson] = useState(initialLesson);
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;

  // Active dataset partition based on route level
  const activeWords = isN4 ? WORDS_N4 : WORDS;
  const activeMinna = isN4 ? MINNA_N4 : MINNA;
  const activeCats = isN4 ? CATS_N4 : CATS;
  const lessonStart = isN4 ? 26 : 1;
  const lessonEnd = isN4 ? 50 : 25;
  const lessonList = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => i + lessonStart);
  }, [lessonStart]);

  // Sync if URL query param changes or level switches
  useEffect(() => {
    const qLesson = searchParams.get('lesson');
    if (qLesson) {
      const num = parseInt(qLesson, 10);
      if (num >= lessonStart && num <= lessonEnd) {
        setSelectedLesson(qLesson);
      } else {
        setSelectedLesson('all');
      }
      setPage(1);
    } else {
      setSelectedLesson('all');
    }

    const qCat = searchParams.get('cat');
    if (qCat && activeCats.includes(qCat)) {
      setSelectedCat(qCat);
      setPage(1);
    } else {
      setSelectedCat('All');
    }
  }, [searchParams, isN4, lessonStart, lessonEnd, activeCats]);

  // Filter words
  const filteredWords = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sourcePool = selectedLesson !== 'all' ? activeMinna : activeWords;

    return sourcePool.filter(w => {
      // Lesson filter
      if (selectedLesson !== 'all') {
        const lNum = parseInt(selectedLesson, 10);
        if (w.l !== lNum) return false;
      }
      // Category filter (only applies when all lessons selected)
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
  }, [search, selectedCat, selectedLesson, activeWords, activeMinna]);

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
        <div className="hero-tag">
          {isN4 ? 'JLPT N4 Lexicon · 初級 II' : 'JLPT N5 Lexicon · 初級 I'}
        </div>
        <h1 className="hero-title">
          Kotoba Vocabulary (単語) — {isN4 ? 'JLPT N4' : 'JLPT N5'}
        </h1>
        <p className="hero-desc">
          {isN4
            ? '918 essential JLPT N4 and Minna no Nihongo Shokyu 2 (Lessons 26–50) words with Kanji, Furigana reading, Romaji, English and Myanmar translations. Click speaker icon for instant audio pronunciation.'
            : '1,523 essential JLPT N5 and Minna no Nihongo Shokyu 1 (Lessons 1–25) words with Kanji, Furigana reading, Romaji, English and Myanmar translations. Click speaker icon for instant audio pronunciation.'}
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
          {activeCats.map(c => (
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
          style={{ flex: '1 1 180px' }}
        >
          <option value="all">
            {isN4 ? 'All Lessons (26–50)' : 'All Lessons (1–25)'}
          </option>
          {lessonList.map(l => (
            <option key={l} value={l}>
              Lesson {l} (第{l}課)
            </option>
          ))}
        </select>
      </div>

      {/* Result counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '13px', color: 'var(--muted)', fontWeight: 700 }}>
        <span>Showing {filteredWords.length} {isN4 ? 'N4' : 'N5'} words found</span>
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
              {w.l && (
                <span className="word-tag" style={{ background: isN4 ? '#e0e7ff' : 'var(--primary-faint)', color: isN4 ? '#4338ca' : 'var(--primary)' }}>
                  L{w.l}
                </span>
              )}
              {w.cat && <span className="word-tag">{w.cat}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentWords.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--line)' }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--muted)' }}>
            No {isN4 ? 'N4' : 'N5'} words matched your search or filter.
          </p>
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
