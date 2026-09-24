export const computeVaccinationStatus = (nextDueDate) => {
  if (!nextDueDate) return 'completed';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(nextDueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'overdue';
  } else if (diffDays <= 14) {
    return 'due_soon';
  } else {
    return 'completed';
  }
};
