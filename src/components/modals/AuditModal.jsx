import { AUDIT_DATA } from '../../data/promotions.js';

export default function AuditModal({ open, promo, onClose }) {
  const rows = (promo && AUDIT_DATA[promo.id]) || AUDIT_DATA.default;

  return (
    <div
      className={`dialog-overlay${open ? ' open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dialog-box" style={{ maxWidth: 560, width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span className="dialog-title" style={{ marginBottom: 0 }}>Log Detail</span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="promo-panel-audit-table">
          <div className="promo-panel-audit-head">
            <span>Action</span><span>DateTime</span><span>User ID</span>
          </div>
          {rows.map((entry, i) => (
            <div key={i} className="promo-panel-audit-row">
              <span>{entry.action}</span>
              <span>{entry.date}</span>
              <span>{entry.userId}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
