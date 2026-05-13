import { STATUS_CONFIG } from '../../data/promotions.js';

export default function PromoTable({ rows, onEnroll, onPreview, selectedId, onRowClick, version = 'v1' }) {
  const isV4 = version === 'v4';
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th className="sortable">
              Promotion ID{' '}
              <svg width="12" height="12" viewBox="0 0 10 12" fill="#A6A6A6" style={{ verticalAlign: 'middle' }}><path d="M5 1L9 5H1L5 1Z"/><path d="M5 11L1 7H9L5 11Z"/></svg>
            </th>
            <th>Storefront Code</th>
            <th className="sortable">
              Promotion Start Date{' '}
              <svg width="12" height="12" viewBox="0 0 10 12" fill="#A6A6A6" style={{ verticalAlign: 'middle' }}><path d="M5 1L9 5H1L5 1Z"/><path d="M5 11L1 7H9L5 11Z"/></svg>
            </th>
            <th className="sortable">
              Promotion End Date{' '}
              <svg width="12" height="12" viewBox="0 0 10 12" fill="#A6A6A6" style={{ verticalAlign: 'middle' }}><path d="M5 1L9 5H1L5 1Z"/><path d="M5 11L1 7H9L5 11Z"/></svg>
            </th>
            <th>Enrollment Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                No promotions match the current filters.
              </td>
            </tr>
          ) : (
            rows.map(row => {
              const cfg = STATUS_CONFIG[row.status];
              return (
                <tr
                  key={row.id}
                  className={selectedId === row.id ? 'row-selected' : ''}
                  onClick={() => onRowClick?.(row.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Promotion ID — plain body text in black */}
                  <td style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 400 }}>{row.id}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{row.storefrontCode}</td>
                  <td className="date-cell">{row.start}</td>
                  <td className="date-cell">{row.end}</td>
                  <td>
                    {cfg ? (
                      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
                        <span className="dot-tag">
                          <span className="dot-tag-dot" style={{ background: cfg.dotColor }} />
                          {cfg.label}
                        </span>
                        {row.status === 'confirmed' && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)', paddingLeft: 14 }}>
                            {row.id.charCodeAt(row.id.length - 1) % 2 === 0 ? 'System' : 'Merchant'}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="no-action">—</span>
                    )}
                  </td>
                  <td>
                    {row.status === 'pending_confirm' ? (
                      <div className="action-cell">
                        {isV4 ? (
                          <button
                            className="action-ghost-btn"
                            onClick={e => { e.stopPropagation(); onPreview(row.id); }}
                          >
                            Confirm
                          </button>
                        ) : (
                          <button
                            className="icon-btn icon-btn-preview"
                            onClick={e => { e.stopPropagation(); onPreview(row.id); }}
                            aria-label="Confirm"
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                              <polyline points="9 15 11 17 15 13"/>
                            </svg>
                            <span className="tooltip">Confirm</span>
                          </button>
                        )}
                      </div>
                    ) : row.status === 'confirmed' ? (
                      <div className="action-cell">
                        {isV4 ? (
                          <button
                            className="action-ghost-btn"
                            onClick={e => { e.stopPropagation(); onPreview(row.id); }}
                          >
                            View
                          </button>
                        ) : (
                          <button
                            className="icon-btn icon-btn-preview"
                            onClick={e => { e.stopPropagation(); onPreview(row.id); }}
                            aria-label="View"
                          >
                            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span className="tooltip">View</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="no-action">—</span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
