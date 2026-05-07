import { STATUS_CONFIG } from '../../data/promotions.js';

export default function ActionPanel({ promo, viewMode = 'edit', version = 'v1', onConfirm, onOptOut, onBatchUpload, onAuditHistory, onSaveAsDraft }) {
  const isViewMode = viewMode === 'view';
  if (!promo) return null;
  const cfg = STATUS_CONFIG[promo.status];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '216px', flexShrink: 0 }}>
      {/* Promotion info card */}
      <div className="ap-info-card">
        <div className="ap-info-row">
          <span className="ap-info-label">Storefront Code</span>
          <span className="ap-info-value">{promo.storefrontCode}</span>
        </div>
        <div className="ap-info-divider"></div>
        <div className="ap-info-row">
          <span className="ap-info-label">Enrollment Status</span>
          <span className={`badge ${cfg.cls}`} style={{ marginTop: '2px', alignSelf: 'flex-start', width: 'fit-content' }}>
            <span className="badge-dot"></span>{cfg.label}
          </span>
        </div>
        <div className="ap-info-divider"></div>
        <div className="ap-info-row">
          <span className="ap-info-label">Promotion Date</span>
          <span className="ap-info-value">{promo.start} ~ {promo.end}</span>
        </div>
      </div>

      {/* Action panel */}
      <div className="action-panel">
        <div className="ap-header">
          <span className="ap-title">Actions</span>
          <button className="ap-info-btn" title="More information">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </button>
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
          <button className="ap-btn ap-btn-outline" onClick={onAuditHistory}>Audit History</button>
        </div>
      </div>
    </div>
  );
}
