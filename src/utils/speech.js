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

    const u = new SpeechSynthesisUtterance(cleanText);
    u.lang = 'ja-JP';
    u.rate = 0.88;

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
