function getLastFridayOfPreviousWeek() {
  const now = new Date();

  // Go back to last week
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);

  // Find the day difference to Friday (5)
  const dayOfWeek = lastWeek.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const diffToFriday = (5 - dayOfWeek + 7) % 7;

  // Get last week's Friday
  lastWeek.setDate(lastWeek.getDate() + diffToFriday);

  // Format as YYYY-MM-DD
  const year = lastWeek.getFullYear();
  const month = String(lastWeek.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(lastWeek.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default getLastFridayOfPreviousWeek;
