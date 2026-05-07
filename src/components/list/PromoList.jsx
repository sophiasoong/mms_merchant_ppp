import { useMemo, useState } from 'react';
import PromoToolbar from './PromoToolbar.jsx';
import PromoTable from './PromoTable.jsx';
import PromoPanel from './PromoPanel.jsx';

export default function PromoList({
  promotions,
  searchType, searchQuery, statusFilter, dateStartFilter, dateEndFilter,
  onSearchTypeChange, onSearchQueryChange, onStatusFilterChange,
  onDateStartChange, onDateEndChange, onClearFilters,
  onEnroll, onViewDetail, joinedIds = new Set(), onPreview, onExitProgram,
}) {
  const [selectedId, setSelectedId] = useState(() => promotions[0]?.id ?? null);
  const [exitedIds,  setExitedIds]  = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const ds = dateStartFilter.trim();
    const de = dateEndFilter.trim();
    return promotions.filter(row => {
      let matchSearch = true;
      if (q) {
        matchSearch = searchType === 'storefront'
          ? row.storefrontCode.toLowerCase().includes(q)
          : row.id.toLowerCase().includes(q);
      }
      const matchStatus = !statusFilter || row.status === statusFilter;
      const matchDateStart = !ds || row.start >= ds;
      const matchDateEnd   = !de || row.end <= de;
      return matchSearch && matchStatus && matchDateStart && matchDateEnd;
    });
  }, [promotions, searchType, searchQuery, statusFilter, dateStartFilter, dateEndFilter]);

  const total        = promotions.length;
  const selectedPromo = promotions.find(p => p.id === selectedId) ?? null;

  function handleRowClick(id) {
    setSelectedId(prev => (prev === id ? null : id));
  }

  function handleExit(id) {
    setExitedIds(prev => new Set([...prev, id]));
    // bubble up so App can update the promotion status
    onExitProgram?.(id);
  }

  return (
    <div className="view active" id="view-list">
      <nav className="breadcrumb">
        <a>Home</a><span className="breadcrumb-sep">›</span>
        <a>Promotion Management</a><span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Personal Price Promotion</span>
      </nav>

      <div className="page-header">
        <h1 className="page-title">Personal Price Promotion</h1>
      </div>
      <p className="page-description">
        Personal Price Promotion (PPP) offers personalised discounts to targeted customers based on their shopping behaviour. Enrolled merchants participate in monthly promotion cycles — review your eligible SKUs, set PPP prices, and confirm your SKU list before each cycle's deadline.
      </p>

      {selectedPromo && (
        <div className="promo-panel-center-wrap">
          <PromoPanel
            promo={selectedPromo}
            allPromos={promotions}
            isExited={exitedIds.has(selectedPromo.id)}
            isJoined={joinedIds.has(selectedPromo.id)}
            onExit={handleExit}
            onEnroll={onEnroll}
            onViewDetail={onViewDetail}
          />
        </div>
      )}

      <div className="promo-list-body">
        <div className="card">
          <PromoToolbar
            searchType={searchType}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            dateStartFilter={dateStartFilter}
            dateEndFilter={dateEndFilter}
            onSearchTypeChange={onSearchTypeChange}
            onSearchQueryChange={onSearchQueryChange}
            onStatusFilterChange={onStatusFilterChange}
            onDateStartChange={onDateStartChange}
            onDateEndChange={onDateEndChange}
            onClearFilters={onClearFilters}
            resultCount={filtered.length}
            totalCount={total}
          />

          <PromoTable
            rows={filtered}
            onEnroll={onEnroll}
            onPreview={onPreview}
            selectedId={selectedId}
            onRowClick={handleRowClick}
          />

          <div className="pagination">
            <span className="pag-info">
              {filtered.length === 0 ? '0 results'
                : filtered.length === total
                  ? `1–${Math.min(10, total)} of ${total} results`
                  : `${filtered.length} of ${total} results`}
            </span>
            <button className="pag-btn" disabled>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="pag-btn active">1</button>
            <button className="pag-btn">2</button>
            <button className="pag-btn">3</button>
            <span className="pag-ellipsis">…</span>
            <button className="pag-btn">5</button>
            <button className="pag-btn">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
