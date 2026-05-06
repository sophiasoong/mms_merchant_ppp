import { useRef, useEffect } from 'react';
import { SKU_PART_CONFIG } from '../../data/skus.js';

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
            <th>SKU Image</th>
            <th className="sortable">
              SKU ID{' '}
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
            </th>
            <th>Brand</th>
            <th>SKU Name</th>
            <th className="sortable">
              Original Price{' '}
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
            </th>
            <th className="sortable">
              Selling Price{' '}
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
            </th>
            <th>Avg PSP</th>
            <th>PPP Price</th>
            <th>Cost Bearer</th>
            <th>Category Discount Rate</th>
            <th>SKU Participation Status</th>
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
                <td><span className="price-orig">HKD {sku.origPrice}</span></td>
                <td><span className="price-sell">HKD {sku.sellPrice}</span></td>
                <td><span className="price-psp">HKD {sku.avgPsp}</span></td>
                <td>{pppCell}</td>
                <td><span className="cost-bearer">Merchant</span></td>
                <td><span className="discount-rate">{sku.discRate}</span></td>
                <td>
                  <span className={`badge ${partCfg.cls}`}>
                    <span className="badge-dot"></span>{partCfg.label}
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
