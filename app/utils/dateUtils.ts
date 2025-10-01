/**
 * Date utilities that handle timezone issues when parsing date strings
 * and ensure consistent date formatting throughout the application.
 */

/**
 * Parse a date string as a local date, avoiding timezone shifts.
 * Use this for dates like "2025-01-01" that should always display
 * as the same date regardless of browser timezone.
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object representing the local date
 */
export function parseLocalDate(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Format a date for display in a consistent format.
 *
 * @param date - Date to format
 * @returns Formatted date string (e.g., "January 15, 2025")
 */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Add or subtract days from a date while preserving the local date.
 *
 * @param date - The base date
 * @param days - Number of days to add (positive) or subtract (negative)
 * @returns New Date object with the specified number of days added/subtracted
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Check if a date string represents a valid date.
 *
 * @param dateString - Date string to validate
 * @returns True if the string represents a valid date
 */
export function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
