import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Navigation />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
}
