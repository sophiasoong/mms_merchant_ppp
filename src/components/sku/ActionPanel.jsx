import { STATUS_CONFIG } from '../../data/promotions.js';

export default function ActionPanel({ promo, viewMode = 'edit', version = 'v1', onConfirm, onOptOut, onBatchUpload, onAuditHistory, onSaveAsDraft }) {
  const isViewMode = viewMode === 'view';
  if (!promo) return null;
  const cfg = STATUS_CONFIG[promo.status];

  return (
    <div className="ap-side-panel">
      {/* Program Detail card */}
      <div className="ap-info-card">
        <div className="ap-info-card-header">
          <span className="ap-info-card-title">Program Detail</span>
        </div>
        <div className="ap-info-body">
          <div className="ap-info-field">
            <span className="ap-info-label">Storefront Code</span>
            <span className="ap-info-value">{promo.storefrontCode}</span>
          </div>
          <div className="ap-info-field">
            <span className="ap-info-label">Enrollment Status</span>
            <span className="dot-tag">
              <span className="dot-tag-dot" style={{ background: cfg?.dotColor || '#A6A6A6' }} />
              {cfg?.label || promo.status}
            </span>
          </div>
          <div className="ap-info-field">
            <span className="ap-info-label">Promotion Date</span>
            <span className="ap-info-value">{promo.start} ~ {promo.end}</span>
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
          <button className="ap-btn ap-btn-outline" onClick={onAuditHistory}>Audit History</button>
        </div>
      </div>
    </div>
  );
}
