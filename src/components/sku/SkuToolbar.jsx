import { useState, useEffect, useRef } from 'react';
import { SKU_ROWS_INITIAL, CAT_CODES, SKU_PART_CONFIG } from '../../data/skus.js';

const ALL_CATS = [...new Set(SKU_ROWS_INITIAL.map(s => s.cat))];
const ALL_STATUSES = Object.keys(SKU_PART_CONFIG); // ['under_review', 'locked', 'excluded']

function ChevronDown({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

export default function SkuToolbar({ skuSearch, categoryFilter, statusFilter = [], onSkuSearchChange, onCategoryChange, onStatusChange, resultCount, version = 'v1', onBatchUpload }) {
  const [catDropOpen, setCatDropOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [pending, setPending] = useState(ALL_CATS);
  const chipRef = useRef(null);

  // Status filter state
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(ALL_STATUSES);
  const statusChipRef = useRef(null);

  function openDrop() {
    setPending(categoryFilter.length === 0 ? ALL_CATS : [...categoryFilter]);
    setCatSearch('');
    setCatDropOpen(true);
  }

  useEffect(() => {
    if (!catDropOpen) return;
    function handleClick(e) {
      if (chipRef.current && !chipRef.current.contains(e.target)) setCatDropOpen(false);
    }
    setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [catDropOpen]);

  function openStatusDrop() {
    setPendingStatus(statusFilter.length === 0 ? ALL_STATUSES : [...statusFilter]);
    setStatusDropOpen(true);
  }

  useEffect(() => {
    if (!statusDropOpen) return;
    function handleClick(e) {
      if (statusChipRef.current && !statusChipRef.current.contains(e.target)) setStatusDropOpen(false);
    }
    setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [statusDropOpen]);

  function toggleStatus(s) {
    setPendingStatus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }
  function handleStatusApply() {
    onStatusChange(pendingStatus.length === ALL_STATUSES.length ? [] : pendingStatus);
    setStatusDropOpen(false);
  }
  function handleStatusClear() { setPendingStatus([]); }

  const statusActiveCount = statusFilter.length;
  const statusLabel = statusActiveCount > 0 ? `Status (${statusActiveCount})` : 'Status';
  const isStatusActive = statusActiveCount > 0;

  const filteredCats = ALL_CATS.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));
  const allChecked  = pending.length === ALL_CATS.length;
  const someChecked = pending.length > 0 && pending.length < ALL_CATS.length;

  function toggleCat(cat) {
    setPending(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }
  function handleSelectAll(e) { setPending(e.target.checked ? ALL_CATS : []); }
  function handleApply() {
    onCategoryChange(pending.length === ALL_CATS.length ? [] : pending);
    setCatDropOpen(false);
  }
  function handleClear() { setPending([]); }

  const activeCount = categoryFilter.length;
  const catLabel    = activeCount > 0 ? `Category (${activeCount})` : 'Category';
  const isActive    = activeCount > 0;

  return (
    <div className="table-toolbar">

      {/* Search bar — matches PromoToolbar search-combo style */}
      <div className="search-combo" style={{ minWidth: 280 }}>
        <input
          type="text"
          placeholder="Search SKU Name or SKU ID…"
          value={skuSearch}
          onChange={e => onSkuSearchChange(e.target.value)}
          style={{ paddingLeft: 12 }}
        />
        <button className="search-combo-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>

      {/* Category filter — pill chip matching PromoToolbar */}
      <div
        ref={chipRef}
        onClick={() => !catDropOpen && openDrop()}
        className={`filter-chip${isActive ? ' active' : ''}`}
        style={{ position: 'relative' }}
      >
        <span>{catLabel}</span>
        <ChevronDown size={16} />

        {catDropOpen && (
          <div className="cat-dropdown" onClick={e => e.stopPropagation()}>
            {/* Search */}
            <div className="cat-dropdown-search">
              <div className="cat-dropdown-search-wrap">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search in filters"
                  value={catSearch}
                  onChange={e => setCatSearch(e.target.value)}
                />
              </div>
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
                    {CAT_CODES[cat] && <span className="cat-code">{CAT_CODES[cat]}</span>}
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

      {/* Status filter chip */}
      <div
        ref={statusChipRef}
        onClick={() => !statusDropOpen && openStatusDrop()}
        className={`filter-chip${isStatusActive ? ' active' : ''}`}
        style={{ position: 'relative' }}
      >
        <span>{statusLabel}</span>
        <ChevronDown size={16} />

        {statusDropOpen && (
          <div className="cat-dropdown" style={{ minWidth: 180 }} onClick={e => e.stopPropagation()}>
            <div className="cat-dropdown-list" style={{ maxHeight: 'none' }}>
              {ALL_STATUSES.map(s => {
                const cfg = SKU_PART_CONFIG[s];
                return (
                  <div key={s} className="cat-dropdown-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={pendingStatus.includes(s)}
                        onChange={() => toggleStatus(s)}
                      />
                      <span className="dot-tag" style={{ marginLeft: 4 }}>
                        <span className="dot-tag-dot" style={{ background: cfg.dotColor }} />
                        {cfg.label}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="cat-dropdown-footer">
              <button className="cat-dropdown-clear" onClick={handleStatusClear}>Clear All</button>
              <button className="cat-dropdown-apply" onClick={handleStatusApply}>Apply</button>
            </div>
          </div>
        )}
      </div>

      <div className="toolbar-spacer" />
      <span className="result-count">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
      {version === 'v3' && onBatchUpload && (
        <button className="btn-export" onClick={onBatchUpload}>Upload</button>
      )}
      <button className="btn-export">
        {version !== 'v3' && (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        )}
        Export
      </button>
    </div>
  );
}
