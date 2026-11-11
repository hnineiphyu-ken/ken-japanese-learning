/**
 * KEN JAPANESE LEARNING — COMMON CORE JS
 * Speech Synthesis (Web Speech API ja-JP) & Global Helpers
 */

function speakJapanese(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = 0.88;
  window.speechSynthesis.speak(u);
}

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

function renderPager(el, pages, cur, cb) {
  if (!el) return;
  if (pages <= 1) {
    el.innerHTML = "";
    return;
  }
  let h = '';
  h += '<button class="pager-btn" ' + (cur <= 1 ? 'disabled' : '') + ' data-page="' + (cur - 1) + '">‹</button>';
  let start = Math.max(1, cur - 2);
  let end = Math.min(pages, cur + 2);
  if (start > 1) {
    h += '<button class="pager-btn" data-page="1">1</button>';
    if (start > 2) h += '<span style="color:var(--faint);padding:0 2px">…</span>';
  }
  for (let p = start; p <= end; p++) {
    h += '<button class="pager-btn' + (p === cur ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
  }
  if (end < pages) {
    if (end < pages - 1) h += '<span style="color:var(--faint);padding:0 2px">…</span>';
    h += '<button class="pager-btn" data-page="' + pages + '">' + pages + '</button>';
  }
  h += '<button class="pager-btn" ' + (cur >= pages ? 'disabled' : '') + ' data-page="' + (cur + 1) + '">›</button>';
  el.innerHTML = h;

  el.querySelectorAll(".pager-btn").forEach(function(b) {
    b.addEventListener("click", function() {
      if (b.disabled) return;
      cb(parseInt(b.getAttribute("data-page"), 10));
    });
  });
}

function toggleMobileNav() {
  const menu = $('mobileNavMenu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

document.addEventListener('click', function(e) {
  const menu = $('mobileNavMenu');
  const btn = document.querySelector('.hamburger-btn');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
      menu.classList.remove('open');
    }
  }
});
