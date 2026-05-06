import { useState } from 'react';
import { DIALOG_CONFIG } from '../../data/promotions.js';

export default function ConfirmDialog({ open, type, onClose, onConfirm }) {
  const [processing, setProcessing] = useState(false);

  if (!type) return null;
  const cfg = DIALOG_CONFIG[type];

  function handleConfirm() {
    setProcessing(true);
    setTimeout(() => {
      onConfirm(type);
      setProcessing(false);
    }, 800);
  }

  return (
    <div
      className={`dialog-overlay${open ? ' open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dialog-box">
        <div className={`dialog-icon ${cfg.iconCls}`} dangerouslySetInnerHTML={{ __html: cfg.iconSvg }} />
        <div className="dialog-title">{cfg.title}</div>
        <div className="dialog-body">{cfg.body}</div>
        <div className="dialog-footer">
          <button className="dialog-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className={`dialog-btn-ok ${cfg.okCls}`}
            disabled={processing}
            onClick={handleConfirm}
          >
            {processing ? 'Processing…' : cfg.okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
