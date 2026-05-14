import { useState, useEffect } from 'react';
import { SKU_PART_CONFIG } from '../../data/skus.js';

export default function ConfirmPreview({ open, promo, skuRows, checkedIds, onClose, onConfirm, onSaveAsDraft }) {
  const [activeTab, setActiveTab] = useState('included');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  // Reset tab when modal opens
  useEffect(() => {
    if (open) setActiveTab('included');
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const included = skuRows.filter(r => checkedIds.has(r.id));
  const excluded = skuRows.filter(r => !checkedIds.has(r.id));
  const rows = activeTab === 'included' ? included : excluded;
  const partStatus = activeTab === 'included' ? 'locked' : 'excluded';

  return (
    <div
      className="confirm-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="confirm-modal">
        {/* Header */}
        <div className="confirm-modal-header">
          <h2 className="confirm-modal-title">Confirm</h2>
          <button className="confirm-modal-close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="confirm-tabs">
          <button
            className={`confirm-tab ${activeTab === 'included' ? 'confirm-tab-active' : ''}`}
            onClick={() => setActiveTab('included')}
          >
            <span className="badge-dot" style={{ background: '#FA8C16' }} />
            Included SKUs
            <span className="confirm-tab-count">{included.length}</span>
          </button>
          <button
            className={`confirm-tab ${activeTab === 'excluded' ? 'confirm-tab-active' : ''}`}
            onClick={() => setActiveTab('excluded')}
          >
            <span className="badge-dot" style={{ background: '#A6A6A6' }} />
            Excluded SKUs
            <span className="confirm-tab-count">{excluded.length}</span>
          </button>
        </div>

        {/* Scrollable table body */}
        <div className="confirm-modal-body">
          <SkuTable rows={rows} partStatus={partStatus} />
        </div>

        {/* Footer */}
        <div className="confirm-modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save-draft" onClick={onSaveAsDraft}>Save as Draft</button>
          <button className="btn-confirm-final" onClick={() => setShowConfirmAlert(true)}>Confirm</button>
        </div>
      </div>

      {/* Confirm lock alert */}
      {showConfirmAlert && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          onClick={e => { if (e.target === e.currentTarget) setShowConfirmAlert(false); }}
        >
          <div style={{ background: '#fff', borderRadius: 6, boxShadow: '0px 2px 8px #D9D9D9', padding: '32px 32px 24px', width: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'rgba(0,0,0,0.87)', lineHeight: 1.2, margin: 0 }}>
                Confirm & Lock Prices
              </p>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5, margin: 0 }}>
                By confirming you lock the avg listing prices and PPP prices for the PPP period {promo?.start} to {promo?.end}.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirmAlert(false)}
                style={{ height: 32, padding: '0 16px', borderRadius: 6, cursor: 'pointer', background: '#fff', border: '1px solid #5244EE', color: '#5244EE', fontSize: 14, fontWeight: 400 }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowConfirmAlert(false); onConfirm(); }}
                style={{ height: 32, padding: '0 16px', borderRadius: 6, cursor: 'pointer', background: '#5244EE', border: 'none', color: '#fff', fontSize: 14, fontWeight: 400 }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkuTable({ rows, partStatus }) {
  const cfg = SKU_PART_CONFIG[partStatus];

  if (rows.length === 0) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No SKUs in this group.
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SKU Image</th>
            <th>SKU ID</th>
            <th>Brand</th>
            <th>SKU Name</th>
            <th>Original Price</th>
            <th>Selling Price</th>
            <th>Avg PSP</th>
            <th>PPP Price</th>
            <th>Cost Bearer</th>
            <th style={{ maxWidth: '80px', whiteSpace: 'normal', lineHeight: '1.3' }}>Category<br/>Discount Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(sku => (
            <tr key={sku.id}>
              <td>
                <div className="sku-img">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <path d="M3 9l4-4 4 4 4-4 4 4"/>
                    <circle cx="8.5" cy="14.5" r="1.5"/>
                  </svg>
                </div>
              </td>
              <td style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{sku.id}</td>
              <td>{sku.brand}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sku.name}</td>
              <td><span className="price-orig">HKD {sku.origPrice}</span></td>
              <td><span className="price-sell">HKD {sku.sellPrice}</span></td>
              <td><span className="price-psp">HKD {sku.avgPsp}</span></td>
              <td>
                {sku.pppPrice
                  ? <span className="ppp-value">HKD {sku.pppPrice}</span>
                  : <span className="no-action">—</span>}
              </td>
              <td><span className="cost-bearer">Merchant</span></td>
              <td><span className="discount-rate">{sku.discRate}</span></td>
              <td>
                <span className={`badge ${cfg.cls}`}>
                  <span className="badge-dot"></span>{cfg.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
