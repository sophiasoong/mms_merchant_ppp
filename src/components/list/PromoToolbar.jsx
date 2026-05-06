import { useState, useRef, useEffect } from 'react';
import { STATUS_DROPDOWN_OPTS, SEARCH_TYPE_OPTS } from '../../data/promotions.js';

export default function PromoToolbar({
  searchType, searchQuery, statusFilter, dateStartFilter, dateEndFilter,
  onSearchTypeChange, onSearchQueryChange, onStatusFilterChange,
  onDateStartChange, onDateEndChange, onClearFilters,
  resultCount, totalCount,
}) {
  const [typeDropOpen, setTypeDropOpen] = useState(false);
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const typeBtnRef = useRef(null);
  const statusBtnRef = useRef(null);
  const dateStartRef = useRef(null);
  const dateEndRef = useRef(null);

  function openPicker(ref) {
    if (!ref.current) return;
    ref.current.focus();
    try { ref.current.showPicker(); } catch (_) {}
  }

  const hasFilters = searchQuery.trim() || statusFilter || dateStartFilter.trim() || dateEndFilter.trim();
  const currentTypeOpt = SEARCH_TYPE_OPTS.find(o => o.value === searchType) || SEARCH_TYPE_OPTS[0];
  const currentStatusOpt = STATUS_DROPDOWN_OPTS.find(o => o.value === statusFilter) || STATUS_DROPDOWN_OPTS[0];

  // Close dropdowns on outside click
  useEffect(() => {
    if (!typeDropOpen && !statusDropOpen) return;
    function handleClick(e) {
      if (typeDropOpen && typeBtnRef.current && !typeBtnRef.current.closest('.search-combo').contains(e.target)) {
        setTypeDropOpen(false);
      }
      if (statusDropOpen && statusBtnRef.current && !statusBtnRef.current.contains(e.target)) {
        setStatusDropOpen(false);
      }
    }
    setTimeout(() => document.addEventListener('click', handleClick), 0);
    return () => document.removeEventListener('click', handleClick);
  }, [typeDropOpen, statusDropOpen]);

  const placeholder = `Search ${currentTypeOpt.label}…`;

  let resultText;
  if (resultCount === 0) {
    resultText = '0 results';
  } else if (resultCount === totalCount) {
    resultText = `1–${Math.min(10, totalCount)} of ${totalCount} results`;
  } else {
    resultText = `${resultCount} of ${totalCount} results`;
  }

  return (
    <div className="table-toolbar">
      {/* Combined search */}
      <div className="search-combo">
        <div
          className="search-combo-type"
          ref={typeBtnRef}
          onClick={() => setTypeDropOpen(p => !p)}
          style={{ position: 'relative' }}
        >
          <span>{currentTypeOpt.label}</span>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>

          {typeDropOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 999,
              background: '#fff', border: '1px solid #D4D4D4', borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,.12)', minWidth: '180px', padding: '4px 0', fontSize: '13px',
            }}>
              {SEARCH_TYPE_OPTS.map(opt => {
                const isActive = opt.value === searchType;
                return (
                  <div
                    key={opt.value}
                    onClick={(e) => { e.stopPropagation(); onSearchTypeChange(opt.value); setTypeDropOpen(false); }}
                    style={{
                      padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      background: isActive ? '#ECEAFD' : 'transparent',
                      color: isActive ? '#5244EE' : '#222',
                      fontWeight: isActive ? '600' : '400',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F5F5F5'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {opt.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={e => onSearchQueryChange(e.target.value)}
        />
        <button className="search-combo-btn" onClick={() => {}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
      </div>

      {/* Date filters */}
      <div className="date-filter-wrap">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <div className="date-filter-picker-wrap" onClick={() => openPicker(dateStartRef)}>
          <input
            ref={dateStartRef}
            className={`date-filter-input date-filter-picker${!dateStartFilter ? ' date-filter-empty' : ''}`}
            type="date"
            value={dateStartFilter}
            onChange={e => onDateStartChange(e.target.value)}
          />
          {!dateStartFilter && <span className="date-filter-placeholder">Start Date</span>}
        </div>
        <span className="date-filter-sep">–</span>
        <div className="date-filter-picker-wrap" onClick={() => openPicker(dateEndRef)}>
          <input
            ref={dateEndRef}
            className={`date-filter-input date-filter-picker${!dateEndFilter ? ' date-filter-empty' : ''}`}
            type="date"
            value={dateEndFilter}
            onChange={e => onDateEndChange(e.target.value)}
          />
          {!dateEndFilter && <span className="date-filter-placeholder">End Date</span>}
        </div>
      </div>

      {/* Status filter */}
      <div
        className={`filter-select${statusFilter ? ' active' : ''}`}
        ref={statusBtnRef}
        onClick={() => setStatusDropOpen(p => !p)}
        style={{ position: 'relative' }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span>{statusFilter ? currentStatusOpt.label : 'Enrollment Status'}</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>

        {statusDropOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 999,
            background: '#fff', border: '1px solid #D4D4D4', borderRadius: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,.12)', minWidth: '188px', padding: '4px 0', fontSize: '13px',
          }}>
            {STATUS_DROPDOWN_OPTS.map(opt => {
              const isCurrent = opt.value === statusFilter;
              return (
                <div
                  key={String(opt.value)}
                  onClick={(e) => { e.stopPropagation(); onStatusFilterChange(opt.value); setStatusDropOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '9px',
                    padding: '9px 14px', cursor: 'pointer',
                    color: isCurrent ? '#5244EE' : '#3D3D3D',
                    background: isCurrent ? '#ECEAFD' : '',
                    fontWeight: isCurrent ? '500' : '400',
                  }}
                  onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = '#F5F5F5'; }}
                  onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = ''; }}
                >
                  {opt.dotColor
                    ? <span className="dd-status-dot" style={{ background: opt.dotColor }}></span>
                    : <span style={{ width: '7px' }}></span>
                  }
                  <span>{opt.label}</span>
                  {isCurrent && opt.value !== null && (
                    <span style={{ marginLeft: 'auto' }}>
                      <svg width="12" height="12" fill="none" stroke="#5244EE" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button className="btn-clear-filter" onClick={onClearFilters}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear All
        </button>
      )}

      <div className="toolbar-spacer"></div>
      <span className="result-count">{resultText}</span>
    </div>
  );
}
