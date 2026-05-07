import { useMemo, useState, useCallback } from 'react';
import SkuToolbar from './SkuToolbar.jsx';
import SkuTable from './SkuTable.jsx';
import ActionPanel from './ActionPanel.jsx';

export default function SkuPreview({
  promo, skuRows,
  skuSearch, categoryFilter,
  viewMode = 'edit', version = 'v1',
  onSkuSearchChange, onCategoryChange,
  onShowList,
  onOpenConfirmDialog, onOpenOptOutDialog,
  onBatchUpload, onAuditHistory,
  onSaveAsDraft, draftToastVisible,
}) {
  const isViewMode = viewMode === 'view';
  const isConfirmed = promo?.status === 'confirmed';

  // checkedIds: Set of checked SKU ids — all checked by default
  const [checkedIds, setCheckedIds] = useState(() => new Set(skuRows.map(s => s.id)));

  const filteredRows = useMemo(() => {
    const q = skuSearch.trim().toLowerCase();
    return skuRows.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchCat = !categoryFilter || categoryFilter.length === 0 || categoryFilter.includes(s.cat);
      return matchQ && matchCat;
    });
  }, [skuRows, skuSearch, categoryFilter]);

  const total = filteredRows.length;
  const threshold = Math.ceil(total * 0.1);
  const unchecked = filteredRows.filter(r => !checkedIds.has(r.id)).length;
  const limitHit = unchecked >= threshold;

  const handleToggleRow = useCallback((skuId, checked) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (checked) next.add(skuId);
      else next.delete(skuId);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback((checked) => {
    if (checked) {
      setCheckedIds(new Set(filteredRows.map(r => r.id)));
    } else {
      // Only uncheck non-disabled rows (i.e., unchecked ones — since limitHit would disable checked ones)
      // In toggleAll context, just set all to unchecked/checked
      if (!limitHit || !checked) {
        setCheckedIds(new Set());
      }
    }
  }, [filteredRows, limitHit]);

  let selectionBarMsg = null;
  if (total > 0) {
    if (limitHit) {
      selectionBarMsg = `Deselection limit reached — ${unchecked} of ${total} SKUs deselected (max ${threshold}, 10%). Uncheck a previously deselected row to re-enable others.`;
    } else if (unchecked > 0) {
      selectionBarMsg = `${unchecked} SKU${unchecked > 1 ? 's' : ''} deselected — you may deselect up to ${threshold} SKU${threshold > 1 ? 's' : ''} (10% of ${total}).`;
    }
  }

  return (
    <div className="view active" id="view-sku">
      <nav className="breadcrumb">
        <a onClick={onShowList}>Home</a><span className="breadcrumb-sep">›</span>
        <a onClick={onShowList}>Promotion Management</a><span className="breadcrumb-sep">›</span>
        <a onClick={onShowList}>Personal Price Promotion</a><span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Confirm SKU and Lock Price</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Confirm SKU and Lock Price</h1>
        {draftToastVisible && (
          <div className="draft-toast">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div>
              <div className="draft-toast-title">Draft saved successfully.</div>
              <div className="draft-toast-body">Please note that this SKU list will be automatically confirmed on 2026-03-01 and cannot be edited thereafter.</div>
            </div>
          </div>
        )}
      </div>

      {!isViewMode && unchecked === 0 && (
        <div className="sku-info-banner">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Deselect SKU from the list to exclude them from the program cycle. You may deselect up to 10% of the total SKU list.</span>
        </div>
      )}
      {!isViewMode && selectionBarMsg && (
        <div className="selection-bar">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>{selectionBarMsg}</span>
        </div>
      )}

      <div className="sku-view-body">
        {/* Left: main table card */}
        <div className="sku-main">
          <div className="card">

            <SkuToolbar
              skuSearch={skuSearch}
              categoryFilter={categoryFilter}
              onSkuSearchChange={onSkuSearchChange}
              onCategoryChange={onCategoryChange}
              resultCount={filteredRows.length}
              version={version}
              onBatchUpload={version === 'v3' ? onBatchUpload : undefined}
            />

            <SkuTable
              rows={filteredRows}
              checkedIds={checkedIds}
              onToggleRow={handleToggleRow}
              onToggleAll={handleToggleAll}
              limitHit={limitHit}
              unchecked={unchecked}
              threshold={threshold}
              isConfirmed={isConfirmed}
              viewMode={viewMode}
            />

            <div className="pagination">
              <span className="pag-info">1–{Math.min(10, total)} of {total} results</span>
              <button className="pag-btn" disabled>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="pag-btn active">1</button>
              <button className="pag-btn">2</button>
              <button className="pag-btn">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right: info card + action panel */}
        <ActionPanel
          promo={promo}
          viewMode={viewMode}
          version={version}
          onConfirm={() => onOpenConfirmDialog('confirm', checkedIds)}
          onOptOut={() => onOpenOptOutDialog('optout')}
          onBatchUpload={onBatchUpload}
          onAuditHistory={onAuditHistory}
          onSaveAsDraft={onSaveAsDraft}
        />
      </div>
    </div>
  );
}
