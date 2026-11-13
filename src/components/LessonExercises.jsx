import React, { useState } from 'react';
import { LESSON_EXERCISES } from '../data/lessonExercises';
import { speakJapanese } from '../utils/speech';

export default function LessonExercises({ lessonNum }) {
  const data = LESSON_EXERCISES[lessonNum];

  // Sub-tabs: 'renshuuA' | 'renshuuB' | 'renshuuC' | 'mondai'
  const [activeSubTab, setActiveSubTab] = useState('renshuuA');

  // Renshuu B selected drill number (1 to 7)
  const [selectedDrillNo, setSelectedDrillNo] = useState(1);

  // Mondai selected question number (1 to 6)
  const [selectedMondaiNo, setSelectedMondaiNo] = useState(1);

  // Answer reveal states: { [key: string]: boolean }
  const [revealedKeys, setRevealedKeys] = useState({});

  function toggleReveal(key) {
    setRevealedKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function revealAll(prefix, count) {
    setRevealedKeys(prev => {
      const next = { ...prev };
      for (let i = 1; i <= count; i++) {
        next[`${prefix}-${i}`] = true;
      }
      return next;
    });
  }

  function hideAll(prefix, count) {
    setRevealedKeys(prev => {
      const next = { ...prev };
      for (let i = 1; i <= count; i++) {
        next[`${prefix}-${i}`] = false;
      }
      return next;
    });
  }

  if (!data) {
    return (
      <div className="coming-soon-card" style={{ marginTop: '14px' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>📚</div>
        <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--ink)' }}>
          Lesson {lessonNum} Exercises (練習・問題)
        </h4>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', maxWidth: '480px', margin: '0 auto 14px', lineHeight: '1.6' }}>
          Textbook exercises (練習 A・B・C and 問題) for Lesson {lessonNum} will be added soon.
        </p>
        <span className="badge-coming-soon">Coming Soon ⏳</span>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '14px' }}>
      {/* Exercise Category Sub-Nav */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '18px',
          padding: '8px',
          background: 'var(--bg-card-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--line-soft)'
        }}
      >
        <button
          type="button"
          className={`lesson-action-btn ${activeSubTab === 'renshuuA' ? 'primary' : ''}`}
          onClick={() => setActiveSubTab('renshuuA')}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          <span>Grammar (練習 A)</span>
        </button>
        <button
          type="button"
          className={`lesson-action-btn ${activeSubTab === 'renshuuB' ? 'primary' : ''}`}
          onClick={() => setActiveSubTab('renshuuB')}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          <span>Drills (練習 B)</span>
        </button>
        <button
          type="button"
          className={`lesson-action-btn ${activeSubTab === 'renshuuC' ? 'primary' : ''}`}
          onClick={() => setActiveSubTab('renshuuC')}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          <span>Dialogues (練習 C)</span>
        </button>
        <button
          type="button"
          className={`lesson-action-btn ${activeSubTab === 'mondai' ? 'primary' : ''}`}
          onClick={() => setActiveSubTab('mondai')}
          style={{ fontSize: '12.5px', padding: '6px 14px' }}
        >
          <span>Review Questions (問題)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: RENSHUU A (GRAMMAR PATTERNS)                  */}
      {/* ======================================================== */}
      {activeSubTab === 'renshuuA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                第1課 練習 A — Grammar Structure Patterns (文法パターン)
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '3px 0 0' }}>
                Sentence structures and substitution formulas from textbook page 31.
              </p>
            </div>
            <span className="badge-coming-soon" style={{ background: 'var(--ink)', color: '#fff' }}>
              6 Core Patterns
            </span>
          </div>

          {data.renshuuA.map((item, idx) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1.5px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span
                  style={{
                    background: 'var(--ink)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  Pattern {idx + 1}
                </span>
                <span className="jp" style={{ fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>
                  {item.pattern}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '14px', lineHeight: '1.5' }}>
                <b>မြန်မာရှင်းလင်းချက်:</b> {item.descMy}
                <br />
                <span style={{ fontSize: '12px', color: 'var(--faint)' }}>{item.descEn}</span>
              </div>

              {/* Example sentences list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'var(--bg-card-subtle)',
                      borderRadius: '8px',
                      border: '1px solid var(--line-soft)',
                      gap: '12px'
                    }}
                  >
                    <div style={{ flex: '1 1 auto' }}>
                      <div className="jp" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>
                        {ex.jp}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                        {ex.my}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="audio-btn"
                      onClick={() => speakJapanese(ex.rd || ex.jp)}
                      title="Listen Sentence"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: RENSHUU B (DRILLS 1 TO 7)                      */}
      {/* ======================================================== */}
      {activeSubTab === 'renshuuB' && (
        <div>
          {/* Character reference overview card */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid var(--line)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
                👤 Character Profiles (ဇာတ်ကောင် အချက်အလက်များ)
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--faint)' }}>
                Used in Exercises 1–7 (Textbook Pages 32–33)
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '8px'
              }}
            >
              {data.characters.map(c => (
                <div
                  key={c.id}
                  style={{
                    padding: '8px 10px',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--line-soft)',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '15px' }}>{c.flag}</span>
                    <span className="jp" style={{ fontWeight: 800, color: 'var(--ink)' }}>
                      {c.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--faint)' }}>({c.age}歳)</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    {c.country} · {c.job}
                  </div>
                  {c.company && (
                    <div style={{ fontSize: '11px', color: 'var(--faint)' }}>
                      🏢 {c.company}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Drill Number Selector Tabs (1 to 7) */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
            {data.renshuuB.map(drill => (
              <button
                key={drill.no}
                type="button"
                className={`lesson-action-btn ${selectedDrillNo === drill.no ? 'primary' : ''}`}
                onClick={() => setSelectedDrillNo(drill.no)}
                style={{ fontSize: '12px', padding: '5px 12px', whiteSpace: 'nowrap' }}
              >
                Drill {drill.no}
              </button>
            ))}
          </div>

          {/* Active Drill Card */}
          {(() => {
            const drill = data.renshuuB.find(d => d.no === selectedDrillNo) || data.renshuuB[0];
            const drillPrefix = `B${drill.no}`;

            return (
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                    {drill.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => revealAll(drillPrefix, drill.items.length)}
                      style={{ fontSize: '11.5px', padding: '3px 8px', background: 'transparent', border: '1px solid var(--line)', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Show All Answers
                    </button>
                    <button
                      type="button"
                      onClick={() => hideAll(drillPrefix, drill.items.length)}
                      style={{ fontSize: '11.5px', padding: '3px 8px', background: 'transparent', border: '1px solid var(--line)', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Hide All
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '6px 0 14px', lineHeight: '1.5' }}>
                  {drill.instruction}
                </p>

                {/* Example (例) */}
                <div
                  style={{
                    background: 'var(--bg-card-subtle)',
                    border: '1.5px dashed var(--line)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>
                      နမူနာ (例) — Prompt: {drill.example.prompt}
                    </span>
                    <button
                      type="button"
                      className="audio-btn"
                      onClick={() => speakJapanese(drill.example.rd || drill.example.jp)}
                      title="Listen Example"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    </button>
                  </div>
                  <div className="jp" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)', marginTop: '4px' }}>
                    {drill.example.jp}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    {drill.example.my}
                  </div>
                </div>

                {/* Numbered Exercise Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {drill.items.map(it => {
                    const itemKey = `${drillPrefix}-${it.num}`;
                    const isRevealed = !!revealedKeys[itemKey];

                    return (
                      <div
                        key={it.num}
                        style={{
                          border: '1px solid var(--line-soft)',
                          borderRadius: '8px',
                          padding: '12px 14px',
                          background: isRevealed ? '#fcfdfd' : '#ffffff'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--muted)' }}>
                              {it.num})
                            </span>
                            <span className="jp" style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                              {it.prompt}
                            </span>
                          </div>

                          <button
                            type="button"
                            className={`lesson-action-btn ${isRevealed ? 'primary' : ''}`}
                            onClick={() => toggleReveal(itemKey)}
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                          >
                            <span>{isRevealed ? 'Hide Answer ▴' : 'Show Answer ▾'}</span>
                          </button>
                        </div>

                        {/* Revealed Answer Box */}
                        {isRevealed && (
                          <div
                            style={{
                              marginTop: '10px',
                              padding: '10px 12px',
                              background: 'var(--bg-card-subtle)',
                              borderRadius: '6px',
                              borderLeft: '4px solid var(--ink)',
                              animation: 'fadeIn 0.15s ease-out'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="jp" style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>
                                {it.answerJp}
                              </span>
                              <button
                                type="button"
                                className="audio-btn"
                                onClick={() => speakJapanese(it.answerRd || it.answerJp)}
                                title="Listen Answer"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                              </button>
                            </div>
                            <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '3px' }}>
                              {it.my}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: RENSHUU C (SHORT DIALOGUES 1 TO 3)            */}
      {/* ======================================================== */}
      {activeSubTab === 'renshuuC' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
              第1課 練習 C — Short Situational Dialogues (会話ドリル)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '3px 0 0' }}>
              Real-world practical conversational exchanges from textbook page 34.
            </p>
          </div>

          {data.renshuuC.map(item => (
            <div
              key={item.no}
              style={{
                background: '#ffffff',
                border: '1.5px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    background: 'var(--ink)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  Dialogue {item.no}
                </span>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--ink)' }}>
                  {item.title}
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 12px' }}>
                {item.descMy}
              </p>

              {/* Base Dialogue Script */}
              <div
                style={{
                  background: 'var(--bg-card-subtle)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  border: '1px solid var(--line-soft)',
                  marginBottom: '14px'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                  စကားပြော မူရင်းပုံစံ (Original Script):
                </div>
                {item.dialogue.map((line, lIdx) => (
                  <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        background: line.role === 'A' ? '#0f172a' : '#475569',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '11px',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        marginTop: '3px'
                      }}
                    >
                      {line.role}
                    </span>
                    <div style={{ flex: '1 1 auto' }}>
                      <div className="jp" style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>
                        {line.jp}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{line.my}</div>
                    </div>
                    <button
                      type="button"
                      className="audio-btn"
                      onClick={() => speakJapanese(line.rd || line.jp)}
                      title="Listen"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Substitutions */}
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--muted)', marginBottom: '8px' }}>
                အစားထိုးလေ့ကျင့်ရန်ပုံစံများ (Substitutions 1 &amp; 2):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {item.substitutions.map(sub => (
                  <div
                    key={sub.num}
                    style={{
                      border: '1.5px dashed var(--line)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      background: '#ffffff'
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--ink)', marginBottom: '6px' }}>
                      {sub.num}) {sub.label}
                    </div>
                    {sub.lines.map((sLine, sIdx) => (
                      <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)' }}>
                          {sLine.role}:
                        </span>
                        <div style={{ flex: '1 1 auto' }}>
                          <div className="jp" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
                            {sLine.jp}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="audio-btn"
                          onClick={() => speakJapanese(sLine.rd || sLine.jp)}
                          title="Listen"
                          style={{ width: '24px', height: '24px' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5L6 9H2v6h4l5 4V5z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: MONDAI (REVIEW QUESTIONS 1 TO 6)               */}
      {/* ======================================================== */}
      {activeSubTab === 'mondai' && (
        <div>
          {/* Question No Selector (1 to 6) */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '16px' }}>
            {data.mondai.map(m => (
              <button
                key={m.no}
                type="button"
                className={`lesson-action-btn ${selectedMondaiNo === m.no ? 'primary' : ''}`}
                onClick={() => setSelectedMondaiNo(m.no)}
                style={{ fontSize: '12px', padding: '5px 12px', whiteSpace: 'nowrap' }}
              >
                Mondai {m.no}
              </button>
            ))}
          </div>

          {/* Active Mondai Card */}
          {(() => {
            const m = data.mondai.find(item => item.no === selectedMondaiNo) || data.mondai[0];
            const mPrefix = `M${m.no}`;

            return (
              <div
                style={{
                  background: '#ffffff',
                  border: '1.5px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
                    {m.title}
                  </h3>
                  {m.items && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => revealAll(mPrefix, m.items.length)}
                        style={{ fontSize: '11.5px', padding: '3px 8px', background: 'transparent', border: '1px solid var(--line)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Show Answers
                      </button>
                      <button
                        type="button"
                        onClick={() => hideAll(mPrefix, m.items.length)}
                        style={{ fontSize: '11.5px', padding: '3px 8px', background: 'transparent', border: '1px solid var(--line)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Hide
                      </button>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '6px 0 14px', lineHeight: '1.5' }}>
                  {m.instruction}
                </p>

                {/* Mondai 1: Self Q&A */}
                {m.no === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {m.items.map(it => {
                      const itemKey = `${mPrefix}-${it.num}`;
                      const isRevealed = !!revealedKeys[itemKey];

                      return (
                        <div
                          key={it.num}
                          style={{
                            border: '1px solid var(--line-soft)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            background: '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, color: 'var(--muted)' }}>{it.num})</span>
                              <span className="jp" style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                                {it.q}
                              </span>
                              <button
                                type="button"
                                className="audio-btn"
                                onClick={() => speakJapanese(it.qRd || it.q)}
                                title="Listen Question"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`lesson-action-btn ${isRevealed ? 'primary' : ''}`}
                              onClick={() => toggleReveal(itemKey)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                            >
                              {isRevealed ? 'Hide' : 'Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-card-subtle)', borderRadius: '6px', borderLeft: '3px solid var(--ink)' }}>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }} className="jp">
                                ➔ {it.sampleAns}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                                {it.my}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mondai 2: Situation Match */}
                {m.no === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {m.items.map((it, idx) => {
                      const itemKey = `${mPrefix}-${idx + 1}`;
                      const isRevealed = !!revealedKeys[itemKey];

                      return (
                        <div
                          key={idx}
                          style={{
                            border: '1px solid var(--line-soft)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            background: '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: '1 1 auto' }}>
                              <span style={{ fontWeight: 800, color: 'var(--muted)', marginTop: '2px' }}>{it.num})</span>
                              <div>
                                <div className="jp" style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>
                                  {it.dialogue}
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                                  {it.meaningMy}
                                </div>
                              </div>
                              <button
                                type="button"
                                className="audio-btn"
                                onClick={() => speakJapanese(it.dialogueRd || it.dialogue)}
                                title="Listen Script"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                </svg>
                              </button>
                            </div>
                            <button
                              type="button"
                              className={`lesson-action-btn ${isRevealed ? 'primary' : ''}`}
                              onClick={() => toggleReveal(itemKey)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                            >
                              {isRevealed ? 'Hide' : 'Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-card-subtle)', borderRadius: '6px', borderLeft: '3px solid var(--ink)' }}>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>
                                ✅ အဖြေမှန်: {it.correctOption}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mondai 3: True / False */}
                {m.no === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {m.items.map(it => {
                      const itemKey = `${mPrefix}-${it.num}`;
                      const isRevealed = !!revealedKeys[itemKey];

                      return (
                        <div
                          key={it.num}
                          style={{
                            border: '1px solid var(--line-soft)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            background: '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                            <div style={{ flex: '1 1 auto' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 800, color: 'var(--muted)' }}>{it.num})</span>
                                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--faint)' }}>Conversation:</span>
                                <button
                                  type="button"
                                  className="audio-btn"
                                  onClick={() => speakJapanese(it.dialogueRd || it.dialogue)}
                                  title="Listen Conversation"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                  </svg>
                                </button>
                              </div>
                              <div className="jp" style={{ fontSize: '13.5px', color: 'var(--ink)', margin: '4px 0 6px', whiteSpace: 'pre-line', background: 'var(--bg-card-subtle)', padding: '6px 10px', borderRadius: '6px' }}>
                                {it.dialogue}
                              </div>
                              <div className="jp" style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--ink)' }}>
                                {it.statement}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                                {it.statementMy}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`lesson-action-btn ${isRevealed ? 'primary' : ''}`}
                              onClick={() => toggleReveal(itemKey)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                            >
                              {isRevealed ? 'Hide' : 'Check'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-card-subtle)', borderRadius: '6px', borderLeft: `4px solid ${it.isCorrect ? '#16a34a' : '#dc2626'}` }}>
                              <div style={{ fontSize: '14px', fontWeight: 900, color: it.isCorrect ? '#16a34a' : '#dc2626' }}>
                                Result: {it.symbol} ({it.isCorrect ? 'မှန်ပါသည်' : 'မှားယွင်းပါသည်'})
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                                {it.reasonMy}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mondai 4: Question Word Fill-in */}
                {m.no === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {m.items.map(it => {
                      const itemKey = `${mPrefix}-${it.num}`;
                      const isRevealed = !!revealedKeys[itemKey];

                      return (
                        <div
                          key={it.num}
                          style={{
                            border: '1px solid var(--line-soft)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            background: '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 800, color: 'var(--muted)' }}>{it.num})</span>
                                <span className="jp" style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)' }}>
                                  {it.q}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                                {it.options.map((opt, oIdx) => (
                                  <span key={oIdx} style={{ fontSize: '11.5px', background: 'var(--bg-card-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--line-soft)' }}>
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              className={`lesson-action-btn ${isRevealed ? 'primary' : ''}`}
                              onClick={() => toggleReveal(itemKey)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                            >
                              {isRevealed ? 'Hide' : 'Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-card-subtle)', borderRadius: '6px', borderLeft: '3px solid var(--ink)' }}>
                              <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--ink)' }}>
                                ✅ အဖြေမှန်: <span className="jp">{it.ans}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                                {it.my}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mondai 5: Particle Practice */}
                {m.no === 5 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {m.items.map(it => {
                      const itemKey = `${mPrefix}-${it.num}`;
                      const isRevealed = !!revealedKeys[itemKey];

                      return (
                        <div
                          key={it.num}
                          style={{
                            border: '1px solid var(--line-soft)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            background: '#ffffff'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, color: 'var(--muted)' }}>{it.num})</span>
                              <span className="jp" style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)' }}>
                                {it.q}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={`lesson-action-btn ${isRevealed ? 'primary' : ''}`}
                              onClick={() => toggleReveal(itemKey)}
                              style={{ fontSize: '11px', padding: '3px 8px' }}
                            >
                              {isRevealed ? 'Hide' : 'Answer'}
                            </button>
                          </div>
                          {isRevealed && (
                            <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--bg-card-subtle)', borderRadius: '6px', borderLeft: '3px solid var(--ink)' }}>
                              <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--ink)' }}>
                                ✅ အဖြေမှန် ဝိဘတ်: <span className="jp">{it.ans}</span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                                {it.my}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mondai 6: Self-Introduction Writing Template */}
                {m.no === 6 && (
                  <div
                    style={{
                      border: '1.5px solid var(--line)',
                      borderRadius: '8px',
                      padding: '16px',
                      background: 'var(--bg-card-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {m.template.map((row, rIdx) => (
                        <div key={rIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--line-soft)' }}>
                          <div>
                            <div className="jp" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>
                              {row.jp}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                              {row.my}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="audio-btn"
                            onClick={() => speakJapanese(row.rd || row.jp)}
                            title="Listen"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 5L6 9H2v6h4l5 4V5z" />
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
