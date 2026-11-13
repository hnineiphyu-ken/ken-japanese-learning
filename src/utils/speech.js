/**
 * Web Speech API - Japanese Pronunciation Helper
 */

let cachedVoice = null;

function getJapaneseVoice() {
  if (cachedVoice) return cachedVoice;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find(v => /^ja/i.test(v.lang)) ||
    voices.find(v => /japanese|日本語/i.test(v.name)) ||
    null;
  return cachedVoice;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getJapaneseVoice();
  };
}

// Explicit phonetic normalization map for irregular Japanese date & number readings
const PHONETIC_MAP = {
  '1日': 'ついたち', '１日': 'ついたち',
  '2日': 'ふつか', '２日': 'ふつか',
  '3日': 'みっか', '３日': 'みっか',
  '4日': 'よっか', '４日': 'よっか',
  '5日': 'いつか', '５日': 'いつか',
  '6日': 'むいか', '６日': 'むいか',
  '7日': 'なのか', '７日': 'なのか',
  '8日': 'ようか', '８日': 'ようか',
  '9日': 'ここのか', '９日': 'ここのか',
  '10日': 'とおか', '１０日': 'とおか',
  '14日': 'じゅうよっか', '１４日': 'じゅうよっか',
  '20日': 'はつか', '２０日': 'はつか',
  '24日': 'にじゅうよっか', '２４日': 'にじゅうよっか'
};

export function speakJapanese(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }
  if (!text) return;
  try {
    window.speechSynthesis.cancel();

    // Clean text: strip leading/trailing tildes, brackets, extra symbols
    let cleanText = String(text)
      .replace(/^[～~]/, '')
      .replace(/[～~]$/, '')
      .replace(/\[(.*?)\]/g, '$1')
      .replace(/\((.*?)\)/g, '$1')
      .trim();

    if (!cleanText) return;

    // Check if whole text or exact word matches irregular phonetic map
    if (PHONETIC_MAP[cleanText]) {
      cleanText = PHONETIC_MAP[cleanText];
    }

    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = 'ja-JP';
    // Slightly relaxed rate for crystal-clear syllable enunciation (prevents slurring muika into mikka)
    u.rate = cleanText === 'むいか' || cleanText === 'みっか' ? 0.82 : 0.86;

    const voice = getJapaneseVoice();
    if (voice) {
      u.voice = voice;
    }

    window.speechSynthesis.speak(u);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
