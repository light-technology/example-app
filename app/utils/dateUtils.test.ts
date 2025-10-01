import {
  parseLocalDate,
  formatDisplayDate,
  addDays,
  isValidDateString,
} from './dateUtils';

describe('dateUtils', () => {
  describe('parseLocalDate', () => {
    it('should parse a date string as a local date', () => {
      const dateString = '2025-01-15';
      const result = parseLocalDate(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // January is 0
      expect(result.getDate()).toBe(15);
    });

    it('should handle different date formats', () => {
      const dateString = '2025-12-31';
      const result = parseLocalDate(dateString);

      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(11); // December is 11
      expect(result.getDate()).toBe(31);
    });

    it('should avoid timezone shifts', () => {
      const dateString = '2025-01-01';
      const result = parseLocalDate(dateString);

      // Should always be the same date regardless of timezone
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
    });
  });

  describe('formatDisplayDate', () => {
    it('should format a date for display in US locale', () => {
      const date = new Date('2025-01-15T00:00:00');
      const result = formatDisplayDate(date);

      expect(result).toBe('January 15, 2025');
    });

    it('should handle different months', () => {
      const date = new Date('2025-12-31T00:00:00');
      const result = formatDisplayDate(date);

      expect(result).toBe('December 31, 2025');
    });

    it('should handle single digit days', () => {
      const date = new Date('2025-03-05T00:00:00');
      const result = formatDisplayDate(date);

      expect(result).toBe('March 5, 2025');
    });
  });

  describe('addDays', () => {
    it('should add positive days to a date', () => {
      const baseDate = new Date('2025-01-15T00:00:00');
      const result = addDays(baseDate, 5);

      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
    });

    it('should subtract negative days from a date', () => {
      const baseDate = new Date('2025-01-15T00:00:00');
      const result = addDays(baseDate, -5);

      expect(result.getDate()).toBe(10);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
    });

    it('should handle month boundary crossing when adding days', () => {
      const baseDate = new Date('2025-01-30T00:00:00');
      const result = addDays(baseDate, 5);

      expect(result.getDate()).toBe(4);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getFullYear()).toBe(2025);
    });

    it('should handle month boundary crossing when subtracting days', () => {
      const baseDate = new Date('2025-02-05T00:00:00');
      const result = addDays(baseDate, -10);

      expect(result.getDate()).toBe(26);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2025);
    });

    it('should not modify the original date', () => {
      const baseDate = new Date('2025-01-15T00:00:00');
      const originalTime = baseDate.getTime();

      addDays(baseDate, 5);

      expect(baseDate.getTime()).toBe(originalTime);
    });

    it('should handle zero days', () => {
      const baseDate = new Date('2025-01-15T00:00:00');
      const result = addDays(baseDate, 0);

      expect(result.getTime()).toBe(baseDate.getTime());
      expect(result).not.toBe(baseDate); // Should be a new instance
    });
  });

  describe('isValidDateString', () => {
    it('should return true for valid date strings', () => {
      expect(isValidDateString('2025-01-15')).toBe(true);
      expect(isValidDateString('2025-12-31')).toBe(true);
      expect(isValidDateString('January 15, 2025')).toBe(true);
      expect(isValidDateString('2025-01-15T10:30:00.000Z')).toBe(true);
    });

    it('should return false for invalid date strings', () => {
      expect(isValidDateString('invalid-date')).toBe(false);
      expect(isValidDateString('')).toBe(false);
      expect(isValidDateString('not-a-date')).toBe(false);
      expect(isValidDateString('2025-13-01')).toBe(false); // Month 13 is invalid
      expect(isValidDateString('2025-00-01')).toBe(false); // Month 0 is invalid
      expect(isValidDateString('2025-01-00')).toBe(false); // Day 0 is invalid
    });

    it('should return true for dates that JavaScript can auto-correct', () => {
      // JavaScript Date constructor auto-corrects these dates
      expect(isValidDateString('2025-02-30')).toBe(true); // Becomes 2025-03-02
      expect(isValidDateString('2025-04-31')).toBe(true); // Becomes 2025-05-01 (April has 30 days)
    });

    it('should return true for leap year edge cases', () => {
      expect(isValidDateString('2025-02-29')).toBe(true); // JavaScript auto-corrects to 2025-03-01
      expect(isValidDateString('2024-02-29')).toBe(true); // Valid leap year date
    });
  });
});
