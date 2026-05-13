import { useState, useCallback, useEffect } from 'react';
import { Agentation } from 'agentation';
import Topbar from './components/layout/Topbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import PromoList from './components/list/PromoList.jsx';
import SkuPreview from './components/sku/SkuPreview.jsx';
import ConfirmPreview from './components/sku/ConfirmPreview.jsx';
import TcModal from './components/modals/TcModal.jsx';
import ConfirmDialog from './components/modals/ConfirmDialog.jsx';
import AuditModal from './components/modals/AuditModal.jsx';
import UploadModal from './components/modals/UploadModal.jsx';
import { PROMOTIONS_INITIAL, STORE_STATUS_DATA } from './data/promotions.js';
import { SKU_ROWS_INITIAL } from './data/skus.js';

// Generate merchant's own storefront code once per session
const MERCHANT_CODE = 'H2748138';

export default function App() {
  // ── View state ──────────────────────────────────────────────
  const [view, setView] = useState('list'); // 'list' | 'sku'
  const [skuViewMode, setSkuViewMode] = useState('edit'); // 'edit' | 'view'
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmCheckedIds, setConfirmCheckedIds] = useState(null);

  // ── Data state ───────────────────────────────────────────────
  const [promotions, setPromotions] = useState(() => PROMOTIONS_INITIAL);
  const [skuRows, setSkuRows] = useState(() => SKU_ROWS_INITIAL.map(r => ({ ...r })));
  const [currentPromo, setCurrentPromo] = useState(null);

  // ── Modal state ──────────────────────────────────────────────
  const [tcModalOpen, setTcModalOpen] = useState(false);
  const [tcPromo, setTcPromo] = useState(null);
  const [tcReadOnly, setTcReadOnly] = useState(false);
  const [joinedIds, setJoinedIds] = useState(() => new Set());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogType, setConfirmDialogType] = useState(null); // 'confirm' | 'optout'
  const [pendingCheckedIds, setPendingCheckedIds] = useState(null);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [draftToastVisible, setDraftToastVisible] = useState(false);

  // ── Promo list filter state ──────────────────────────────────
  const [searchType, setSearchType] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateStartFilter, setDateStartFilter] = useState('');
  const [dateEndFilter, setDateEndFilter] = useState('');

  // ── Version tab state ────────────────────────────────────────
  const [version, setVersion] = useState('v1');

  // ── v4 sub-page (lifted so Sidebar can drive it) ─────────────
  const [v4SubPage, setV4SubPage] = useState('program-cycles');

  // ── Sidebar open/closed ──────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── SKU filter state ─────────────────────────────────────────
  const [skuSearch, setSkuSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);

  // ── Figma capture URL-param bootstrap ───────────────────────
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('figmacapture');
    if (!v) return;
    if (v === 'sku-edit') {
      const promo = PROMOTIONS_INITIAL.find(p => p.status === 'pending_confirm');
      if (promo) {
        setCurrentPromo(promo);
        setSkuViewMode('edit');
        setSkuRows(SKU_ROWS_INITIAL.map(r => ({ ...r, partStatus: 'under_review' })));
        setView('sku');
      }
    } else if (v === 'sku-view') {
      const promo = PROMOTIONS_INITIAL.find(p => p.status === 'confirmed');
      if (promo) {
        setCurrentPromo(promo);
        setSkuViewMode('view');
        setSkuRows(SKU_ROWS_INITIAL.map(r => ({ ...r, partStatus: r.pppPrice ? 'locked' : 'excluded' })));
        setView('sku');
      }
    } else if (v === 'confirm') {
      const promo = PROMOTIONS_INITIAL.find(p => p.status === 'pending_confirm');
      if (promo) {
        const allIds = new Set(SKU_ROWS_INITIAL.map(r => r.id));
        // Exclude first 2 for demo
        const excluded = SKU_ROWS_INITIAL.slice(0, 2).map(r => r.id);
        excluded.forEach(id => allIds.delete(id));
        setCurrentPromo(promo);
        setSkuRows(SKU_ROWS_INITIAL.map(r => ({ ...r, partStatus: 'under_review' })));
        setConfirmCheckedIds(allIds);
        setView('confirm');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigation ───────────────────────────────────────────────
  const showList = useCallback(() => {
    setView('list');
    window.scrollTo(0, 0);
  }, []);

  const showSku = useCallback((promo, mode = 'edit') => {
    setCurrentPromo(promo);
    setSkuSearch('');
    setCategoryFilter([]);
    setSkuViewMode(mode);
    if (mode === 'view') {
      // Confirmed view: locked if has a PPP price, excluded otherwise
      setSkuRows(SKU_ROWS_INITIAL.map(r => ({
        ...r,
        partStatus: r.pppPrice ? 'locked' : 'excluded',
      })));
    } else {
      setSkuRows(SKU_ROWS_INITIAL.map(r => ({ ...r, partStatus: 'under_review' })));
    }
    setView('sku');
    window.scrollTo(0, 0);
  }, []);

  // ── Auto-open T&C on first visit to Program Cycles ──────────
  const [tcShowStores, setTcShowStores] = useState(false);

  // v1/v2/v3: once per session on mount
  useEffect(() => {
    if (sessionStorage.getItem('ppp_tc_shown')) return;
    const promo = PROMOTIONS_INITIAL[0];
    if (!promo) return;
    sessionStorage.setItem('ppp_tc_shown', '1');
    setTcPromo(promo);
    setTcReadOnly(false);
    setTcShowStores(true);
    setTcModalOpen(true);
  }, []);

  // v4: every time Program Cycles page becomes active (once per v4 session switch)
  useEffect(() => {
    if (version !== 'v4' || v4SubPage !== 'program-cycles') return;
    const promo = PROMOTIONS_INITIAL[0];
    if (!promo) return;
    setTcPromo(promo);
    setTcReadOnly(false);
    setTcShowStores(true);
    setTcModalOpen(true);
  }, [version, v4SubPage]);

  // ── Enroll: open T&C modal ───────────────────────────────────
  const handleEnroll = useCallback((promoId) => {
    const promo = promotions.find(p => p.id === promoId);
    if (!promo) return;
    setTcPromo(promo);
    setTcReadOnly(false);
    setTcModalOpen(true);
  }, [promotions]);

  // ── View Detail: open T&C modal in read-only mode ────────────
  const handleViewDetail = useCallback((promoId) => {
    const promo = promotions.find(p => p.id === promoId);
    if (!promo) return;
    setTcPromo(promo);
    setTcReadOnly(true);
    setTcModalOpen(true);
  }, [promotions]);

  // ── Preview: navigate directly to SKU page ───────────────────
  const handlePreview = useCallback((promoId) => {
    const promo = promotions.find(p => p.id === promoId);
    if (promo) showSku(promo, promo.status === 'confirmed' ? 'view' : 'edit');
  }, [promotions, showSku]);

  // ── Join PPP (T&C confirmed) ─────────────────────────────────
  const handleJoinPPP = useCallback((promo) => {
    setTcModalOpen(false);
    setTcPromo(null);
    setTcShowStores(false);
    setJoinedIds(prev => new Set([...prev, promo.id]));
    const updated = promotions.map(p =>
      p.id === promo.id ? { ...p, status: 'pending_confirm' } : p
    );
    setPromotions(updated);
    const updatedPromo = updated.find(p => p.id === promo.id);
    showSku(updatedPromo);
  }, [promotions, showSku]);

  // ── Exit Program ────────────────────────────────────────────
  const handleExitProgram = useCallback((promoId) => {
    setPromotions(prev =>
      prev.map(p => p.id === promoId ? { ...p, status: 'exit_scheduled' } : p)
    );
  }, []);

  // ── Show confirm modal ───────────────────────────────────────
  const handleShowConfirmPreview = useCallback((checkedIds) => {
    setConfirmCheckedIds(checkedIds);
    setConfirmModalOpen(true);
  }, []);

  // ── Final confirmation: lock/exclude SKUs, update promo status
  const handleFinalConfirm = useCallback(() => {
    if (!confirmCheckedIds) return;
    setSkuRows(prev =>
      prev.map(sku => ({
        ...sku,
        partStatus: confirmCheckedIds.has(sku.id) ? 'locked' : 'excluded',
      }))
    );
    if (currentPromo) {
      setPromotions(prev =>
        prev.map(p => p.id === currentPromo.id ? { ...p, status: 'confirmed' } : p)
      );
      setCurrentPromo(prev => ({ ...prev, status: 'confirmed' }));
    }
    setConfirmCheckedIds(null);
    setConfirmModalOpen(false);
    setSkuViewMode('view');
    window.scrollTo(0, 0);
  }, [confirmCheckedIds, currentPromo]);

  // ── Save as Draft toast ──────────────────────────────────────
  const handleSaveAsDraft = useCallback(() => {
    setConfirmModalOpen(false);
    setDraftToastVisible(true);
    setTimeout(() => setDraftToastVisible(false), 5000);
  }, []);

  // ── Legacy dialog handlers (opt-out still uses modal) ────────
  const handleOpenConfirmDialog = useCallback((type, checkedIds) => {
    if (type === 'confirm') {
      handleShowConfirmPreview(checkedIds);
    }
  }, [handleShowConfirmPreview]);

  const handleOpenOptOutDialog = useCallback((type) => {
    setConfirmDialogType(type);
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmDialog = useCallback((type) => {
    setConfirmDialogOpen(false);
    setConfirmDialogType(null);
    setPendingCheckedIds(null);
  }, []);

  // ── Promo filter handlers ────────────────────────────────────
  const handleSearchTypeChange = useCallback((type) => {
    setSearchType(type);
    setSearchQuery('');
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter(null);
    setDateStartFilter('');
    setDateEndFilter('');
  }, []);

  return (
    <>
      <Topbar version={version} onVersionChange={setVersion} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(o => !o)} />
      <div className={`shell${sidebarOpen ? '' : ' sidebar-closed'}`}>
        <Sidebar open={sidebarOpen} version={version} v4SubPage={v4SubPage} onV4SubPageChange={setV4SubPage} onNavigateToList={showList} />
        <main className="main">
          {view === 'list' ? (
            <PromoList
              promotions={promotions}
              searchType={searchType}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              dateStartFilter={dateStartFilter}
              dateEndFilter={dateEndFilter}
              onSearchTypeChange={handleSearchTypeChange}
              onSearchQueryChange={setSearchQuery}
              onStatusFilterChange={setStatusFilter}
              onDateStartChange={setDateStartFilter}
              onDateEndChange={setDateEndFilter}
              onClearFilters={handleClearFilters}
              onEnroll={handleEnroll}
              onViewDetail={handleViewDetail}
              joinedIds={joinedIds}
              onPreview={handlePreview}
              onExitProgram={handleExitProgram}
              version={version}
              v4SubPage={v4SubPage}
            />
          ) : (
            <SkuPreview
              promo={currentPromo}
              skuRows={skuRows}
              skuSearch={skuSearch}
              categoryFilter={categoryFilter}
              viewMode={skuViewMode}
              version={version}
              onSkuSearchChange={setSkuSearch}
              onCategoryChange={setCategoryFilter}
              onShowList={showList}
              onOpenConfirmDialog={handleOpenConfirmDialog}
              onOpenOptOutDialog={handleOpenOptOutDialog}
              onBatchUpload={() => setUploadModalOpen(true)}
              onAuditHistory={() => setAuditModalOpen(true)}
              onSaveAsDraft={handleSaveAsDraft}
              draftToastVisible={draftToastVisible}
              onDismissToast={() => setDraftToastVisible(false)}
            />
          )}
        </main>
      </div>

      {/* Confirm SKUs full-page modal */}
      <ConfirmPreview
        open={confirmModalOpen}
        promo={currentPromo}
        skuRows={skuRows}
        checkedIds={confirmCheckedIds ?? new Set()}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleFinalConfirm}
        onSaveAsDraft={handleSaveAsDraft}
      />

      {/* Modals */}
      <TcModal
        open={tcModalOpen}
        promo={tcPromo}
        storefrontCode={MERCHANT_CODE}
        storefrontCodes={STORE_STATUS_DATA.filter(r => r.status === 'open').map(r => r.storefrontCode)}
        readOnly={tcReadOnly}
        showStoreSelection={tcShowStores}
        onClose={() => { setTcModalOpen(false); setTcPromo(null); setTcReadOnly(false); setTcShowStores(false); }}
        onJoin={handleJoinPPP}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        type={confirmDialogType}
        onClose={() => { setConfirmDialogOpen(false); setConfirmDialogType(null); }}
        onConfirm={handleConfirmDialog}
      />
      <AuditModal
        open={auditModalOpen}
        promo={currentPromo}
        onClose={() => setAuditModalOpen(false)}
      />
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      <Agentation endpoint="http://localhost:4747" />
    </>
  );
}
