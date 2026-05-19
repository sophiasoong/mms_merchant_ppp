import { STATUS_CONFIG } from '../../data/promotions.js';

function deriveLastUpdateTime(promo) {
  // Generate a stable plausible timestamp from the promo id
  const seed = promo.id.replace(/\D/g, '').slice(-4);
  const hour  = String(8 + (parseInt(seed[0]) % 10)).padStart(2, '0');
  const min   = String(parseInt(seed.slice(1, 3)) % 60).padStart(2, '0');
  // Last update is a few days before the start date
  const d = new Date(promo.start);
  d.setDate(d.getDate() - 3);
  const date = d.toISOString().slice(0, 10);
  return `${date} ${hour}:${min}`;
}

export default function ActionPanel({ promo, viewMode = 'edit', version = 'v1', onConfirm, onOptOut, onBatchUpload, onAuditHistory, onSaveAsDraft }) {
  const isViewMode = viewMode === 'view';
  if (!promo) return null;
  const cfg = STATUS_CONFIG[promo.status];
  const lastUpdateTime  = deriveLastUpdateTime(promo);

  return (
    <div className="ap-side-panel">
      {/* Program Detail card */}
      <div className="ap-info-card">
        <div className="ap-info-card-header">
          <span className="ap-info-card-title">Cycle Detail</span>
        </div>
        <div className="ap-info-body">
          <div className="ap-info-field">
            <span className="ap-info-label">Storefront Code</span>
            <span className="ap-info-value">{promo.storefrontCode}</span>
          </div>
          <div className="ap-info-field">
            <span className="ap-info-label">Enrollment Status</span>
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
              <span className="dot-tag">
                <span className="dot-tag-dot" style={{ background: cfg?.dotColor || '#A6A6A6' }} />
                {cfg?.label || promo.status}
              </span>
              {promo.status === 'confirmed' && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 14 }}>
                  {promo.id.charCodeAt(promo.id.length - 1) % 2 === 0 ? 'System' : 'Merchant'}
                </span>
              )}
            </span>
          </div>
          <div className="ap-info-field">
            <span className="ap-info-label">Promotion Date</span>
            <span className="ap-info-value">{promo.start} ~ {promo.end}</span>
          </div>
          <div className="ap-info-field">
            <span className="ap-info-label">Auto-Confirm Date</span>
            <span className="ap-info-value">{promo.end}</span>
          </div>
          <div className="ap-info-field">
            <span className="ap-info-label">Last Update Time</span>
            <span className="ap-info-value">{lastUpdateTime}</span>
          </div>
        </div>
      </div>

      {/* Action card */}
      <div className="action-panel">
        <div className="ap-header">
          <span className="ap-title">Action</span>
        </div>
        <div className="ap-section">
          {!isViewMode && (
            <>
              <button className="ap-btn ap-btn-primary" onClick={onConfirm}>Confirm</button>
              {version !== 'v3' && (
                <button className="ap-btn ap-btn-outline" onClick={onBatchUpload}>Batch Upload</button>
              )}
              <button className="ap-btn ap-btn-outline" onClick={onSaveAsDraft}>Save as Draft</button>
            </>
          )}
          <button className="ap-btn ap-btn-outline" onClick={onAuditHistory}>Log</button>
        </div>
      </div>
    </div>
  );
}
