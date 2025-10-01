/**
 * Formatting utilities for consistent data presentation across the application.
 */

/**
 * Format cents as currency
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "$12.34")
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Format date in short format
 * @param dateString - ISO date string
 * @returns Short formatted date (e.g., "Jan 15, 2025")
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date in long format
 * @param dateString - ISO date string
 * @returns Long formatted date (e.g., "January 15, 2025")
 */
export function formatDateLong(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format kilowatt hours
 * @param kwh - Energy amount in kWh (string or number)
 * @returns Formatted kWh string with up to 1 decimal place
 */
export function formatKwh(kwh: string | number): string {
  const numKwh = typeof kwh === 'string' ? parseFloat(kwh) : kwh;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(numKwh);
}

/**
 * Format energy rate
 * @param centsPerKwh - Rate in cents per kWh (string or number)
 * @returns Formatted rate string (e.g., "12.3¢/kWh")
 */
export function formatRate(centsPerKwh: string | number): string {
  const numRate =
    typeof centsPerKwh === 'string' ? parseFloat(centsPerKwh) : centsPerKwh;
  return `${numRate.toFixed(1)}¢/kWh`;
}

/**
 * Format card brand name
 * @param brand - Card brand in lowercase
 * @returns Properly capitalized brand name
 */
export function formatCardBrand(brand: string): string {
  return brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
}

/**
 * Format card expiry date
 * @param month - Expiry month
 * @param year - Expiry year
 * @returns Formatted expiry (e.g., "12/25")
 */
export function formatCardExpiry(month: number, year: number): string {
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
}
