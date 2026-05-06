import { useState, useEffect, useRef } from 'react';
import { SKU_ROWS_INITIAL } from '../../data/skus.js';

const ALL_CATS = ['All', ...new Set(SKU_ROWS_INITIAL.map(s => s.cat))];

export default function SkuToolbar({ skuSearch, categoryFilter, onSkuSearchChange, onCategoryChange, resultCount }) {
  const [catDropOpen, setCatDropOpen] = useState(false);
  const catBtnRef = useRef(null);

  useEffect(() => {
    if (!catDropOpen) return;
    function handleClick(e) {
      if (catBtnRef.current && !catBtnRef.current.contains(e.target)) {
        setCatDropOpen(false);
      }
    }
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [catDropOpen]);

  const catLabel = categoryFilter === 'All' || !categoryFilter ? 'Category' : categoryFilter;

  return (
    <div className="table-toolbar">
      <div className="search-input-wrap">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input
          type="text"
          placeholder="Search SKU Name or SKU ID…"
          value={skuSearch}
          onChange={e => onSkuSearchChange(e.target.value)}
        />
      </div>

      <div
        className={`filter-select${(categoryFilter && categoryFilter !== 'All') ? ' active' : ''}`}
        ref={catBtnRef}
        onClick={() => setCatDropOpen(p => !p)}
        style={{ position: 'relative' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span>{catLabel}</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>

        {catDropOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 999,
            background: '#fff', border: '1px solid #D4D4D4', borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,.12)', minWidth: '160px', padding: '4px 0', fontSize: '13px',
          }}>
            {ALL_CATS.map(c => (
              <div
                key={c}
                onClick={(e) => { e.stopPropagation(); onCategoryChange(c); setCatDropOpen(false); }}
                style={{ padding: '8px 14px', cursor: 'pointer', color: '#3D3D3D' }}
                onMouseEnter={e => e.currentTarget.style.background = '#ECEAFD'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                {c}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-spacer"></div>
      <span className="result-count">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
      <button className="btn-export">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export
      </button>
    </div>
  );
}
