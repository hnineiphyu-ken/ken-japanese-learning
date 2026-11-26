import React from 'react';
import { KANJI_RUBY_MAP } from '../data/kanjiRubyMap.js';

const HAS_KANJI_RE = /[\u4e00-\u9faf々]/;

function kataToHira(str) {
  return str.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Sort keys longest-first so multi-Kanji compounds match before single Kanji fallbacks
const SORTED_KEYS = Object.keys(KANJI_RUBY_MAP).sort((a, b) => b.length - a.length);
const KANJI_REGEX = new RegExp(`(${SORTED_KEYS.map(escapeRegExp).join('|')})`, 'g');

/**
 * Splits a text segment into literal kana/symbol nodes and <ruby> Kanji stem nodes
 * whenever literal non-Kanji characters in `text` align cleanly with `reading`.
 * Returns null when alignment cannot be verified so callers can fall back to KANJI_RUBY_MAP.
 */
function alignSegments(text, reading, keyPrefix) {
  if (!text || !reading || /[\/／]/.test(reading)) return null;
  const normReading = kataToHira(reading);

  const tokens = [];
  let pos = 0;
  while (pos < text.length) {
    const rest = text.slice(pos);
    const kanjiMatch = rest.match(/^[\u4e00-\u9faf々]+/);
    if (kanjiMatch) {
      tokens.push({ isKanji: true, text: kanjiMatch[0] });
      pos += kanjiMatch[0].length;
    } else {
      const litMatch = rest.match(/^[^\u4e00-\u9faf々]+/);
      tokens.push({ isKanji: false, text: litMatch[0], hira: kataToHira(litMatch[0]) });
      pos += litMatch[0].length;
    }
  }

  let rStart = 0;
  let tStart = 0;
  const leading = [];
  if (tokens.length > 0 && !tokens[0].isKanji) {
    if (!normReading.startsWith(tokens[0].hira)) return null;
    leading.push(tokens[0].text);
    rStart = tokens[0].hira.length;
    tStart = 1;
  }

  let rEnd = normReading.length;
  let tEnd = tokens.length;
  const trailing = [];
  if (tEnd > tStart && !tokens[tEnd - 1].isKanji) {
    const tail = tokens[tEnd - 1];
    if (!normReading.slice(rStart).endsWith(tail.hira)) return null;
    trailing.push(tail.text);
    rEnd -= tail.hira.length;
    tEnd--;
  }

  const midTokens = tokens.slice(tStart, tEnd);
  const midReading = normReading.slice(rStart, rEnd);
  if (midTokens.length === 0 || !midReading) return null;

  const nodes = [...leading];
  let cur = 0;
  for (let i = 0; i < midTokens.length; i++) {
    const tok = midTokens[i];
    if (!tok.isKanji) continue;
    const nextLit = i + 1 < midTokens.length ? midTokens[i + 1] : null;
    if (!nextLit) {
      const furigana = midReading.slice(cur);
      if (!furigana) return null;
      nodes.push(<ruby key={`${keyPrefix}-${i}`}>{tok.text}<rt>{furigana}</rt></ruby>);
      cur = midReading.length;
    } else {
      const foundAt = midReading.indexOf(nextLit.hira, cur + 1);
      if (foundAt === -1) return null;
      const furigana = midReading.slice(cur, foundAt);
      if (!furigana) return null;
      nodes.push(<ruby key={`${keyPrefix}-${i}`}>{tok.text}<rt>{furigana}</rt></ruby>);
      nodes.push(nextLit.text);
      cur = foundAt + nextLit.hira.length;
    }
  }

  if (cur !== midReading.length) return null;
  nodes.push(...trailing);
  return nodes;
}

/**
 * Renders Japanese text with <ruby><rt> Furigana above Kanji characters.
 * Accepts an optional exact `reading` (e.g. Kotoba `w.rd`) to override ambiguous lookup entries.
 */
export default function RubyText({ text, reading = '', className = '' }) {
  if (!text) return null;

  if (!HAS_KANJI_RE.test(text)) {
    return <span className={className}>{text}</span>;
  }

  if (reading) {
    const exactNodes = alignSegments(text, reading, 'ex');
    if (exactNodes) {
      return <span className={`ruby-sentence ${className}`}>{exactNodes}</span>;
    }
  }

  const parts = [];
  let lastIndex = 0;
  let match;
  let idx = 0;

  KANJI_REGEX.lastIndex = 0;
  while ((match = KANJI_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const matchedKanji = match[0];
    const furigana = KANJI_RUBY_MAP[matchedKanji];
    const aligned = alignSegments(matchedKanji, furigana, `m${idx}`);
    if (aligned) {
      parts.push(...aligned);
    } else {
      parts.push(
        <ruby key={`m${idx}`}>
          {matchedKanji}
          <rt>{furigana}</rt>
        </ruby>
      );
    }
    idx++;
    lastIndex = KANJI_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={`ruby-sentence ${className}`}>{parts}</span>;
}
