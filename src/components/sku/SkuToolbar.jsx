import { useState, useEffect, useRef } from 'react';
import { SKU_ROWS_INITIAL } from '../../data/skus.js';

const ALL_CATS = [...new Set(SKU_ROWS_INITIAL.map(s => s.cat))];

export default function SkuToolbar({ skuSearch, categoryFilter, onSkuSearchChange, onCategoryChange, resultCount }) {
  const [catDropOpen, setCatDropOpen] = useState(false);
  const [search, setSearch] = useState('');
  // pending: explicit set of checked cats (always full list when "all selected")
  const [pending, setPending] = useState(ALL_CATS);
  const dropRef = useRef(null);

  function openDrop() {
    // initialise from current filter: [] means all
    setPending(categoryFilter.length === 0 ? ALL_CATS : [...categoryFilter]);
    setSearch('');
    setCatDropOpen(true);
  }

  useEffect(() => {
    if (!catDropOpen) return;
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setCatDropOpen(false);
    }
    setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [catDropOpen]);

  const filteredCats = ALL_CATS.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  const allChecked = pending.length === ALL_CATS.length;
  const someChecked = pending.length > 0 && pending.length < ALL_CATS.length;

  function toggleCat(cat) {
    setPending(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  function handleSelectAll(e) {
    setPending(e.target.checked ? ALL_CATS : []);
  }

  function handleApply() {
    // empty array = no filter (all), otherwise pass selected cats
    onCategoryChange(pending.length === ALL_CATS.length ? [] : pending);
    setCatDropOpen(false);
  }

  function handleClear() {
    setPending([]);
  }

  const activeCount = categoryFilter.length;
  const catLabel = activeCount > 0 ? `Category (${activeCount})` : 'Category';
  const isActive = activeCount > 0;

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
        className={`filter-select${isActive ? ' active' : ''}`}
        ref={dropRef}
        onClick={() => !catDropOpen && openDrop()}
        style={{ position: 'relative' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span>{catLabel}</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>

        {catDropOpen && (
          <div className="cat-dropdown" onClick={e => e.stopPropagation()}>
            {/* Search */}
            <div className="cat-dropdown-search">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                autoFocus
                type="text"
                placeholder="Search in filters"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Select all */}
            <div className="cat-dropdown-item cat-dropdown-select-all">
              <label>
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked; }}
                  onChange={handleSelectAll}
                />
                Select all
              </label>
            </div>

            {/* Category list */}
            <div className="cat-dropdown-list">
              {filteredCats.map(cat => (
                <div key={cat} className="cat-dropdown-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={pending.includes(cat)}
                      onChange={() => toggleCat(cat)}
                    />
                    {cat}
                  </label>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cat-dropdown-footer">
              <button className="cat-dropdown-clear" onClick={handleClear}>Clear All</button>
              <button className="cat-dropdown-apply" onClick={handleApply}>Apply</button>
            </div>
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
