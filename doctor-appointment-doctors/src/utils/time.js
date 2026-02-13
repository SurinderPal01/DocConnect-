export const formatTime = (value) => {
  if (!value) return "";

  // If we already have a valid Date or ISO string, format it directly
  const asDate = value instanceof Date ? value : new Date(value);
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Fallback for plain "HH:mm" strings (used for raw slots)
  const [h, m] = String(value).split(":").map(Number);
  const date = new Date();
  date.setHours(h || 0, m || 0, 0, 0);

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
