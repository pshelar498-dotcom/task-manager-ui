// Due dates are stored as midnight UTC (e.g. "2026-10-15T00:00:00.000Z"),
// so they are formatted in UTC to show the same day the user picked.
export const formatDueDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

// Value for <input type="date">: "YYYY-MM-DD"
export const toDateInputValue = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "done") return false;
  const endOfDueDay = new Date(dueDate);
  endOfDueDay.setUTCHours(23, 59, 59, 999);
  return endOfDueDay < new Date();
};
