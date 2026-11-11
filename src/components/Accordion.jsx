import React, { useState } from 'react';

export default function Accordion({ jp, title, desc, defaultOpen = false, children, isSub = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`collapse ${isSub ? 'sub' : ''} ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="collapse-head"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
      >
        {jp && <span className="ch-jp jp">{jp}</span>}
        <span className="ch-t">
          <span className="ct">{title}</span>
          {desc && <span className="cd">{desc}</span>}
        </span>
        <span className="ch-chev" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && <div className="collapse-body">{children}</div>}
    </section>
  );
}
