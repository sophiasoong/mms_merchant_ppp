import { useState } from 'react';

function fmtDate(dt) {
  return dt.toISOString().slice(0, 10);
}

export default function TcModal({ open, promo, storefrontCode, onClose, onJoin, readOnly = false }) {
  const [agreed, setAgreed] = useState(false);

  if (!promo) return null;

  const d = new Date(promo.start);
  const monthName = d.toLocaleString('en-US', { month: 'short' });
  const cycleLabel = `${d.getFullYear()} / ${monthName}`;

  const enrollDeadline = new Date(promo.start);
  enrollDeadline.setDate(enrollDeadline.getDate() - 7);

  const skuWindowEnd = new Date(promo.start);
  skuWindowEnd.setDate(skuWindowEnd.getDate() + 9);

  function handleJoin() {
    setAgreed(false);
    onJoin(promo);
  }

  function handleClose() {
    setAgreed(false);
    onClose();
  }

  return (
    <div
      className={`tc-overlay${open ? ' open' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="tc-modal">
        {/* Header */}
        <div className="tc-header">
          <div className="tc-header-left">
            <span className="tc-title">Merchant PPP Program</span>
            <span className="tc-storefront-code">{storefrontCode}</span>
            <span className="tc-cycle-tag">
              PPP Cycle: <strong>{cycleLabel}</strong>
            </span>
            <span className="tc-cycle-badge">
              <span className="tc-cycle-badge-dot"></span>Open
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span className="tc-email-reminder">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Email reminders active
            </span>
            <button className="tc-close" onClick={handleClose}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Key dates strip */}
        <div className="tc-dates">
          <div className="tc-date-item">
            <span className="tc-date-label">Promotion Period</span>
            <div className="tc-date-val-row">
              <svg className="tc-date-icon" width="14" height="14" fill="none" stroke="#FA8C16" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="tc-date-val orange">{promo.start} → {promo.end}</span>
            </div>
          </div>
          <div className="tc-date-item">
            <span className="tc-date-label">Enrollment Deadline</span>
            <div className="tc-date-val-row">
              <svg className="tc-date-icon" width="14" height="14" fill="none" stroke="#FA8C16" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="tc-date-val orange">{fmtDate(enrollDeadline)}</span>
            </div>
          </div>
          <div className="tc-date-item">
            <span className="tc-date-label">SKU Confirm Window</span>
            <div className="tc-date-val-row">
              <svg className="tc-date-icon" width="14" height="14" fill="none" stroke="#1890FF" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span className="tc-date-val blue">{promo.start} → {fmtDate(skuWindowEnd)}</span>
            </div>
          </div>
          <div className="tc-date-item">
            <span className="tc-date-label">Category Discount</span>
            <div className="tc-date-val-row">
              <svg className="tc-date-icon" width="14" height="14" fill="none" stroke="#52C41A" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
              <span className="tc-date-val green">Up to 7% (by category)</span>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="tc-body">
          <div className="tc-what-box">
            <div className="tc-what-icon">i</div>
            <div>
              <div className="tc-what-title">What is the PPP (Personal Price Program)?</div>
              <div className="tc-what-desc">The Personal Price Program gives eligible customers personalised discounts on your products based on their purchase history. Once enrolled, HKTVmall's system automatically calculates a PPP price for each eligible SKU using the average selling price and category discount rate. Prices are locked after you confirm (or at the confirmation deadline).</div>
            </div>
          </div>

          <div className="tc-steps">
            <div className="tc-step">
              <div className="tc-step-num">01</div>
              <div>
                <div className="tc-step-title">Enroll</div>
                <div className="tc-step-desc">Join the PPP program before the enrollment deadline.</div>
              </div>
            </div>
            <div className="tc-step">
              <div className="tc-step-num">02</div>
              <div>
                <div className="tc-step-title">Review SKUs</div>
                <div className="tc-step-desc">Preview eligible SKUs and PPP prices. Exclude up to 10% of SKUs.</div>
              </div>
            </div>
            <div className="tc-step">
              <div className="tc-step-num">03</div>
              <div>
                <div className="tc-step-title">Confirm &amp; Lock</div>
                <div className="tc-step-desc">Confirm your SKU list and lock prices for the promotion period.</div>
              </div>
            </div>
          </div>

          <div className="tc-section-title">Terms &amp; Conditions</div>
          <div className="tc-terms-box">
            <ol>
              <li><b>Enrollment Persistence</b><span>Once enrolled, your participation persists for subsequent PPP rounds unless you manually opt out. Exit requests take effect from the start of the next PPP promotion period.</span></li>
              <li><b>SKU Exclusion Limit</b><span>You may exclude up to 10% of your eligible SKU count per store. Exclusions must be submitted before the SKU confirm window closes at 23:59 on the end date.</span></li>
              <li><b>Price Lock</b><span>By confirming, you acknowledge that the displayed avg_psp and ppp_price will be locked for the entire promotion period. No changes can be made after locking.</span></li>
              <li><b>Auto-Confirmation</b><span>If you do not confirm your SKU list before the confirm window deadline (23:59), the system will auto-confirm all non-excluded SKUs.</span></li>
              <li><b>Cost Bearer</b><span>The cost of the personalised discount is borne by the Merchant by default. Please review your SKU PPP prices carefully before confirming.</span></li>
            </ol>
          </div>

          {!readOnly && (
            <label className="tc-agree">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
              />
              I have read and agree to the PPP Program Terms &amp; Conditions
            </label>
          )}
        </div>

        {/* Footer — hidden in read-only mode */}
        {!readOnly && (
          <div className="tc-footer">
            <button className="tc-btn-learn" onClick={handleClose}>Learn More</button>
            <button className="tc-btn-join" disabled={!agreed} onClick={handleJoin}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Join Program
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
