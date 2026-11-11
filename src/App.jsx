import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HiraganaPage from './pages/HiraganaPage';
import KatakanaPage from './pages/KatakanaPage';
import BasicsPage from './pages/BasicsPage';
import KotobaPage from './pages/KotobaPage';
import QuizPage from './pages/QuizPage';
import LessonsPage from './pages/LessonsPage';

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
