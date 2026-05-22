export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const n = new Date();
  return (
    d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear()
  );
};

export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date() && !isToday(date);
};

export const priorityColor = (p) => {
  if (p === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  if (p === 'medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
};
