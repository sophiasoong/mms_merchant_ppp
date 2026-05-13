import logoMms from '../../assets/logo_mms.svg';

const VERSIONS = ['v1', 'v2', 'v3', 'v4'];

export default function Topbar({ version, onVersionChange, sidebarOpen, onToggleSidebar }) {
  return (
    <header className="topbar">
      {/* Logo — brand SVG panel */}
      <div className={`topbar-logo${sidebarOpen ? '' : ' collapsed'}`}>
        <img src={logoMms} alt="MMS Logo" width="260" height="68" />
      </div>

      {/* Hamburger menu button */}
      <button className="topbar-menu-btn" title="Menu" onClick={onToggleSidebar}>
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Version tabs (centred) */}
      {onVersionChange && (
        <div className="topbar-version-tabs">
          {VERSIONS.map(v => (
            <button
              key={v}
              className={`topbar-version-tab${version === v ? ' active' : ''}`}
              onClick={() => onVersionChange(v)}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      <div className="topbar-spacer" />

      {/* Right section */}
      <div className="topbar-right">
        {/* Back to MMS */}
        <button className="topbar-back-btn">Back to MMS</button>

        {/* Help */}
        <button className="topbar-icon-btn" title="Help">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Bell with badge */}
        <div className="topbar-bell-wrap">
          <button className="topbar-icon-btn" title="Notifications">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <span className="topbar-badge">99+</span>
        </div>

        {/* Language selector */}
        <button className="topbar-lang">
          English
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        {/* Divider */}
        <div className="topbar-divider" />

        {/* User */}
        <button className="topbar-user">
          <div className="topbar-avatar">SM</div>
          <span>Serati Ma</span>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>
    </header>
  );
}
