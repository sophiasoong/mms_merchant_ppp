import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
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
  onSaveAsDraft, draftToastVisible, onDismissToast,
}) {
  const isViewMode = viewMode === 'view';
  const isConfirmed = promo?.status === 'confirmed';

  const pageHeaderRef = useRef(null);
  const bannerRowRef = useRef(null);
  const toastTop = 84; // 68px topbar + 16px gap

  // checkedIds: Set of checked SKU ids — all checked by default
  const [checkedIds, setCheckedIds] = useState(() => new Set(skuRows.map(s => s.id)));

  const [statusFilter, setStatusFilter] = useState([]);

  const filteredRows = useMemo(() => {
    const q = skuSearch.trim().toLowerCase();
    return skuRows.filter(s => {
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchCat = !categoryFilter || categoryFilter.length === 0 || categoryFilter.includes(s.cat);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(s.partStatus);
      return matchQ && matchCat && matchStatus;
    });
  }, [skuRows, skuSearch, categoryFilter, statusFilter]);

  const PAGE_SIZE_OPTS = [20, 50, 100];
  const [pageSize, setPageSize] = useState(20);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [gotoVal, setGotoVal] = useState('');

  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // Reset to page 1 when filters or page size change
  useEffect(() => { setPage(1); }, [skuSearch, categoryFilter, statusFilter, pageSize]);

  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const threshold = Math.ceil(total * 0.1);
  const unchecked = filteredRows.filter(r => !checkedIds.has(r.id)).length;
  const limitHit = unchecked >= threshold;

  function goToPage(p) { setPage(Math.max(1, Math.min(pageCount, p))); }

  function getPageNumbers() {
    if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) pages.push(i);
    if (page < pageCount - 2) pages.push('…');
    pages.push(pageCount);
    return pages;
  }

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
        <a onClick={onShowList}>Home</a><span className="breadcrumb-sep">/</span>
        <a onClick={onShowList}>Promotion Management</a><span className="breadcrumb-sep">/</span>
        <a onClick={onShowList}>Personal Price Promotion</a><span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">Confirm SKU and Lock Price</span>
      </nav>

      <div className="page-header" ref={pageHeaderRef}>
        <h1 className="page-title">Confirm SKU and Lock Price</h1>
      </div>

      <div className="sku-view-body">
        <div className="sku-main">
          {/* Banners span only the table column width */}
          {!isViewMode && unchecked === 0 && (
            <div className="sku-banner-row" ref={bannerRowRef}>
              <div className="sku-info-banner">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>Deselect SKU from the list to exclude them from the program cycle. You may deselect up to 10% of the total SKU list.</span>
              </div>
            </div>
          )}
          {!isViewMode && selectionBarMsg && (
            <div className="sku-banner-row">
              <div className="selection-bar">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span>{selectionBarMsg}</span>
              </div>
            </div>
          )}
          {/* Table card + side panel side-by-side, both starting at the same top */}
          <div className="sku-content-row">
          <div className="sku-table-col">
          <div className="card">

            <SkuToolbar
              skuSearch={skuSearch}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              onSkuSearchChange={onSkuSearchChange}
              onCategoryChange={onCategoryChange}
              onStatusChange={setStatusFilter}
              resultCount={filteredRows.length}
              version={version}
              onBatchUpload={version === 'v3' ? onBatchUpload : undefined}
            />

            <SkuTable
              rows={pagedRows}
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
              <span className="pag-info">
                {total === 0 ? '0 results' : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total} results`}
              </span>

              {/* Prev */}
              <button className="pag-btn" onClick={() => goToPage(page - 1)} disabled={page === 1}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((p, i) =>
                p === '…'
                  ? <span key={`e${i}`} className="pag-ellipsis">…</span>
                  : <button key={p} className={`pag-btn${p === page ? ' active' : ''}`} onClick={() => goToPage(p)}>{p}</button>
              )}

              {/* Next */}
              <button className="pag-btn" onClick={() => goToPage(page + 1)} disabled={page === pageCount}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* Page size dropdown */}
              <div className="pag-pagesize-wrap" style={{ position: 'relative' }}>
                <button
                  className="pag-pagesize"
                  onClick={() => setPageSizeOpen(o => !o)}
                  onBlur={() => setTimeout(() => setPageSizeOpen(false), 150)}
                >
                  {pageSize} / page
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: 4 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {pageSizeOpen && (
                  <div className="pag-pagesize-dropdown">
                    {PAGE_SIZE_OPTS.map(opt => (
                      <button
                        key={opt}
                        className={`pag-pagesize-opt${opt === pageSize ? ' active' : ''}`}
                        onMouseDown={() => { setPageSize(opt); setPageSizeOpen(false); }}
                      >
                        {opt} / page
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Go to */}
              <span className="pag-goto-label">Go to</span>
              <input
                className="pag-goto-input"
                type="number"
                min="1"
                max={pageCount}
                value={gotoVal}
                onChange={e => setGotoVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const n = parseInt(gotoVal, 10);
                    if (!isNaN(n)) goToPage(n);
                    setGotoVal('');
                  }
                }}
              />
            </div>
          </div>
          </div>{/* sku-table-col */}

          {/* Right: info card + action panel — aligns with card top */}
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
          </div>{/* sku-content-row */}
        </div>{/* sku-main */}
      </div>

      {/* Toast — fixed overlay, 16px below page header */}
      {draftToastVisible && (
        <div className="draft-toast" style={{ top: toastTop }}>
          <svg className="draft-toast-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="8" fill="#52C41A"/>
            <polyline points="4.5,8.5 7,11 11.5,5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="draft-toast-body-wrap">
            <div className="draft-toast-title">Draft saved successfully.</div>
            <div className="draft-toast-body">Please note that this SKU list will be automatically confirmed on 2026-03-01 and cannot be edited thereafter.</div>
          </div>
          <button className="draft-toast-close" onClick={onDismissToast}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
