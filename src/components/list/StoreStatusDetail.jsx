import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { STORE_STATUS_DATA } from '../../data/promotions.js';

const STATUS_MAP = {
  open:           { label: 'Open',           dotColor: '#1890FF' },
  enrolled:       { label: 'Enrolled',       dotColor: '#52C41A' },
  exit_scheduled: { label: 'Exit Scheduled', dotColor: '#531DAB', caption: 'Merchant', info: 'Exit effective from: 2026-05-01 (next cycle)' },
  exit_rejected:  { label: 'Exit Rejected',  dotColor: '#F5222D', info: 'Application to Exit Program is rejected. Please contact RM if you have any question.' },
  opted_out:      { label: 'Opted Out',      dotColor: '#FA8C16', caption: 'System',   info: 'You have opted out of the PPP program. You will not participate in the next promotion cycle unless you re-enroll.' },
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
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
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
      {cfg.caption && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 14 }}>
          {cfg.caption}
        </span>
      )}
    </span>
  );
}

export default function StoreStatusDetail({ onBack, version, promotions = [], onEnroll }) {
  const [auditStore, setAuditStore] = useState(null);
  const [exitStore, setExitStore] = useState(null);

  function handleEnroll(storefrontCode) {
    const promo = promotions.find(p => p.storefrontCode === storefrontCode) ?? promotions[0];
    if (promo) onEnroll?.(promo.id);
  }

  function handleExitConfirm() {
    setExitStore(null);
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
                <th>First Join Date</th>
                <th>Last Join Date</th>
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
                  <td style={{ color: 'var(--text-secondary)' }}>{row.firstJoinDate ?? '—'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row.lastJoinDate ?? '—'}</td>
                  <td>
                    <div className="ssd-actions">
                      {/* Enroll or Exit Program */}
                      {row.status === 'open' && row.action !== 'exit' ? (
                        <button className="ssd-ghost-btn" onClick={() => handleEnroll(row.storefrontCode)}>Enroll</button>
                      ) : (
                        <button
                          className="ssd-ghost-btn ssd-ghost-btn--danger"
                          disabled={['exit_rejected', 'exit_scheduled', 'opted_out'].includes(row.status) || row.showInfo}
                          onClick={() => setExitStore(row.storefrontCode)}
                        >
                          Exit
                        </button>
                      )}
                      {/* Audit History */}
                      {!row.hideLog && (
                        <button
                          className="ssd-ghost-btn"
                          onClick={() => setAuditStore(row.storefrontCode)}
                        >
                          Log
                        </button>
                      )}
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
          <div className="dialog-box" style={{ maxWidth: 580, maxHeight: 860, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexShrink: 0 }}>
              <span className="dialog-title" style={{ marginBottom: 0 }}>Log Detail — {auditStore}</span>
              <button onClick={() => setAuditStore(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="promo-panel-audit-table" style={{ overflowY: 'auto', flex: 1 }}>
              <div className="promo-panel-audit-head" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <span>Action</span><span>DateTime</span><span>User ID</span>
              </div>
              {[
                { action: 'Opt Out',       date: '2026-04-01 09:15', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2026-03-20 14:32', userId: 'admin@hktv.com.hk'    },
                { action: 'Exit Program',  date: '2026-03-10 11:05', userId: 'merchant@hktv.com.hk' },
                { action: 'Enroll',        date: '2026-02-15 10:20', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2026-02-10 09:45', userId: 'admin@hktv.com.hk'    },
                { action: 'Opt Out',       date: '2026-01-28 16:33', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Reject',  date: '2026-01-20 11:12', userId: 'admin@hktv.com.hk'    },
                { action: 'Exit Program',  date: '2026-01-10 14:55', userId: 'merchant@hktv.com.hk' },
                { action: 'Enroll',        date: '2025-12-18 08:30', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2025-12-05 15:22', userId: 'admin@hktv.com.hk'    },
                { action: 'Opt Out',       date: '2025-11-29 13:10', userId: 'merchant@hktv.com.hk' },
                { action: 'Enroll',        date: '2025-11-01 09:00', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2025-10-22 17:48', userId: 'admin@hktv.com.hk'    },
                { action: 'Admin Reject',  date: '2025-10-08 10:05', userId: 'admin@hktv.com.hk'    },
                { action: 'Exit Program',  date: '2025-09-30 12:00', userId: 'merchant@hktv.com.hk' },
                { action: 'Enroll',        date: '2025-09-01 08:15', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2025-08-20 14:40', userId: 'admin@hktv.com.hk'    },
                { action: 'Opt Out',       date: '2025-08-05 11:30', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Reject',  date: '2025-07-18 16:55', userId: 'admin@hktv.com.hk'    },
                { action: 'Enroll',        date: '2025-07-01 09:20', userId: 'merchant@hktv.com.hk' },
                { action: 'Exit Program',  date: '2025-06-25 13:45', userId: 'merchant@hktv.com.hk' },
                { action: 'Admin Approve', date: '2025-06-10 10:30', userId: 'admin@hktv.com.hk'    },
                { action: 'Enroll',        date: '2025-05-01 08:00', userId: 'merchant@hktv.com.hk' },
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

      {/* Exit confirmation dialog */}
      {exitStore && (
        <div
          className="dialog-overlay open"
          onClick={e => { if (e.target === e.currentTarget) setExitStore(null); }}
        >
          <div style={{
            background: '#fff',
            borderRadius: 6,
            boxShadow: '0px 2px 8px #D9D9D9',
            padding: '32px 32px 24px',
            width: 400,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'rgba(0,0,0,0.87)', lineHeight: 1.2, margin: 0 }}>
                Exit Program
              </p>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5, margin: 0 }}>
                Are you sure you want to exit the PPP program for <strong>{exitStore}</strong>? Your exit request will take effect from the start of the next promotion period.
              </p>
            </div>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setExitStore(null)}
                style={{
                  height: 32, padding: '0 16px', borderRadius: 6, cursor: 'pointer',
                  background: '#fff', border: '1px solid #5244EE', color: '#5244EE',
                  fontSize: 14, fontWeight: 400,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleExitConfirm}
                style={{
                  height: 32, padding: '0 16px', borderRadius: 6, cursor: 'pointer',
                  background: '#FF4D4F', border: 'none', color: '#fff',
                  fontSize: 14, fontWeight: 400,
                }}
              >
                Exit Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
