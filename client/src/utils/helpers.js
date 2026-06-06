/**
 * Helper to format seconds into mm:ss
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/**
 * Helper to get status color
 */
export const getStatusBadgeColor = (status) => {
  switch (status) {
    case "planning": return "primary";
    case "completed": return "success";
    case "failed": return "danger";
    default: return "secondary";
  }
};
