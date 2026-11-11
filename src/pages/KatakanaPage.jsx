import React from 'react';
import Accordion from '../components/Accordion';
import { KANA_ROWS, DAKUTEN, YOON, SPECIAL_KATA } from '../data/kanaData';
import { speakJapanese } from '../utils/speech';

export default function KatakanaPage() {
  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Kana Foundation</div>
        <h1 className="hero-title">Katakana (カタカナ)</h1>
        <p className="hero-desc">
          Used primarily for loanwords from foreign languages, scientific names, onomatopoeia, and technical terminology. Tap any character card to hear native Japanese audio pronunciation.
        </p>
      </div>

      {/* 1. Main Katakana 46 Characters */}
      <Accordion
        jp="ア"
        title="Basic 46 Characters (五十音)"
        desc="5 Vowels + 9 Consonant rows in Katakana script"
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
                    onClick={() => speakJapanese(kata)}
                    title={`Listen ${kata} (${rom})`}
                  >
                    <span className="kana-jp jp">{kata}</span>
                    <span className="kana-sub">{hira}</span>
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
        jp="ガ"
        title="Voiced & Semi-Voiced Sounds (濁音・半濁音 ゛゜)"
        desc="G, Z, D, B and P sounds in Katakana"
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
                onClick={() => speakJapanese(kata)}
                title={`Listen ${kata} (${rom})`}
              >
                <span className="kana-jp jp">{kata}</span>
                <span className="kana-sub">{hira}</span>
                <span className="kana-rom">{rom}</span>
              </button>
            );
          })}
        </div>
      </Accordion>

      {/* 3. Contracted Sounds (Yoon) */}
      <Accordion
        jp="キャ"
        title="Contracted Sounds (拗音 - YOON: ャ・ュ・ョ)"
        desc="Katakana compound sounds"
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
                  onClick={() => speakJapanese(kata)}
                  title={`Listen ${kata} (${rom})`}
                >
                  <span className="kana-jp jp">{kata}</span>
                  <span className="kana-sub">{hira}</span>
                  <span className="kana-rom">{rom}</span>
                </button>
              );
            })
          )}
        </div>
      </Accordion>

      {/* 4. Special Katakana for Foreign Words */}
      <Accordion
        jp="ファ"
        title="Special Foreign Katakana (特別なカタカナ)"
        desc="Fa, Fi, Fe, Fo, She, Che, Ti, Di and loanword combinations"
        defaultOpen={false}
      >
        <div className="kana-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))' }}>
          {SPECIAL_KATA.map((item, idx) => {
            const [, kata, rom] = item;
            return (
              <button
                key={idx}
                type="button"
                className="kana-card"
                onClick={() => speakJapanese(kata)}
                title={`Listen ${kata} (${rom})`}
              >
                <span className="kana-jp jp">{kata}</span>
                <span className="kana-sub">-</span>
                <span className="kana-rom">{rom}</span>
              </button>
            );
          })}
        </div>
      </Accordion>

      {/* 5. Katakana Long Vowel Mark */}
      <Accordion
        jp="ー"
        title="Katakana Long Vowel Mark (長音符 ー)"
        desc="The dash symbol (ー) extends the vowel for loanwords"
        defaultOpen={false}
      >
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '14px', lineHeight: '1.6' }}>
          In Katakana, long vowels are written with a straight horizontal dash mark <b>ー</b> (Chouonpu).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
          {[
            ['コーヒー', 'koohii', 'coffee', 'ကော်ဖီ'],
            ['ケーキ', 'keeki', 'cake', 'ကိတ်မုန့်'],
            ['タクシー', 'takushii', 'taxi', 'တက္ကစီ'],
            ['スーパー', 'suupaa', 'supermarket', 'စူပါမားကတ်'],
            ['パーティー', 'paatii', 'party', 'ပါတီ'],
            ['エレベーター', 'erebeetaa', 'elevator', 'ဓာတ်လှေကား']
          ].map(([kata, rom, en, my], idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => speakJapanese(kata)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: '#ffffff',
                border: '1.5px solid var(--line)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <div className="jp" style={{ fontWeight: 800, fontSize: '16px' }}>{kata}</div>
                <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>{rom}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{en} · {my}</div>
              </div>
              <span style={{ color: 'var(--faint)', fontSize: '16px' }}>🔊</span>
            </button>
          ))}
        </div>
      </Accordion>
    </div>
  );
}
