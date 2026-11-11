import React from 'react';
import Accordion from '../components/Accordion';
import { KANA_ROWS, DAKUTEN, YOON, LONG_VOWELS } from '../data/kanaData';
import { speakJapanese } from '../utils/speech';

export default function HiraganaPage() {
  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Kana Foundation</div>
        <h1 className="hero-title">Hiragana (ひらがな)</h1>
        <p className="hero-desc">
          The basic phonetic alphabet of Japanese. Tap any character card to hear native Japanese audio pronunciation.
        </p>
      </div>

      {/* 1. Main Hiragana 46 Characters */}
      <Accordion
        jp="あ"
        title="Basic 46 Characters (五十音)"
        desc="5 Vowels + 9 Consonant rows (K, S, T, N, H, M, Y, R, W + n)"
        defaultOpen={true}
      >
        {KANA_ROWS.map((row, idx) => (
          <div key={idx} className="kana-row">
            {row.label && <div className="kana-row-label">{row.label}</div>}
            <div className="kana-grid">
              {row.items.map((item, cIdx) => {
                if (!item) {
                  return <div key={cIdx} className="kana-card empty" />;
                }
                const [hira, kata, rom] = item;
                return (
                  <button
                    key={cIdx}
                    type="button"
                    className="kana-card"
                    onClick={() => speakJapanese(hira)}
                    title={`Listen ${hira} (${rom})`}
                  >
                    <span className="kana-jp jp">{hira}</span>
                    <span className="kana-sub">{kata}</span>
                    <span className="kana-rom">{rom}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </Accordion>

      {/* 2. Dakuten & Handakuten */}
      <Accordion
        jp="が"
        title="Voiced & Semi-Voiced Sounds (濁音・半濁音 ゛゜)"
        desc="G, Z, D, B (tenten ゛) and P (maru ゜) sounds"
        defaultOpen={false}
      >
        <div className="kana-grid">
          {DAKUTEN.map((item, idx) => {
            const [hira, kata, rom] = item;
            return (
              <button
                key={idx}
                type="button"
                className="kana-card"
                onClick={() => speakJapanese(hira)}
                title={`Listen ${hira} (${rom})`}
              >
                <span className="kana-jp jp">{hira}</span>
                <span className="kana-sub">{kata}</span>
                <span className="kana-rom">{rom}</span>
              </button>
            );
          })}
        </div>
      </Accordion>

      {/* 3. Contracted Sounds (Yoon) */}
      <Accordion
        jp="きゃ"
        title="Contracted Sounds (拗音 - YOON: ゃ・ゅ・ょ)"
        desc="Compound sounds formed with small ya, yu, yo"
        defaultOpen={false}
      >
        <div className="kana-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))' }}>
          {YOON.flatMap((group, gIdx) =>
            group.map((item, cIdx) => {
              const [hira, kata, rom] = item;
              return (
                <button
                  key={`${gIdx}-${cIdx}`}
                  type="button"
                  className="kana-card"
                  onClick={() => speakJapanese(hira)}
                  title={`Listen ${hira} (${rom})`}
                >
                  <span className="kana-jp jp">{hira}</span>
                  <span className="kana-sub">{kata}</span>
                  <span className="kana-rom">{rom}</span>
                </button>
              );
            })
          )}
        </div>
      </Accordion>

      {/* 4. Long Vowels */}
      <Accordion
        jp="長音"
        title="Long Vowels (長音・ちょうおん)"
        desc="Rules and high-frequency example vocabulary"
        defaultOpen={false}
      >
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '16px', lineHeight: '1.6' }}>
          A long vowel is held one extra beat. When vowels continue, the first vowel stretches.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {LONG_VOWELS.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--line-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--primary)' }}>{item.rule}</span>
                <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{item.note}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                {item.ex.map((ex, eIdx) => (
                  <button
                    key={eIdx}
                    type="button"
                    onClick={() => speakJapanese(ex[0])}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#ffffff',
                      border: '1.5px solid var(--line)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div className="jp" style={{ fontWeight: 800, fontSize: '15px' }}>{ex[0]}</div>
                      <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>{ex[1]}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{ex[2]} · {ex[3]}</div>
                    </div>
                    <span style={{ color: 'var(--faint)', fontSize: '16px' }}>🔊</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
