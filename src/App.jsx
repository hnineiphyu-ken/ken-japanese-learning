import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

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
        <Route index element={<HiraganaPage />} />
        <Route path="katakana" element={<KatakanaPage />} />
        <Route path="basics" element={<BasicsPage />} />
        <Route path="kotoba" element={<KotobaPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="lessons" element={<LessonsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
