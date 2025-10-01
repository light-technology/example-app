import {
  formatCurrency,
  formatDateShort,
  formatDateLong,
  formatKwh,
  formatRate,
  formatCardBrand,
  formatCardExpiry,
} from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format cents as currency', () => {
      expect(formatCurrency(1234)).toBe('$12.34');
      expect(formatCurrency(567)).toBe('$5.67');
      expect(formatCurrency(1000)).toBe('$10.00');
    });

    it('should handle zero and negative values', () => {
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-1234)).toBe('-$12.34');
    });

    it('should handle single digits', () => {
      expect(formatCurrency(1)).toBe('$0.01');
      expect(formatCurrency(5)).toBe('$0.05');
      expect(formatCurrency(10)).toBe('$0.10');
    });

    it('should handle large amounts', () => {
      expect(formatCurrency(123456)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$10,000.00');
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short format', () => {
      // Use ISO strings with time to avoid timezone issues
      expect(formatDateShort('2025-01-15T12:00:00')).toBe('Jan 15, 2025');
      expect(formatDateShort('2025-12-31T12:00:00')).toBe('Dec 31, 2025');
      expect(formatDateShort('2025-03-05T12:00:00')).toBe('Mar 5, 2025');
    });

    it('should handle ISO date strings', () => {
      expect(formatDateShort('2025-01-15T10:30:00.000Z')).toBe('Jan 15, 2025');
      expect(formatDateShort('2025-06-20T15:45:30Z')).toBe('Jun 20, 2025');
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format', () => {
      // Use ISO strings with time to avoid timezone issues
      expect(formatDateLong('2025-01-15T12:00:00')).toBe('January 15, 2025');
      expect(formatDateLong('2025-12-31T12:00:00')).toBe('December 31, 2025');
      expect(formatDateLong('2025-03-05T12:00:00')).toBe('March 5, 2025');
    });

    it('should handle ISO date strings', () => {
      expect(formatDateLong('2025-01-15T10:30:00.000Z')).toBe(
        'January 15, 2025'
      );
      expect(formatDateLong('2025-06-20T15:45:30Z')).toBe('June 20, 2025');
    });
  });

  describe('formatKwh', () => {
    it('should format kilowatt hours from numbers', () => {
      expect(formatKwh(123.456)).toBe('123.5');
      expect(formatKwh(1000)).toBe('1,000');
      expect(formatKwh(42.1)).toBe('42.1');
    });

    it('should format kilowatt hours from strings', () => {
      expect(formatKwh('123.456')).toBe('123.5');
      expect(formatKwh('1000')).toBe('1,000');
      expect(formatKwh('42.1')).toBe('42.1');
    });

    it('should handle edge cases', () => {
      expect(formatKwh(0)).toBe('0');
      expect(formatKwh('0')).toBe('0');
      expect(formatKwh(0.01)).toBe('0');
      expect(formatKwh(0.1)).toBe('0.1');
    });

    it('should handle decimal precision', () => {
      expect(formatKwh(123.99)).toBe('124');
      expect(formatKwh(123.15)).toBe('123.2');
      expect(formatKwh(123.14)).toBe('123.1');
    });
  });

  describe('formatRate', () => {
    it('should format energy rate from numbers', () => {
      expect(formatRate(12.345)).toBe('12.3¢/kWh');
      expect(formatRate(5.0)).toBe('5.0¢/kWh');
      expect(formatRate(0.567)).toBe('0.6¢/kWh');
    });

    it('should format energy rate from strings', () => {
      expect(formatRate('12.345')).toBe('12.3¢/kWh');
      expect(formatRate('5.0')).toBe('5.0¢/kWh');
      expect(formatRate('0.567')).toBe('0.6¢/kWh');
    });

    it('should always show one decimal place', () => {
      expect(formatRate(12)).toBe('12.0¢/kWh');
      expect(formatRate('15')).toBe('15.0¢/kWh');
      expect(formatRate(0)).toBe('0.0¢/kWh');
    });

    it('should handle rounding', () => {
      expect(formatRate(12.999)).toBe('13.0¢/kWh');
      expect(formatRate(12.949)).toBe('12.9¢/kWh');
    });
  });

  describe('formatCardBrand', () => {
    it('should capitalize card brand names', () => {
      expect(formatCardBrand('visa')).toBe('Visa');
      expect(formatCardBrand('mastercard')).toBe('Mastercard');
      expect(formatCardBrand('american express')).toBe('American express');
      expect(formatCardBrand('discover')).toBe('Discover');
    });

    it('should handle different cases', () => {
      expect(formatCardBrand('VISA')).toBe('Visa');
      expect(formatCardBrand('MasterCard')).toBe('Mastercard');
      expect(formatCardBrand('AmEx')).toBe('Amex');
    });

    it('should handle edge cases', () => {
      expect(formatCardBrand('')).toBe('');
      expect(formatCardBrand('v')).toBe('V');
    });
  });

  describe('formatCardExpiry', () => {
    it('should format card expiry with proper padding', () => {
      expect(formatCardExpiry(1, 2025)).toBe('01/25');
      expect(formatCardExpiry(12, 2025)).toBe('12/25');
      expect(formatCardExpiry(5, 2030)).toBe('05/30');
    });

    it('should handle different year formats', () => {
      expect(formatCardExpiry(6, 25)).toBe('06/25');
      expect(formatCardExpiry(11, 2025)).toBe('11/25');
    });

    it('should pad months correctly', () => {
      expect(formatCardExpiry(1, 2025)).toBe('01/25');
      expect(formatCardExpiry(10, 2025)).toBe('10/25');
    });

    it('should extract last two digits of year', () => {
      expect(formatCardExpiry(3, 2025)).toBe('03/25');
      expect(formatCardExpiry(8, 2030)).toBe('08/30');
      expect(formatCardExpiry(12, 2099)).toBe('12/99');
    });
  });
});
