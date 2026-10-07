// Pill badge for event / booking / ticket statuses (design system: rounded-full, label-sm, uppercase)
const STATUS_STYLES = {
  // success / validated
  PUBLISHED: "bg-success/10 text-success",
  CONFIRMED: "bg-success/10 text-success",
  VALID: "bg-success/10 text-success",
  // warning / scanned
  PENDING: "bg-warning/10 text-warning",
  USED: "bg-warning/10 text-warning",
  // critical
  CANCELED: "bg-error-container text-on-error-container",
  CANCELLED: "bg-error-container text-on-error-container",
  // neutral
  UPCOMING: "bg-secondary-fill text-on-primary",
  ARCHIVED: "bg-surface-container-high text-on-surface-variant",
};

const DOT_STYLES = {
  PUBLISHED: "bg-success",
  CONFIRMED: "bg-success",
  VALID: "bg-success",
  PENDING: "bg-warning",
  USED: "bg-warning",
  CANCELED: "bg-error",
  CANCELLED: "bg-error",
  UPCOMING: "bg-on-primary",
  ARCHIVED: "bg-outline",
};

const LABELS = {
  USED: "Checked in",
  ARCHIVED: "Ended",
};

export default function StatusBadge({ status, label, className = "" }) {
  const key = status?.toUpperCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm uppercase tracking-wider whitespace-nowrap ${STATUS_STYLES[key] ?? "bg-surface-container-high text-on-surface"} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[key] ?? "bg-primary"}`}
      />
      {label ?? LABELS[key] ?? key?.toLowerCase()}
    </span>
  );
}
