import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SKU_PART_CONFIG } from '../../data/skus.js';

function SortIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 10 12" fill="#A6A6A6" style={{ verticalAlign: 'middle' }}>
      <path d="M5 1L9 5H1L5 1Z"/>
      <path d="M5 11L1 7H9L5 11Z"/>
    </svg>
  );
}

function InfoIcon({ text }) {
  const [pos, setPos] = useState(null);
  const iconRef = useRef(null);

  function handleMouseEnter() {
    const r = iconRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.top - 8, left: r.left + r.width / 2 });
  }

  return (
    <span
      ref={iconRef}
      className="info-icon-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A6A6A6" strokeWidth="2" style={{ verticalAlign: 'middle', flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {pos && createPortal(
        <div className="info-tooltip-fixed" style={{ top: pos.top, left: pos.left }}>
          {text}
        </div>,
        document.body
      )}
    </span>
  );
}

export default function SkuTable({ rows, checkedIds, onToggleRow, onToggleAll, limitHit, unchecked, threshold, isConfirmed, viewMode = 'edit' }) {
  const isViewMode = viewMode === 'view';
  const selectAllRef = useRef(null);
  const total = rows.length;
  const checkedCount = rows.filter(r => checkedIds.has(r.id)).length;

  useEffect(() => {
    if (!selectAllRef.current) return;
    if (checkedCount === 0) {
      selectAllRef.current.checked = false;
      selectAllRef.current.indeterminate = false;
    } else if (checkedCount === total) {
      selectAllRef.current.checked = true;
      selectAllRef.current.indeterminate = false;
    } else {
      selectAllRef.current.checked = false;
      selectAllRef.current.indeterminate = true;
    }
  }, [checkedCount, total]);

  function handleToggleAll(e) {
    onToggleAll(e.target.checked);
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {!isViewMode && (
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  className="sku-checkbox"
                  ref={selectAllRef}
                  onChange={handleToggleAll}
                />
              </th>
            )}
            <th>Image</th>
            <th className="sortable">
              SKU ID{' '}<SortIcon />
            </th>
            <th>Brand</th>
            <th>SKU Name</th>
            <th>Category</th>
            <th className="sortable">
              Original Price{' '}<SortIcon />
            </th>
            <th className="sortable">
              Selling Price{' '}<SortIcon />
            </th>
            <th><span className="th-with-info">Avg PSP <InfoIcon text="Average Selling Price — the average price at which this SKU has been sold in the past period." /></span></th>
            <th><span className="th-with-info">PPP Price <InfoIcon text="Personal Price Program price — the personalised discounted price offered to eligible customers based on their purchase history." /></span></th>
            <th>Cost Bearer</th>
            <th style={{ maxWidth: '80px', whiteSpace: 'normal', lineHeight: '1.3' }}>Category<br/>Discount Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(sku => {
            const isChecked = checkedIds.has(sku.id);
            const partCfg = SKU_PART_CONFIG[sku.partStatus];
            // Disable checked boxes when limit hit; never disable unchecked ones
            const isDisabled = isChecked && limitHit;

            const pppCell = sku.pppPrice
              ? <span className="ppp-value">HKD {sku.pppPrice}</span>
              : <span className="no-action">—</span>;

            return (
              <tr key={sku.id}>
                {!isViewMode && (
                  <td>
                    <input
                      type="checkbox"
                      className="sku-checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={e => onToggleRow(sku.id, e.target.checked)}
                    />
                  </td>
                )}
                <td>
                  <div className="sku-img">
                    <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <path d="M3 9l4-4 4 4 4-4 4 4"/>
                      <circle cx="8.5" cy="14.5" r="1.5"/>
                    </svg>
                  </div>
                </td>
                <td style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 400 }}>{sku.id}</td>
                <td>{sku.brand}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sku.name}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{sku.cat}</td>
                <td><span className="price-orig">HKD {sku.origPrice}</span></td>
                <td><span className="price-sell">HKD {sku.sellPrice}</span></td>
                <td><span className="price-psp">HKD {sku.avgPsp}</span></td>
                <td>{pppCell}</td>
                <td><span className="cost-bearer">Merchant</span></td>
                <td><span className="discount-rate">{sku.discRate}</span></td>
                <td>
                  <span className="dot-tag">
                    <span className="dot-tag-dot" style={{ background: partCfg.dotColor }} />{partCfg.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
