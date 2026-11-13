import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '320px',
        color: 'var(--muted)',
        fontSize: '14px',
        fontWeight: 600
      }}
    >
      Loading...
    </div>
  );
}

export default function Layout() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Navigation />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Footer />
    </>
  );
}
