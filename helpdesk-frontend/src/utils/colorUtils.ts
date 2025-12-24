
export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    open: "#ff9800",
    "in progress": "#2196f3",
    resolved: "#4caf50",
    closed: "#9e9e9e",
  };
  return statusColors[status.toLowerCase()] || "#999";
};
export const getPriorityColor = (priority: string): string => {
  const priorityColors: { [key: string]: string } = {
    low: "#4caf50",
    medium: "#ff9800",
    high: "#f44336",
  };
  return priorityColors[priority.toLowerCase()] || "#999";
};
