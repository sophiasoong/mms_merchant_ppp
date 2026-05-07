import { useState } from 'react';
import { STORE_STATUS_DATA } from '../../data/promotions.js';

const STATUS_MAP = {
  open:           { label: 'Open',           color: '#1890FF', bg: '#E6F7FF', border: '#91D5FF' },
  exit_scheduled: { label: 'Exit Scheduled', color: '#531DAB', bg: '#F9F0FF', border: '#D3ADF7' },
  exit_rejected:  { label: 'Exit Rejected',  color: '#F5222D', bg: '#FFF1F0', border: '#FFA39E' },
  opted_out:      { label: 'Opted Out',      color: '#FA8C16', bg: '#FFF7E6', border: '#FFD591' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || { label: status, color: '#A6A6A6', bg: '#fafafa', border: '#d9d9d9' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      width: 'fit-content',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

export default function StoreStatusDetail({ onBack }) {
  const [auditStore, setAuditStore] = useState(null);

  return (
    <div className="view active" id="view-store-status">
      <nav className="breadcrumb">
        <a>Home</a><span className="breadcrumb-sep">›</span>
        <a>Promotion Management</a><span className="breadcrumb-sep">›</span>
        <a onClick={onBack} style={{ cursor: 'pointer' }}>Personal Price Promotion</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Program Status by Stores</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Program Status by Stores</h1>
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
              {STORE_STATUS_DATA.map(row => (
                <tr key={row.storefrontCode}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.storefrontCode}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <StatusBadge status={row.status} />
                      {(row.status === 'exit_rejected' || row.showInfo) && (
                        <span className="ssd-info-wrap">
                          <svg className="ssd-info-icon" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          <span className="ssd-info-tooltip">Application to Exit Program is rejected. Please contact RM if you have any question.</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="ssd-actions">
                      {/* Enroll or Exit Program */}
                      {row.status === 'open' && row.action !== 'exit' ? (
                        <button className="ssd-icon-btn ssd-enroll-btn" data-tooltip="Enroll">
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <line x1="19" y1="8" x2="19" y2="14"/>
                            <line x1="22" y1="11" x2="16" y2="11"/>
                          </svg>
                        </button>
                      ) : (
                        <button className="ssd-icon-btn ssd-exit-btn" data-tooltip="Exit Program" disabled={['exit_rejected', 'exit_scheduled', 'opted_out'].includes(row.status) || row.showInfo}>
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                        </button>
                      )}
                      {/* Audit History */}
                      <button
                        className="ssd-icon-btn ssd-audit-btn"
                        data-tooltip="Audit History"
                        onClick={() => setAuditStore(row.storefrontCode)}
                      >
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
          <div className="dialog-box" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span className="dialog-title" style={{ marginBottom: 0 }}>Audit History — {auditStore}</span>
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
                { action: 'Admin Approve', date: '2026-03-20 14:32', userId: 'admin@hktv.com.hk' },
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
