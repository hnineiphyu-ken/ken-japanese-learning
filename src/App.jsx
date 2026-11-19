import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const HiraganaPage = lazy(() => import('./pages/HiraganaPage'));
const KatakanaPage = lazy(() => import('./pages/KatakanaPage'));
const BasicsPage = lazy(() => import('./pages/BasicsPage'));
const KotobaPage = lazy(() => import('./pages/KotobaPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const LessonsPage = lazy(() => import('./pages/LessonsPage'));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Root Level Portal */}
        <Route index element={<LandingPage />} />

        {/* JLPT N5 Scope (初級 1 · Lessons 1–25) */}
        <Route path="n5">
          <Route index element={<HiraganaPage />} />
          <Route path="hiragana" element={<HiraganaPage />} />
          <Route path="katakana" element={<KatakanaPage />} />
          <Route path="basics" element={<BasicsPage />} />
          <Route path="kotoba" element={<KotobaPage level="n5" />} />
          <Route path="quiz" element={<QuizPage level="n5" />} />
          <Route path="lessons" element={<LessonsPage level="n5" />} />
        </Route>

        {/* JLPT N4 Scope (初級 2 · Lessons 26–50) */}
        <Route path="n4">
          <Route index element={<Navigate to="lessons" replace />} />
          <Route path="lessons" element={<LessonsPage level="n4" />} />
          <Route path="kotoba" element={<KotobaPage level="n4" />} />
          <Route path="quiz" element={<QuizPage level="n4" />} />
        </Route>

        {/* Backward Compatibility Legacy Redirects */}
        <Route path="hiragana" element={<Navigate to="/n5/hiragana" replace />} />
        <Route path="katakana" element={<Navigate to="/n5/katakana" replace />} />
        <Route path="basics" element={<Navigate to="/n5/basics" replace />} />
        <Route path="kotoba" element={<Navigate to="/n5/kotoba" replace />} />
        <Route path="quiz" element={<Navigate to="/n5/quiz" replace />} />
        <Route path="lessons" element={<Navigate to="/n5/lessons" replace />} />

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/n5" replace />} />
      </Route>
    </Routes>
  );
}
