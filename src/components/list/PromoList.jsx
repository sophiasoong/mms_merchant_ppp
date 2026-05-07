import { useMemo, useState } from 'react';
import PromoToolbar from './PromoToolbar.jsx';
import PromoTable from './PromoTable.jsx';
import PromoPanel from './PromoPanel.jsx';
import StoreStatusDetail from './StoreStatusDetail.jsx';

export default function PromoList({
  promotions, version = 'v1',
  searchType, searchQuery, statusFilter, dateStartFilter, dateEndFilter,
  onSearchTypeChange, onSearchQueryChange, onStatusFilterChange,
  onDateStartChange, onDateEndChange, onClearFilters,
  onEnroll, onViewDetail, joinedIds = new Set(), onPreview, onExitProgram,
}) {
  const [selectedId,       setSelectedId]       = useState(() => promotions[0]?.id ?? null);
  const [exitedIds,        setExitedIds]        = useState(() => new Set());
  const [showStoreDetail,  setShowStoreDetail]  = useState(false);

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

  const total         = promotions.length;
  const selectedPromo = promotions.find(p => p.id === selectedId) ?? null;

  function handleRowClick(id) {
    setSelectedId(prev => (prev === id ? null : id));
  }

  function handleExit(id) {
    setExitedIds(prev => new Set([...prev, id]));
    onExitProgram?.(id);
  }

  const promoPanelProps = {
    promo: selectedPromo,
    allPromos: promotions,
    isExited: exitedIds.has(selectedPromo?.id),
    isJoined: joinedIds.has(selectedPromo?.id),
    onExit: handleExit,
    onEnroll,
    onViewDetail,
  };

  const toolbar = (
    <PromoToolbar
      searchType={searchType} searchQuery={searchQuery}
      statusFilter={statusFilter} dateStartFilter={dateStartFilter} dateEndFilter={dateEndFilter}
      onSearchTypeChange={onSearchTypeChange} onSearchQueryChange={onSearchQueryChange}
      onStatusFilterChange={onStatusFilterChange} onDateStartChange={onDateStartChange}
      onDateEndChange={onDateEndChange} onClearFilters={onClearFilters}
      resultCount={filtered.length} totalCount={total}
    />
  );

  const table = (
    <PromoTable rows={filtered} onEnroll={onEnroll} onPreview={onPreview} selectedId={selectedId} onRowClick={handleRowClick} />
  );

  const pagination = <PaginationBar filtered={filtered} total={total} />;

  if (showStoreDetail) {
    return <StoreStatusDetail onBack={() => setShowStoreDetail(false)} />;
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

      {/* v1 — PromoPanel as side panel to the right of the table */}
      {version === 'v1' && (
        <div className="promo-list-body side-panel">
          <div className="card">{toolbar}{table}{pagination}</div>
          {selectedPromo && <PromoPanel {...promoPanelProps} layout="side" />}
        </div>
      )}

      {/* v2 — PromoPanel centered above the table */}
      {version === 'v2' && (
        <>
          {selectedPromo && (
            <div className="promo-panel-center-wrap">
              <PromoPanel {...promoPanelProps} />
            </div>
          )}
          <div className="promo-list-body">
            <div className="card">{toolbar}{table}{pagination}</div>
          </div>
        </>
      )}

      {/* v3 — status dashboard + program cycles table */}
      {version === 'v3' && (
        <>
          {/* Program Status by Stores dashboard */}
          <div className="card v3-status-card">
            <div className="v3-status-header">
              <span className="v3-status-title">Program Status by Stores</span>
              <button className="v3-view-detail-btn" onClick={() => setShowStoreDetail(true)}>View Detail</button>
            </div>
            <div className="v3-status-grid">
              <div className="v3-stat-item v3-stat-open">
                <span className="v3-stat-label">Open</span>
                <span className="v3-stat-value">2</span>
              </div>
              <div className="v3-stat-divider" />
              <div className="v3-stat-item v3-stat-rejected">
                <span className="v3-stat-label">Exit Rejected</span>
                <span className="v3-stat-value">1</span>
              </div>
              <div className="v3-stat-divider" />
              <div className="v3-stat-item v3-stat-scheduled">
                <span className="v3-stat-label">Exit Scheduled</span>
                <span className="v3-stat-value">3</span>
              </div>
              <div className="v3-stat-divider" />
              <div className="v3-stat-item v3-stat-optedout">
                <span className="v3-stat-label">Opted Out</span>
                <span className="v3-stat-value">2</span>
              </div>
            </div>
          </div>

          {/* Program Cycles table */}
          <div className="card v3-table-card">
            <div className="v3-table-title">Program Cycles</div>
            {toolbar}{table}{pagination}
          </div>
        </>
      )}
    </div>
  );
}

function PaginationBar({ filtered, total }) {
  return (
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
  );
}
