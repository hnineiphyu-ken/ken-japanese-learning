/**
 * KEN JAPANESE LEARNING — COMMON CORE JS
 * Handles Dark/Light Mode, Navigation, Speech Synthesis (Web Speech API ja-JP)
 */

// Theme Management
(function initTheme() {
  const savedTheme = localStorage.getItem('ken_jp_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ken_jp_theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  btn.innerHTML = current === 'dark' 
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
  btn.setAttribute('title', current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  btn.setAttribute('aria-label', current === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
}

// Web Speech API (Japanese TTS)
function speakJapanese(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }
  window.speechSynthesis.cancel(); // Stop any pending utterance
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = 0.88; // Slightly slower for clear learning
  window.speechSynthesis.speak(u);
}

// Utility Helpers
function $(id) {
  return document.getElementById(id);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = x[i];
    x[i] = x[j];
    x[j] = t;
  }
  return x;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcon();
});
