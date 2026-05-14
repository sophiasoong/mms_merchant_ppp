import { useState, useRef, useEffect } from 'react';
import { STATUS_DROPDOWN_OPTS, SEARCH_TYPE_OPTS } from '../../data/promotions.js';
import DateRangePicker from '../common/DateRangePicker.jsx';

// Chevron down icon
function ChevronDown({ size = 16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

const CYCLE_OPTS = [
  { value: 'current', label: 'Current cycles' },
  { value: 'newest',  label: 'From newest to oldest' },
  { value: 'oldest',  label: 'From oldest to newest' },
];

export default function PromoToolbar({
  searchType, searchQuery, statusFilter, dateStartFilter, dateEndFilter,
  onSearchTypeChange, onSearchQueryChange, onStatusFilterChange,
  onDateStartChange, onDateEndChange, onClearFilters,
  resultCount, totalCount,
  version, cycleSort = 'current', onCycleSortChange,
  storefrontCodes = [], storefrontCodeFilter = [], onStorefrontCodeFilterChange,
}) {
  const [typeDropOpen, setTypeDropOpen] = useState(false);
  const [statusDropOpen, setStatusDropOpen] = useState(false);
  const [dateDropOpen, setDateDropOpen] = useState(false);
  const [cycleDropOpen, setCycleDropOpen] = useState(false);
  const [sfDropOpen, setSfDropOpen] = useState(false);
  const [sfPending, setSfPending] = useState([]);
  const [sfSearch, setSfSearch] = useState('');

  const typeRef   = useRef(null);
  const statusRef = useRef(null);
  const dateRef   = useRef(null);
  const cycleRef  = useRef(null);
  const sfRef     = useRef(null);
  const dateStartRef = useRef(null);
  const dateEndRef   = useRef(null);

  // Close all dropdowns on outside click
  // Date picker renders in a portal so we check by class name too
  useEffect(() => {
    if (!typeDropOpen && !statusDropOpen && !dateDropOpen && !cycleDropOpen && !sfDropOpen) return;
    function handleClick(e) {
      if (typeDropOpen   && typeRef.current   && !typeRef.current.contains(e.target))   setTypeDropOpen(false);
      if (statusDropOpen && statusRef.current && !statusRef.current.contains(e.target)) setStatusDropOpen(false);
      if (cycleDropOpen  && cycleRef.current  && !cycleRef.current.contains(e.target))  setCycleDropOpen(false);
      if (sfDropOpen     && sfRef.current     && !sfRef.current.contains(e.target))     setSfDropOpen(false);
      if (dateDropOpen   && dateRef.current   && !dateRef.current.contains(e.target)) {
        const inPortal = e.target.closest('[data-date-picker]');
        if (!inPortal) setDateDropOpen(false);
      }
    }
    setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [typeDropOpen, statusDropOpen, dateDropOpen, cycleDropOpen, sfDropOpen]);

  function openSfDrop() {
    setSfPending(storefrontCodeFilter.length === 0 ? [...storefrontCodes] : [...storefrontCodeFilter]);
    setSfSearch('');
    setSfDropOpen(true);
  }
  function toggleSf(code) { setSfPending(p => p.includes(code) ? p.filter(c => c !== code) : [...p, code]); }
  function handleSfApply() { onStorefrontCodeFilterChange?.(sfPending.length === storefrontCodes.length ? [] : sfPending); setSfDropOpen(false); }
  function handleSfClear() { setSfPending([]); }

  const hasFilters = searchQuery.trim() || statusFilter || dateStartFilter.trim() || dateEndFilter.trim();
  const currentTypeOpt   = SEARCH_TYPE_OPTS.find(o => o.value === searchType)   || SEARCH_TYPE_OPTS[0];
  const currentStatusOpt = STATUS_DROPDOWN_OPTS.find(o => o.value === statusFilter) || STATUS_DROPDOWN_OPTS[0];

  const placeholder = `Search ${currentTypeOpt.label}`;

  // Date chip label
  const dateLabel = (dateStartFilter || dateEndFilter)
    ? [dateStartFilter, dateEndFilter].filter(Boolean).join(' – ')
    : 'Promotion Date';

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

      {/* Storefront Code filter chip — v4 only */}
      {version === 'v4' && (
        <div
          ref={sfRef}
          onClick={() => !sfDropOpen && openSfDrop()}
          className={`filter-chip${storefrontCodeFilter.length > 0 ? ' active' : ''}`}
          style={{ position: 'relative' }}
        >
          <span>{storefrontCodeFilter.length > 0 ? `Storefront Code (${storefrontCodeFilter.length})` : 'Storefront Code'}</span>
          <ChevronDown size={16} />

          {sfDropOpen && (
            <div className="cat-dropdown" onClick={e => e.stopPropagation()}>
              <div className="cat-dropdown-search">
                <div className="cat-dropdown-search-wrap">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input autoFocus type="text" placeholder="Search in filters" value={sfSearch} onChange={e => setSfSearch(e.target.value)} />
                </div>
              </div>

              <div className="cat-dropdown-item cat-dropdown-select-all">
                <label>
                  <input
                    type="checkbox"
                    checked={sfPending.length === storefrontCodes.length}
                    ref={el => { if (el) el.indeterminate = sfPending.length > 0 && sfPending.length < storefrontCodes.length; }}
                    onChange={e => setSfPending(e.target.checked ? [...storefrontCodes] : [])}
                  />
                  Select all
                </label>
              </div>

              <div className="cat-dropdown-list">
                {storefrontCodes.filter(c => c.toLowerCase().includes(sfSearch.toLowerCase())).map(code => (
                  <div key={code} className="cat-dropdown-item">
                    <label>
                      <input type="checkbox" checked={sfPending.includes(code)} onChange={() => toggleSf(code)} />
                      {code}
                    </label>
                  </div>
                ))}
              </div>

              <div className="cat-dropdown-footer">
                <button className="cat-dropdown-clear" onClick={handleSfClear}>Clear All</button>
                <button className="cat-dropdown-apply" onClick={handleSfApply}>Apply</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search bar — split addon + input */}
      {version !== 'v4' && <div className="search-combo">
        <div
          className="search-combo-type"
          ref={typeRef}
          onClick={() => setTypeDropOpen(p => !p)}
        >
          <span>{currentTypeOpt.label}</span>
          <ChevronDown size={12} />

          {typeDropOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 999,
              background: '#fff', border: 'none', borderRadius: '8px',
              boxShadow: '0px 2px 8px 0px #D9D9D9',
              width: '152px', padding: '4px 0', fontSize: '14px',
            }}>
              {SEARCH_TYPE_OPTS.map(opt => {
                const isActive = opt.value === searchType;
                return (
                  <div
                    key={opt.value}
                    onClick={(e) => { e.stopPropagation(); onSearchTypeChange(opt.value); setTypeDropOpen(false); }}
                    style={{
                      height: 32, padding: '4px 12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      background: isActive ? '#F1ECFF' : '#fff',
                      color:      isActive ? '#110964' : '#1E1E1E',
                      fontWeight: isActive ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F7F6FF'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#fff'; }}
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

        <button className="search-combo-btn">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>}

      {/* Promotion Date chip */}
      <div
        ref={dateRef}
        onClick={() => setDateDropOpen(p => !p)}
        style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          height: 32, padding: '0 8px 0 16px',
          borderRadius: 32, cursor: 'pointer', userSelect: 'none',
          fontFamily: 'Roboto, sans-serif', fontSize: 14, whiteSpace: 'nowrap',
          // DS states: selected=darker bg+primary border; focus=primary border+shadow; default=light
          background: (dateStartFilter || dateEndFilter) ? '#D4D0FB' : '#F7F6FF',
          border: `1px solid ${dateDropOpen ? '#5244EE' : (dateStartFilter || dateEndFilter) ? '#5244EE' : '#D4D0FB'}`,
          color: '#5244EE',
          boxShadow: dateDropOpen ? '0 0 0 2px rgba(82,68,238,.15)' : 'none',
          transition: 'border-color .15s, box-shadow .15s',
        }}
      >
        {/* When dates selected: show inline "Promotion Date: start – end" */}
        {(dateStartFilter || dateEndFilter) ? (
          <>
            <span style={{ color: '#5244EE' }}>Promotion Date:&nbsp;</span>
            <span style={{
              color: '#5244EE',
              borderBottom: dateDropOpen ? '1px solid #5244EE' : 'none',
              lineHeight: '1',
            }}>
              {dateStartFilter || '—'}
            </span>
            <svg width="10" height="10" fill="none" stroke="#5244EE" strokeWidth="2" viewBox="0 0 24 24" style={{flexShrink:0}}>
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
            <span style={{
              color: '#5244EE',
              borderBottom: dateDropOpen ? '1px solid #5244EE' : 'none',
              lineHeight: '1',
            }}>
              {dateEndFilter || '—'}
            </span>
            <ChevronDown size={16} />
          </>
        ) : (
          <>
            <span>Promotion Date</span>
            <ChevronDown size={16} />
          </>
        )}

        {dateDropOpen && (
          <DateRangePicker
            anchorRect={dateRef.current?.getBoundingClientRect()}
            startDate={dateStartFilter}
            endDate={dateEndFilter}
            onStartChange={onDateStartChange}
            onEndChange={onDateEndChange}
            onClose={() => setDateDropOpen(false)}

          />
        )}
      </div>

      {/* Enrollment Status chip */}
      <div
        className={`filter-chip${statusFilter ? ' active' : ''}`}
        ref={statusRef}
        onClick={() => setStatusDropOpen(p => !p)}
      >
        <span>{statusFilter ? currentStatusOpt.label : 'Enrollment Status'}</span>
        <ChevronDown size={16} />

        {statusDropOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 999,
            background: '#fff', border: '1px solid #D4D4D4', borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,.12)', minWidth: '200px', padding: '4px 0', fontSize: '14px',
          }} onClick={e => e.stopPropagation()}>
            {STATUS_DROPDOWN_OPTS.map(opt => {
              const isCurrent = opt.value === statusFilter;
              return (
                <div
                  key={String(opt.value)}
                  onClick={() => { onStatusFilterChange(opt.value); setStatusDropOpen(false); }}
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

      {/* Cycle chip — v4 only */}
      {version === 'v4' && (
        <div
          className={`filter-chip${cycleSort !== 'current' ? ' active' : ''}`}
          ref={cycleRef}
          onClick={() => setCycleDropOpen(p => !p)}
        >
          <span>Cycle</span>
          <ChevronDown size={16} />

          {cycleDropOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 999,
              background: '#fff', border: '1px solid #D4D4D4', borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,.12)', minWidth: '200px', padding: '4px 0', fontSize: '14px',
            }} onClick={e => e.stopPropagation()}>
              {CYCLE_OPTS.map(opt => {
                const isCurrent = opt.value === cycleSort;
                return (
                  <div
                    key={opt.value}
                    onClick={() => { onCycleSortChange(opt.value); setCycleDropOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '9px 14px', cursor: 'pointer',
                      background: isCurrent ? '#ECEAFD' : '',
                      fontWeight: isCurrent ? '500' : '400',
                      color: isCurrent ? '#5244EE' : '#1E1E1E',
                    }}
                    onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = '#F5F5F5'; }}
                    onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = ''; }}
                  >
                    <span>{opt.label}</span>
                    {isCurrent && (
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
      )}

      {/* Clear All */}
      {hasFilters && (
        <button className="btn-clear-filter" onClick={onClearFilters}>Clear All</button>
      )}

      <div className="toolbar-spacer" />
      <span className="result-count">{resultText}</span>
    </div>
  );
}
