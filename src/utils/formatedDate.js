// Event dates are calendar days stored as UTC midnight ("2026-11-15T00:00Z"),
// so they must be rendered in UTC or they shift a day west of Greenwich.
export function formatedDate(date) {
  const newdate = new Date(date);
  const formattedDate = newdate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  return formattedDate;
}

// Real timestamps (createdAt, bookings, reviews) in the viewer's timezone
export function formatedLocalDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatedDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCurrency(value) {
  const amount = Number(value) || 0;
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

// ISO date -> "yyyy-mm-dd" for <input type="date"> (event dates are stored as UTC days)
export function toInputDate(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

// ISO date -> "yyyy-mm-ddThh:mm" in local time for <input type="datetime-local">
export function toInputDateTime(date) {
  if (!date) return "";
  const value = new Date(date);
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

// Mirrors the backend archive rule: event date + endTime ("HH:MM", UTC)
export function hasEventEnded(event) {
  if (!event?.date) return false;
  if (event.status === "ARCHIVED") return true;
  const end = new Date(event.date);
  const [hours, minutes] = (event.endTime || "23:59")
    .split(":")
    .map((part) => parseInt(part, 10));
  end.setUTCHours(
    Number.isFinite(hours) ? hours : 23,
    Number.isFinite(minutes) ? minutes : 59,
    0,
    0,
  );
  return end <= new Date();
}

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
