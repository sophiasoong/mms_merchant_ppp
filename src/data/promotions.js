export function _rsc() {
  return 'H' + String(Math.floor(Math.random() * 9000000) + 1000000);
}

export const PROMOTIONS_INITIAL = [
  // Pending Confirm — April 2026 (3 stores)
  { id: "PPP-2026-0003", start: "2026-04-01", end: "2026-04-30", status: "pending_confirm", storefrontCode: "H2748138" },
  { id: "PPP-2026-0002", start: "2026-04-01", end: "2026-04-30", status: "pending_confirm", storefrontCode: "H4981529" },
  { id: "PPP-2026-0001", start: "2026-04-01", end: "2026-04-30", status: "pending_confirm", storefrontCode: "H5413880" },
  // Confirmed — reverse chronological
  { id: "PPP-2025-0020", start: "2026-03-01", end: "2026-03-31", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0019", start: "2026-02-01", end: "2026-02-28", status: "confirmed", storefrontCode: "H4981529" },
  { id: "PPP-2025-0018", start: "2026-01-01", end: "2026-01-31", status: "confirmed", storefrontCode: "H5413880" },
  { id: "PPP-2025-0017", start: "2025-12-01", end: "2025-12-31", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0016", start: "2025-11-01", end: "2025-11-30", status: "confirmed", storefrontCode: "H5413880" },
  { id: "PPP-2025-0015", start: "2025-10-01", end: "2025-10-31", status: "confirmed", storefrontCode: "H4981529" },
  { id: "PPP-2025-0014", start: "2025-09-01", end: "2025-09-30", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0013", start: "2025-08-01", end: "2025-08-31", status: "confirmed", storefrontCode: "H5413880" },
  { id: "PPP-2025-0012", start: "2025-07-01", end: "2025-07-31", status: "confirmed", storefrontCode: "H4981529" },
  { id: "PPP-2025-0011", start: "2025-06-01", end: "2025-06-30", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0010", start: "2025-05-01", end: "2025-05-31", status: "confirmed", storefrontCode: "H5413880" },
  { id: "PPP-2025-0009", start: "2025-04-01", end: "2025-04-30", status: "confirmed", storefrontCode: "H4981529" },
  { id: "PPP-2025-0008", start: "2025-03-01", end: "2025-03-31", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0007", start: "2025-02-01", end: "2025-02-28", status: "confirmed", storefrontCode: "H5413880" },
  { id: "PPP-2025-0006", start: "2025-01-01", end: "2025-01-31", status: "confirmed", storefrontCode: "H4981529" },
  { id: "PPP-2025-0005", start: "2024-12-01", end: "2024-12-31", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0004", start: "2024-11-01", end: "2024-11-30", status: "confirmed", storefrontCode: "H4981529" },
  { id: "PPP-2025-0003", start: "2024-10-01", end: "2024-10-31", status: "confirmed", storefrontCode: "H5413880" },
  { id: "PPP-2025-0002", start: "2024-09-01", end: "2024-09-30", status: "confirmed", storefrontCode: "H2748138" },
  { id: "PPP-2025-0001", start: "2024-08-01", end: "2024-08-31", status: "confirmed", storefrontCode: "H4981529" },
];

export const STATUS_CONFIG = {
  open:            { label: "Open",           cls: "badge-open" },
  pending_confirm: { label: "Pending Confirm", cls: "badge-pending" },
  confirmed:       { label: "Confirmed",       cls: "badge-confirmed" },
  opted_out:       { label: "Opted Out",       cls: "badge-opted-out" },
  exit_scheduled:  { label: "Exit Scheduled",  cls: "badge-exit" },
};

export const STATUS_DROPDOWN_OPTS = [
  { value: null,              label: "All",             dotColor: null },
  { value: "pending_confirm", label: "Pending Confirm", dotColor: "#FA8C16" },
  { value: "confirmed",       label: "Confirmed",       dotColor: "#52C41A" },
];

export const SEARCH_TYPE_OPTS = [
  { value: "id",         label: "Promotion ID" },
  { value: "storefront", label: "Storefront Code" },
];

export const AUDIT_DATA = {
  default: [
    { action: 'Confirm',        date: '2026-04-01 09:15', userId: 'MER88021' },
    { action: 'Manual Exclude', date: '2026-03-20 14:32', userId: 'ADMIN001' },
    { action: 'Batch Upload',   date: '2026-03-10 11:05', userId: 'MER88021' },
  ],
};

export const DIALOG_CONFIG = {
  confirm: {
    iconCls: "dialog-icon-confirm",
    iconSvg: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    title:   "Confirm Enrollment",
    body:    "You are about to confirm the enrollment for this promotion. The selected SKUs will be enrolled at the displayed PPP prices. This action cannot be undone.",
    okLabel: "Confirm",
    okCls:   "primary",
  },
  optout: {
    iconCls: "dialog-icon-optout",
    iconSvg: `<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    title:   "Opt Out of Promotion",
    body:    "You are about to opt out of this promotion. All selected SKUs will be removed from participation. This action will change the enrollment status to Opted Out.",
    okLabel: "Opt Out",
    okCls:   "danger",
  },
};
