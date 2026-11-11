import React from 'react';

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = [];

  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <div className="pager">
      <button
        type="button"
        className="pager-btn"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>

      {start > 1 && (
        <>
          <button type="button" className="pager-btn" onClick={() => onPageChange(1)}>
            1
          </button>
          {start > 2 && <span style={{ color: 'var(--faint)', padding: '0 4px' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          type="button"
          className={`pager-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: 'var(--faint)', padding: '0 4px' }}>…</span>}
          <button type="button" className="pager-btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="pager-btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
}
