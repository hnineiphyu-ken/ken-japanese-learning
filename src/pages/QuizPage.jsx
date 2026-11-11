import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KANA_ROWS, DAKUTEN, YOON } from '../data/kanaData';
import { WORDS } from '../data/wordsData';
import { BASIC_COUNT, COUNTERS, GREETINGS } from '../data/topicsData';
import { speakJapanese, shuffle } from '../utils/speech';

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const queryType = searchParams.get('type') || 'kana';
  const queryLesson = searchParams.get('lesson') || '';

  // Settings
  const [quizType, setQuizType] = useState(queryType);
  const [scriptType, setScriptType] = useState('hiragana');
  const [questionCount, setQuestionCount] = useState(20);
  const [selectedLesson, setSelectedLesson] = useState(queryLesson || 'all');

  // Quiz running state
  const [quizState, setQuizState] = useState('setup'); // 'setup' | 'playing' | 'result'
  const [questions, setQuestions] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);

  useEffect(() => {
    if (queryLesson) {
      setQuizType('kotoba');
      setSelectedLesson(queryLesson);
    }
  }, [queryLesson]);

  function generateQuiz() {
    let pool = [];

    if (quizType === 'kana') {
      const basicList = [];
      KANA_ROWS.forEach(r => {
        r.items.forEach(it => {
          if (it) basicList.push({ hira: it[0], kata: it[1], rom: it[2] });
        });
      });
      DAKUTEN.forEach(it => {
        basicList.push({ hira: it[0], kata: it[1], rom: it[2] });
      });

      pool = basicList.map(item => {
        const char = scriptType === 'katakana' ? item.kata : item.hira;
        return {
          prompt: char,
          sub: scriptType === 'katakana' ? 'Katakana' : 'Hiragana',
          speakText: char,
          correctAnswer: item.rom,
          allPool: basicList.map(b => b.rom)
        };
      });
    } else if (quizType === 'kotoba') {
      let wordSubset = WORDS;
      if (selectedLesson !== 'all') {
        const lNum = parseInt(selectedLesson, 10);
        wordSubset = WORDS.filter(w => w.l === lNum);
        if (wordSubset.length < 5) wordSubset = WORDS;
      }

      pool = wordSubset.map(w => ({
        prompt: w.jp,
        sub: `${w.rd || ''} ${w.rom ? '(' + w.rom + ')' : ''}`,
        speakText: w.rd || w.jp,
        correctAnswer: `${w.en} · ${w.my}`,
        shortAnswer: w.en,
        allPool: wordSubset.map(item => `${item.en} · ${item.my}`)
      }));
    } else {
      // Basics pool
      const basicsList = [
        ...BASIC_COUNT.map(r => ({ prompt: r[1], sub: r[2], speakText: r[1], ans: `${r[3]} · ${r[4]}` })),
        ...COUNTERS.flatMap(c => c.rows.map(r => ({ prompt: r[1], sub: `${r[2]} (${c.name || c.en})`, speakText: r[1], ans: `${r[3]} · ${r[4]}` }))),
        ...GREETINGS.map(g => ({ prompt: g.jp, sub: g.rom, speakText: g.jp, ans: `${g.en} · ${g.my}` }))
      ];

      pool = basicsList.map(b => ({
        prompt: b.prompt,
        sub: b.sub,
        speakText: b.speakText,
        correctAnswer: b.ans,
        allPool: basicsList.map(item => item.ans)
      }));
    }

    const shuffled = shuffle(pool);
    const count = Math.min(questionCount, shuffled.length);
    const quizList = [];

    for (let i = 0; i < count; i++) {
      const target = shuffled[i];
      const wrongList = shuffle(target.allPool.filter(a => a !== target.correctAnswer)).slice(0, 3);
      const options = shuffle([
        { text: target.correctAnswer, isCorrect: true },
        ...wrongList.map(w => ({ text: w, isCorrect: false }))
      ]);

      quizList.push({
        prompt: target.prompt,
        sub: target.sub,
        speakText: target.speakText,
        options
      });
    }

    setQuestions(quizList);
    setCurIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOpt(null);
    setQuizState('playing');

    if (quizList[0]) {
      speakJapanese(quizList[0].speakText);
    }
  }

  function handleSelect(opt, idx) {
    if (answered) return;
    setAnswered(true);
    setSelectedOpt(idx);
    if (opt.isCorrect) {
      setScore(s => s + 1);
    }
  }

  function handleNext() {
    if (curIndex + 1 < questions.length) {
      const nextIdx = curIndex + 1;
      setCurIndex(nextIdx);
      setAnswered(false);
      setSelectedOpt(null);
      speakJapanese(questions[nextIdx].speakText);
    } else {
      setQuizState('result');
    }
  }

  const currentQ = questions[curIndex];

  return (
    <div>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-tag">Practice &amp; Testing</div>
        <h1 className="hero-title">Interactive Quiz (練習問題)</h1>
        <p className="hero-desc">
          Challenge your Japanese memory with customizable multiple choice questions. Tap audio speaker anytime to hear native pronunciation.
        </p>
      </div>

      {/* SETUP CARD */}
      {quizState === 'setup' && (
        <section className="card" style={{ maxWidth: '620px', margin: '0 auto' }}>
          <div className="quiz-card-head" style={{ borderBottom: '2px solid var(--line-soft)', paddingBottom: '14px', marginBottom: '22px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              Customize Your Quiz
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              Select target skill, question volume, and options
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '8px' }}>
                Quiz Type (問題の種類)
              </label>
              <select
                className="custom-select"
                value={quizType}
                onChange={e => setQuizType(e.target.value)}
              >
                <option value="kana">Kana (Hiragana &amp; Katakana)</option>
                <option value="kotoba">Kotoba (1,445 Vocabulary Words)</option>
                <option value="basics">Basics (Numbers, Counters, Greetings)</option>
              </select>
            </div>

            {quizType === 'kana' && (
              <div>
                <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '8px' }}>
                  Script (文字)
                </label>
                <select
                  className="custom-select"
                  value={scriptType}
                  onChange={e => setScriptType(e.target.value)}
                >
                  <option value="hiragana">Hiragana (ひらがな)</option>
                  <option value="katakana">Katakana (カタカナ)</option>
                </select>
              </div>
            )}

            {quizType === 'kotoba' && (
              <div>
                <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '8px' }}>
                  Lesson Scope (課)
                </label>
                <select
                  className="custom-select"
                  value={selectedLesson}
                  onChange={e => setSelectedLesson(e.target.value)}
                >
                  <option value="all">All Lessons (1–25)</option>
                  {Array.from({ length: 25 }, (_, i) => i + 1).map(l => (
                    <option key={l} value={l}>
                      Minna no Nihongo Lesson {l} (第{l}課)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '8px' }}>
                Questions Count (問題数)
              </label>
              <select
                className="custom-select"
                value={questionCount}
                onChange={e => setQuestionCount(parseInt(e.target.value, 10))}
              >
                <option value={10}>10 Questions</option>
                <option value={20}>20 Questions</option>
                <option value={30}>30 Questions</option>
                <option value={50}>50 Questions</option>
              </select>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '12px', fontSize: '15px' }}
              onClick={generateQuiz}
            >
              Start Quiz Now →
            </button>
          </div>
        </section>
      )}

      {/* PLAYING CARD */}
      {quizState === 'playing' && currentQ && (
        <section className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--muted)' }}>
              Question {curIndex + 1} of {questions.length}
            </span>
            <span style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--primary)', background: 'var(--primary-faint)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>
              Score: {score}
            </span>
          </div>

          <div className="quiz-progress-track">
            <div
              className="quiz-progress-bar"
              style={{ width: `${((curIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div style={{ textAlign: 'center', margin: '26px 0 20px' }}>
            <div className="jp" style={{ fontSize: '38px', fontWeight: 900, color: 'var(--ink)' }}>
              {currentQ.prompt}
            </div>
            {currentQ.sub && (
              <div style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px', fontWeight: 600 }}>
                {currentQ.sub}
              </div>
            )}
            <button
              type="button"
              className="audio-btn"
              style={{ margin: '12px auto 0' }}
              onClick={() => speakJapanese(currentQ.speakText)}
            >
              🔊 Play Audio
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {currentQ.options.map((opt, idx) => {
              let btnClass = 'quiz-opt-btn';
              if (answered) {
                if (opt.isCorrect) btnClass += ' correct';
                else if (selectedOpt === idx) btnClass += ' wrong';
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={btnClass}
                  disabled={answered}
                  onClick={() => handleSelect(opt, idx)}
                  style={{ textAlign: 'left', padding: '12px 14px' }}
                >
                  <span style={{ fontWeight: 800, fontSize: '14px' }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--faint)', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}
              onClick={() => setQuizState('setup')}
            >
              ← End Quiz
            </button>

            {answered && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
              >
                {curIndex + 1 < questions.length ? 'Next Question →' : 'View Results →'}
              </button>
            )}
          </div>
        </section>
      )}

      {/* RESULT CARD */}
      {quizState === 'result' && (
        <section className="card" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', padding: '36px 20px' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--primary)', marginBottom: '8px' }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginBottom: '8px' }}>
            {score === questions.length ? '🌟 Perfect Score! အပြည့်အဝ တတ်မြောက်သွားပါပြီ!' : score >= questions.length * 0.7 ? '🎉 Great Job! တော်တော်လေး ကောင်းမွန်ပါတယ်!' : 'Keep practicing! ထပ်မံ လေ့ကျင့်ပါဦး!'}
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '24px' }}>
            You scored {Math.round((score / questions.length) * 100)}% accuracy.
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={generateQuiz}
            >
              Try Again ↺
            </button>
            <button
              type="button"
              className="lesson-action-btn"
              onClick={() => setQuizState('setup')}
            >
              Change Settings ⚙
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
