/**
 * Returns the date representation in ISO format (YYYY-MM-DD),
 * taking into account the user's local time zone instead of UTC.
 */
export function getLocalDateISOString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
