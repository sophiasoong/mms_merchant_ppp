import { useState, useRef, useEffect } from 'react';
import { STATUS_CONFIG } from '../../data/promotions.js';

const DOT_COLORS = {
  open:            '#1890FF',
  pending_confirm: '#FA8C16',
  confirmed:       '#52C41A',
  opted_out:       '#F5222D',
  exit_scheduled:  '#531DAB',
};

const CAN_EXIT = new Set(['open', 'pending_confirm', 'confirmed']);

// Sample audit history entries per promo (falls back to default)
const AUDIT_HISTORY = {
  default: [
    { action: 'Opt Out',       date: '2026-04-01 09:15', userId: 'merchant@hktv.com.hk' },
    { action: 'Admin Approve', date: '2026-03-20 14:32', userId: 'admin@hktv.com.hk' },
    { action: 'Exit Program',  date: '2026-03-10 11:05', userId: 'merchant@hktv.com.hk' },
  ],
};

export default function PromoPanel({ promo, allPromos = [], isExited, isJoined, onExit, onEnroll, onViewDetail, layout = 'horizontal' }) {
  const [showDialog,     setShowDialog]    = useState(false);
  const [processing,     setProcessing]    = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(
    () => new URLSearchParams(window.location.search).get('figmacapture') === 'audit-history'
  );
  const [selectedStore,  setSelectedStore] = useState(promo?.storefrontCode);
  const [storeDropOpen,  setStoreDropOpen]  = useState(false);
  const [storeSearch,    setStoreSearch]    = useState('');
  const storeDropRef   = useRef(null);
  const storeSearchRef = useRef(null);
  // exitFlow: null | { store, phase: 'pending'|'exit_scheduled'|'opted_out'|'rejected' }
  const [exitFlow, setExitFlow] = useState(null);

  // Close store dropdown on outside click
  useEffect(() => {
    if (!storeDropOpen) return;
    function handleClick(e) {
      if (storeDropRef.current && !storeDropRef.current.contains(e.target)) setStoreDropOpen(false);
    }
    setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [storeDropOpen]);

  // Reset selected store when promo changes
  if (selectedStore !== promo?.storefrontCode &&
      !allPromos.some(p => p.start === promo?.start && p.end === promo?.end && p.storefrontCode === selectedStore)) {
    setSelectedStore(promo?.storefrontCode);
  }

  if (!promo) return null;

  // All stores sharing the same promotion period
  const storeOptions = allPromos
    .filter(p => p.start === promo.start && p.end === promo.end)
    .map(p => p.storefrontCode);

  // Derive displayed status — override with local exit flow phases
  let displayStatus = promo.status;
  if (exitFlow?.phase === 'exit_scheduled') displayStatus = 'exit_scheduled';
  else if (exitFlow?.phase === 'opted_out')  displayStatus = 'opted_out';

  const cfg        = STATUS_CONFIG[displayStatus] || STATUS_CONFIG[promo.status];
  const panelLabel = displayStatus === 'pending_confirm' ? 'Open' : cfg.label;
  const dotColor   = displayStatus === 'pending_confirm' ? '#1890FF' : (DOT_COLORS[displayStatus] || '#A6A6A6');
  const canExit    = CAN_EXIT.has(promo.status) || exitFlow !== null;
  const auditLog   = AUDIT_HISTORY[promo.id] || AUDIT_HISTORY.default;

  const exitBtnDisabled   = isExited || exitFlow !== null;
  const showExitScheduled = exitFlow?.phase === 'exit_scheduled';
  const showRejected      = exitFlow?.phase === 'rejected';

  function handleConfirm() {
    setProcessing(true);
    const store = selectedStore;
    setTimeout(() => {
      setProcessing(false);
      setShowDialog(false);
      setExitFlow({ store, phase: 'pending' });

      if (store === 'H2748138') {
        setTimeout(() => {
          setExitFlow({ store, phase: 'exit_scheduled' });
          setTimeout(() => {
            setExitFlow({ store, phase: 'opted_out' });
          }, 5000);
        }, 5000);
      } else if (store === 'H5413880') {
        setTimeout(() => {
          setExitFlow({ store, phase: 'rejected' });
        }, 5000);
      } else {
        // default behaviour for other stores
        onExit(promo.id);
        setExitFlow(null);
      }
    }, 700);
  }

  return (
    <>
      <div className={`promo-panel${layout === 'side' ? ' promo-panel-side' : ''}`}>
        {layout === 'side' ? (
          /* ── Side layout: DS "Action Panel" card ── */
          <>
            {/* Header */}
            <div className="promo-panel-header">
              <span className="promo-panel-title">Program Settings</span>
              <button className="promo-panel-info-btn" aria-label="Program info">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="promo-panel-body">
              {/* Storefront Code */}
              <div className="promo-panel-field">
                <div className="promo-panel-field-label">
                  Storefront Code <span className="field-required">*</span>
                </div>
                <div className="store-select-wrap" ref={storeDropRef}>
                  {/* Closed: value + chevron */}
                  {!storeDropOpen ? (
                    <div
                      className="store-select-trigger"
                      onClick={() => { setStoreSearch(''); setStoreDropOpen(true); setTimeout(() => storeSearchRef.current?.focus(), 0); }}
                    >
                      <span className="store-select-value">{selectedStore}</span>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#A6A6A6' }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  ) : (
                    /* Open: search input + chevron */
                    <div className="store-select-trigger open">
                      <input
                        ref={storeSearchRef}
                        className="store-select-search-input"
                        placeholder="Search…"
                        value={storeSearch}
                        onChange={e => setStoreSearch(e.target.value)}
                        onClick={e => e.stopPropagation()}
                      />
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#A6A6A6' }}>
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                  )}
                  {storeDropOpen && (
                    <div className="store-select-dropdown">
                      {storeOptions
                        .filter(c => c.toLowerCase().includes(storeSearch.toLowerCase()))
                        .map(code => (
                          <div
                            key={code}
                            className={`store-select-item${code === selectedStore ? ' selected' : ''}`}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => { setSelectedStore(code); setStoreDropOpen(false); }}
                          >
                            {code}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="promo-panel-field">
                <div className="promo-panel-field-label">Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot-tag">
                    <span className="dot-tag-dot" style={{ background: dotColor }} />
                    {panelLabel}
                  </span>
                  {(promo.status === 'exit_scheduled' || showExitScheduled) && (
                    <span className="exit-scheduled-tooltip-wrap">
                      <svg className="exit-scheduled-info-icon" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'default' }}>
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span className="exit-scheduled-tooltip">Exit takes effect from next promotion</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {canExit && (
                <div className="promo-panel-actions promo-panel-actions-full">
                  {(isJoined || selectedStore === 'H5413880') && (
                    <div className="promo-panel-btn-tooltip-wrap">
                      <button className="promo-panel-exit-btn" disabled={exitBtnDisabled} onClick={() => !exitBtnDisabled && setShowDialog(true)}>
                        Exit Program
                        {showRejected && (
                          <span className="exit-rejected-icon-wrap">
                            <svg width="13" height="13" fill="none" stroke="#F5222D" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'block' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span className="exit-rejected-tooltip">Exit Program application rejected. Please contact RM</span>
                          </span>
                        )}
                      </button>
                      {!showRejected && <span className="promo-panel-btn-tooltip">Exit from program will be effective in the next promotion cycle.</span>}
                    </div>
                  )}
                  {(isJoined || selectedStore === 'H5413880') ? (
                    <button className="promo-panel-view-btn" onClick={() => onViewDetail?.(promo.id)}>View Detail</button>
                  ) : (
                    <div className="promo-panel-btn-tooltip-wrap">
                      <button className="promo-panel-enroll-btn" onClick={() => onEnroll?.(promo.id)}>Enroll Program</button>
                      <span className="promo-panel-btn-tooltip">Enrollment will be effective in the next promotion cycle.</span>
                    </div>
                  )}
                  <button className="promo-panel-audit-btn" onClick={() => setAuditModalOpen(true)}>Audit History</button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ── Horizontal layout: icon + select + badge in one row ── */
          <>
            <div className="promo-panel-section">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>

              {/* Custom store select — same as side panel */}
              <div className="store-select-wrap store-select-wrap-inline" ref={storeDropRef}>
                {!storeDropOpen ? (
                  <div
                    className="store-select-trigger"
                    onClick={() => { setStoreSearch(''); setStoreDropOpen(true); setTimeout(() => storeSearchRef.current?.focus(), 0); }}
                  >
                    <span className="store-select-value">{selectedStore}</span>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#A6A6A6' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                ) : (
                  <div className="store-select-trigger open">
                    <input
                      ref={storeSearchRef}
                      className="store-select-search-input"
                      placeholder="Search…"
                      value={storeSearch}
                      onChange={e => setStoreSearch(e.target.value)}
                      onClick={e => e.stopPropagation()}
                    />
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#A6A6A6' }}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                )}
                {storeDropOpen && (
                  <div className="store-select-dropdown">
                    {storeOptions
                      .filter(c => c.toLowerCase().includes(storeSearch.toLowerCase()))
                      .map(code => (
                        <div
                          key={code}
                          className={`store-select-item${code === selectedStore ? ' selected' : ''}`}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setSelectedStore(code); setStoreDropOpen(false); }}
                        >
                          {code}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="dot-tag">
                  <span className="dot-tag-dot" style={{ background: dotColor }} />
                  {panelLabel}
                </span>
                {(promo.status === 'exit_scheduled' || showExitScheduled) && (
                  <span className="exit-scheduled-tooltip-wrap">
                    <svg className="exit-scheduled-info-icon" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'default' }}>
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span className="exit-scheduled-tooltip">Exit takes effect from next promotion</span>
                  </span>
                )}
              </div>
            </div>

            {canExit && (
              <>
                <div className="promo-panel-section promo-panel-actions">
                  {(isJoined || selectedStore === 'H5413880') && (
                    <div className="promo-panel-btn-tooltip-wrap">
                      <button className="promo-panel-exit-btn" disabled={exitBtnDisabled} onClick={() => !exitBtnDisabled && setShowDialog(true)}>
                        Exit Program
                        {showRejected && (
                          <span className="exit-rejected-icon-wrap">
                            <svg width="13" height="13" fill="none" stroke="#F5222D" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'block' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            <span className="exit-rejected-tooltip">Exit Program application rejected. Please contact RM</span>
                          </span>
                        )}
                      </button>
                      {!showRejected && <span className="promo-panel-btn-tooltip">Exit from program will be effective in the next promotion cycle.</span>}
                    </div>
                  )}
                  {(isJoined || selectedStore === 'H5413880') ? (
                    <button className="promo-panel-view-btn" onClick={() => onViewDetail?.(promo.id)}>View Detail</button>
                  ) : (
                    <div className="promo-panel-btn-tooltip-wrap">
                      <button className="promo-panel-enroll-btn" onClick={() => onEnroll?.(promo.id)}>Enroll</button>
                      <span className="promo-panel-btn-tooltip">Enrollment will be effective in the next promotion cycle.</span>
                    </div>
                  )}
                  <button className="promo-panel-audit-btn" onClick={() => setAuditModalOpen(true)}>Audit History</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Audit History modal */}
      {auditModalOpen && (
        <div
          className="dialog-overlay open"
          onClick={e => { if (e.target === e.currentTarget) setAuditModalOpen(false); }}
        >
          <div className="dialog-box" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span className="dialog-title" style={{ marginBottom: 0 }}>Log Detail</span>
              <button
                onClick={() => setAuditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="promo-panel-audit-table">
              <div className="promo-panel-audit-head">
                <span>Action</span><span>DateTime</span><span>User ID</span>
              </div>
              {auditLog.map((entry, i) => (
                <div key={i} className="promo-panel-audit-row">
                  <span>{entry.action}</span>
                  <span>{entry.date}</span>
                  <span>{entry.userId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exit confirmation dialog */}
      {showDialog && (
        <div
          className="dialog-overlay open"
          onClick={e => { if (e.target === e.currentTarget && !processing) setShowDialog(false); }}
        >
          <div className="dialog-box">
            <div className="dialog-icon dialog-icon-optout">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M10 16l-4-4m0 0l4-4m-4 4h12M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
              </svg>
            </div>
            <div className="dialog-title">Exit Program</div>
            <div className="dialog-body">
              Exit takes effect from next promotion period ({promo.end}). You will remain active for the current period. Are you sure?
            </div>
            <div className="dialog-footer">
              <button className="dialog-btn-cancel" disabled={processing} onClick={() => setShowDialog(false)}>
                Cancel
              </button>
              <button className="dialog-btn-ok danger" disabled={processing} onClick={handleConfirm}>
                {processing ? 'Processing…' : 'Exit Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
