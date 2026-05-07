const VERSIONS = ['v1', 'v2', 'v3'];

export default function Topbar({ version, onVersionChange }) {
  return (
    <header className="topbar">
      <div className="topbar-logo">
        <div className="topbar-logo-icon">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div className="topbar-logo-name">HKTV</div>
          <div className="topbar-logo-sub">Merchant Management System</div>
        </div>
      </div>

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

      <div className="topbar-spacer"></div>
      <button className="topbar-back-btn">Back to MMS</button>
      <div className="topbar-lang">
        English
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div className="topbar-user">
        <div className="topbar-avatar">SM</div>
        Serati Ma
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </header>
  );
}
