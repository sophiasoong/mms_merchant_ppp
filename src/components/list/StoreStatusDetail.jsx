import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { STORE_STATUS_DATA } from '../../data/promotions.js';

const STATUS_MAP = {
  open:           { label: 'Open',           dotColor: '#1890FF' },
  enrolled:       { label: 'Enrolled',       dotColor: '#52C41A' },
  exit_scheduled: { label: 'Exit Scheduled', dotColor: '#531DAB', info: 'Your exit request has been submitted and is pending approval. The exit will take effect from the start of the next PPP promotion period.' },
  exit_rejected:  { label: 'Exit Rejected',  dotColor: '#F5222D', info: 'Application to Exit Program is rejected. Please contact RM if you have any question.' },
  opted_out:      { label: 'Opted Out',      dotColor: '#FA8C16', info: 'You have opted out of the PPP program. You will not participate in the next promotion cycle unless you re-enroll.' },
};

// v3 overrides specific store statuses
const V3_STATUS_OVERRIDES = { H4981529: 'enrolled', H5413880: 'enrolled' };

function StatusInfoIcon({ text, danger = false }) {
  const [pos, setPos] = useState(null);
  const ref = useRef(null);

  function handleMouseEnter() {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({ top: r.top - 8, left: r.left + r.width / 2 });
  }

  return (
    <span ref={ref} className="ssd-info-wrap" onMouseEnter={handleMouseEnter} onMouseLeave={() => setPos(null)}>
      <svg width="13" height="13" fill="none" stroke={danger ? '#F5222D' : '#A6A6A6'} strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'block' }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {pos && createPortal(
        <div className="info-tooltip-fixed" style={{ top: pos.top, left: pos.left }}>{text}</div>,
        document.body
      )}
    </span>
  );
}

function StatusBadge({ status, showErrorInfo = false }) {
  const cfg = STATUS_MAP[status] || { label: status, dotColor: '#A6A6A6' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="dot-tag">
        <span className="dot-tag-dot" style={{ background: cfg.dotColor }} />
        {cfg.label}
      </span>
      {showErrorInfo && (
        <StatusInfoIcon text="There is an issue with this storefront. Please contact RM for assistance." danger />
      )}
      {!showErrorInfo && cfg.info && (
        <StatusInfoIcon text={cfg.info} danger={status === 'exit_rejected'} />
      )}
    </span>
  );
}

export default function StoreStatusDetail({ onBack, version, promotions = [], onEnroll }) {
  const [auditStore, setAuditStore] = useState(null);

  function handleEnroll(storefrontCode) {
    const promo = promotions.find(p => p.storefrontCode === storefrontCode) ?? promotions[0];
    if (promo) onEnroll?.(promo.id);
  }

  return (
    <div className="view active" id="view-store-status">
      <nav className="breadcrumb">
        <a>Home</a><span className="breadcrumb-sep">/</span>
        <a>Promotion Management</a><span className="breadcrumb-sep">/</span>
        <a onClick={onBack} style={{ cursor: 'pointer' }}>Personal Price Promotion</a>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Program Settings</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Program Settings</h1>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Storefront Code</th>
                <th>Program Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {STORE_STATUS_DATA.map(row => {
                const effectiveStatus = (version === 'v3' && V3_STATUS_OVERRIDES[row.storefrontCode]) || row.status;
                const showErrorInfo = !!row.showInfo && effectiveStatus === row.status;
                return (
                <tr key={row.storefrontCode}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.storefrontCode}</td>
                  <td>
                    <StatusBadge status={effectiveStatus} showErrorInfo={showErrorInfo} />
                  </td>
                  <td>
                    <div className="ssd-actions">
                      {/* Enroll or Exit Program */}
                      {row.status === 'open' && row.action !== 'exit' ? (
                        <button className="ssd-ghost-btn" onClick={() => handleEnroll(row.storefrontCode)}>Enroll</button>
                      ) : (
                        <button
                          className="ssd-ghost-btn ssd-ghost-btn--danger"
                          disabled={['exit_rejected', 'exit_scheduled', 'opted_out'].includes(row.status) || row.showInfo}
                        >
                          Exit
                        </button>
                      )}
                      {/* Audit History */}
                      <button
                        className="ssd-ghost-btn"
                        onClick={() => setAuditStore(row.storefrontCode)}
                      >
                        Log
                      </button>
                    </div>
                  </td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit History modal */}
      {auditStore && (
        <div
          className="dialog-overlay open"
          onClick={e => { if (e.target === e.currentTarget) setAuditStore(null); }}
        >
          <div className="dialog-box" style={{ maxWidth: 580 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span className="dialog-title" style={{ marginBottom: 0 }}>Log Detail — {auditStore}</span>
              <button onClick={() => setAuditStore(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="promo-panel-audit-table">
              <div className="promo-panel-audit-head">
                <span>Action</span><span>DateTime</span><span>User ID</span>
              </div>
              {[
                { action: 'Opt Out',       date: '2026-04-01 09:15', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2026-03-20 14:32', userId: 'admin@hktv.com.hk'    },
                { action: 'Exit Program',  date: '2026-03-10 11:05', userId: 'merchant@hktv.com.hk' },
              ].map((entry, i) => (
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
    </div>
  );
}
