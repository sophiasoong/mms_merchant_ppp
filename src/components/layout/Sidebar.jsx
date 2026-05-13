import { useRef, useState, useLayoutEffect } from 'react';

function ChevronRight({ size = 12 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  );
}

function SidebarGroup({ label, children }) {
  return (
    <div className="sidebar-group">
      <div className="sidebar-group-header">
        <span>{label}</span>
        <ChevronUp />
      </div>
      <div className="sidebar-group-list">
        <div className="sidebar-group-border">
          {children}
        </div>
      </div>
    </div>
  );
}

const SIDEBAR_W  = 260;
const FLYOUT_W   = 260;
const PANEL_GAP  = 4;
const ITEM_H     = 40;
const FLYOUT_PAD = 12;
const FLYOUT_GAP = 4;
// PPP is the 4th item (index 3) inside the L2 panel
const PPP_INDEX_IN_L2 = 3;

const L2_LEFT = SIDEBAR_W + PANEL_GAP;
const L3_LEFT = SIDEBAR_W + PANEL_GAP + FLYOUT_W + PANEL_GAP;

export default function Sidebar({ open = true, version, v4SubPage, onV4SubPageChange, onNavigateToList }) {
  const pmRef    = useRef(null);
  const hideTimer = useRef(null);
  const [pmTop,   setPmTop]   = useState(0);
  const [showL2,  setShowL2]  = useState(false);
  const [showL3,  setShowL3]  = useState(false);

  useLayoutEffect(() => {
    if (version !== 'v4' || !pmRef.current) return;
    const measure = () => {
      const rect = pmRef.current?.getBoundingClientRect();
      if (rect) setPmTop(rect.top);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [version, open]);

  // L3 aligns vertically with PPP inside the L2 panel
  const l3Top = pmTop + FLYOUT_PAD + PPP_INDEX_IN_L2 * (ITEM_H + FLYOUT_GAP);

  // ── hover helpers ────────────────────────────────────────────
  function clearHide() { clearTimeout(hideTimer.current); }

  function scheduleHide() {
    hideTimer.current = setTimeout(() => {
      setShowL2(false);
      setShowL3(false);
    }, 150);
  }

  // Hovering the PM sidebar item → open L2, close L3
  const pmEnter = version === 'v4' ? () => { clearHide(); setShowL2(true); setShowL3(false); } : undefined;
  const pmLeave = version === 'v4' ? scheduleHide : undefined;

  // Hovering the L2 panel body → keep L2 open
  const l2Enter = () => { clearHide(); setShowL2(true); };
  const l2Leave = scheduleHide;

  // Hovering the PPP row inside L2 → open L3
  const pppEnter = () => { clearHide(); setShowL3(true); };
  // Not closing L3 on pppLeave — let the L3 panel itself handle that

  // Hovering the L3 panel → keep both open
  const l3Enter = () => { clearHide(); };
  const l3Leave = scheduleHide;

  return (
    <aside className={`sidebar${open ? '' : ' collapsed'}`}>
      <div className="sidebar-menu">

        <SidebarGroup label="Main">
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="12" y2="16"/></svg>
            <span>Order Management</span>
            <ChevronRight />
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="16" y1="10" x2="8" y2="10"/></svg>
            <span>Product and Inventory</span>
            <ChevronRight />
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <span>Merchant Dashboard</span>
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>
            <span>Merchant Advertisement</span>
            <ChevronRight />
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span>Payment Center</span>
            <ChevronRight />
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span>Ratings and Reviews</span>
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Merchant</span>
            <ChevronRight />
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>System</span>
            <ChevronRight />
          </div>
        </SidebarGroup>

        <SidebarGroup label="Platform Support">
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
            <span>Return Request</span>
          </div>
        </SidebarGroup>

        <SidebarGroup label="HKTVmall">
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            <span>Store Management</span>
            <ChevronRight />
          </div>
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span>3PL</span>
            <ChevronRight />
          </div>

          {/* Promotion Management — triggers L2 flyout on hover in v4 */}
          <div
            ref={pmRef}
            className="sidebar-item active"
            onMouseEnter={pmEnter}
            onMouseLeave={pmLeave}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3"/></svg>
            <span>Promotion Management</span>
            <ChevronRight />
          </div>

          {/* In v1/v2/v3 show PPP inline as before */}
          {version !== 'v4' && (
            <button className="sidebar-sub-item active" onClick={onNavigateToList}>Personal Price Promotion</button>
          )}
        </SidebarGroup>

        <SidebarGroup label="ThePlace">
          <div className="sidebar-item">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Store Management</span>
            <ChevronRight />
          </div>
        </SidebarGroup>

      </div>

      {/* ── v4 flyout panels ──────────────────────────────────────── */}
      {version === 'v4' && open && showL2 && (
        <div
          className="sidebar-flyout"
          style={{ left: L2_LEFT, top: pmTop }}
          onMouseEnter={l2Enter}
          onMouseLeave={l2Leave}
        >
          <div className="sidebar-flyout-item">
            <span>Promotion Rule Management</span>
            <ChevronRight />
          </div>
          <div className="sidebar-flyout-item">
            <span>Buy More Save More</span>
            <ChevronRight />
          </div>
          <div className="sidebar-flyout-item">
            <span>Price Management</span>
            <ChevronRight />
          </div>
          <div
            className="sidebar-flyout-item active"
            onMouseEnter={pppEnter}
          >
            <span>Personal Price Promotion</span>
            <ChevronRight />
          </div>
        </div>
      )}

      {version === 'v4' && open && showL2 && showL3 && (
        <div
          className="sidebar-flyout"
          style={{ left: L3_LEFT, top: l3Top }}
          onMouseEnter={l3Enter}
          onMouseLeave={l3Leave}
        >
          <button
            className={`sidebar-flyout-item${v4SubPage === 'program-cycles' ? ' active' : ''}`}
            onClick={() => { onV4SubPageChange?.('program-cycles'); onNavigateToList?.(); setShowL2(false); setShowL3(false); }}
          >
            <span>Program Cycles</span>
          </button>
          <button
            className={`sidebar-flyout-item${v4SubPage === 'program-settings' ? ' active' : ''}`}
            onClick={() => { onV4SubPageChange?.('program-settings'); onNavigateToList?.(); setShowL2(false); setShowL3(false); }}
          >
            <span>Program Settings</span>
          </button>
        </div>
      )}
    </aside>
  );
}
