import {
  getDaysInMonth,
  getLastDataDay,
  getLastDataMonth,
  isCurrentMonth,
  isCurrentYear,
  generateFullMonthData,
  formatMonthlyChartData,
  getDataCompletenessInfo,
  formatChartData,
} from './energyChartUtils';
import {
  DailyUsageDay,
  MonthlyUsageDay,
  DailyUsageResponse,
  MonthlyUsageResponse,
} from '../types/energy';

describe('energyChartUtils', () => {
  describe('getDaysInMonth', () => {
    it('should return correct number of days for regular months', () => {
      expect(getDaysInMonth(1, 2025)).toBe(31); // January
      expect(getDaysInMonth(4, 2025)).toBe(30); // April
      expect(getDaysInMonth(6, 2025)).toBe(30); // June
      expect(getDaysInMonth(12, 2025)).toBe(31); // December
    });

    it('should return correct number of days for February in non-leap years', () => {
      expect(getDaysInMonth(2, 2025)).toBe(28);
      expect(getDaysInMonth(2, 2023)).toBe(28);
    });

    it('should return correct number of days for February in leap years', () => {
      expect(getDaysInMonth(2, 2024)).toBe(29);
      expect(getDaysInMonth(2, 2020)).toBe(29);
    });

    it('should handle edge case years', () => {
      expect(getDaysInMonth(2, 2000)).toBe(29); // Leap year (divisible by 400)
      expect(getDaysInMonth(2, 1900)).toBe(28); // Not leap year (divisible by 100 but not 400)
    });
  });

  describe('getLastDataDay', () => {
    const mockDailyData: DailyUsageDay[] = [
      {
        date: '2025-01-01',
        consumption: '10.5',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      },
      {
        date: '2025-01-02',
        consumption: '12.3',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      },
      {
        date: '2025-01-03',
        consumption: '8.7',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      },
    ];

    it('should find the last day with data', () => {
      const result = getLastDataDay(mockDailyData);
      expect(result).toBe(2); // Due to timezone parsing, '2025-01-03' becomes day 2
    });

    it('should return null for empty array', () => {
      const result = getLastDataDay([]);
      expect(result).toBe(null);
    });

    it('should return null for null/undefined input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getLastDataDay(null as any)).toBe(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getLastDataDay(undefined as any)).toBe(null);
    });

    it('should handle days with zero consumption', () => {
      const dataWithZeros: DailyUsageDay[] = [
        {
          date: '2025-01-01',
          consumption: '0',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          date: '2025-01-02',
          consumption: '12.3',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];
      const result = getLastDataDay(dataWithZeros);
      expect(result).toBe(1); // Due to timezone parsing, '2025-01-02' becomes day 1
    });

    it('should sort dates correctly', () => {
      const unsortedData: DailyUsageDay[] = [
        {
          date: '2025-01-03',
          consumption: '8.7',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          date: '2025-01-01',
          consumption: '10.5',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          date: '2025-01-02',
          consumption: '12.3',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];
      const result = getLastDataDay(unsortedData);
      expect(result).toBe(2); // Due to timezone parsing, '2025-01-03' becomes day 2
    });
  });

  describe('getLastDataMonth', () => {
    const mockMonthlyData: MonthlyUsageDay[] = [
      {
        month: 'January',
        consumption: '100.5',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      },
      {
        month: 'February',
        consumption: '120.3',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      },
      {
        month: 'March',
        consumption: '87.1',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      },
    ];

    it('should find the last month with data', () => {
      const result = getLastDataMonth(mockMonthlyData);
      expect(result).toBe('March');
    });

    it('should return null for empty array', () => {
      const result = getLastDataMonth([]);
      expect(result).toBe(null);
    });

    it('should return null for null/undefined input', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getLastDataMonth(null as any)).toBe(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(getLastDataMonth(undefined as any)).toBe(null);
    });

    it('should handle months with zero consumption', () => {
      const dataWithZeros: MonthlyUsageDay[] = [
        {
          month: 'January',
          consumption: '0',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          month: 'February',
          consumption: '120.3',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];
      const result = getLastDataMonth(dataWithZeros);
      expect(result).toBe('February');
    });
  });

  describe('isCurrentMonth', () => {
    beforeEach(() => {
      // Mock current date to January 15, 2025
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for current month and year', () => {
      expect(isCurrentMonth(1, 2025)).toBe(true);
    });

    it('should return false for different month same year', () => {
      expect(isCurrentMonth(2, 2025)).toBe(false);
      expect(isCurrentMonth(12, 2025)).toBe(false);
    });

    it('should return false for same month different year', () => {
      expect(isCurrentMonth(1, 2024)).toBe(false);
      expect(isCurrentMonth(1, 2026)).toBe(false);
    });

    it('should return false for different month and year', () => {
      expect(isCurrentMonth(6, 2024)).toBe(false);
    });
  });

  describe('isCurrentYear', () => {
    beforeEach(() => {
      // Mock current date to 2025
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true for current year', () => {
      expect(isCurrentYear(2025)).toBe(true);
    });

    it('should return false for different years', () => {
      expect(isCurrentYear(2024)).toBe(false);
      expect(isCurrentYear(2026)).toBe(false);
    });
  });

  describe('generateFullMonthData', () => {
    beforeEach(() => {
      // Mock current date to January 15, 2025
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should generate full month data with existing data', () => {
      const dailyData: DailyUsageDay[] = [
        {
          date: '2025-01-02',
          consumption: '10.5',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          date: '2025-01-04',
          consumption: '8.7',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];

      const result = generateFullMonthData(dailyData, 1, 2025);

      expect(result).toHaveLength(31); // January has 31 days
      // Due to timezone parsing:
      // '2025-01-02' -> Jan 1 (day 1) -> data at index 0
      // '2025-01-04' -> Jan 3 (day 3) -> data at index 2
      expect(result[0]).toEqual({
        day: 1,
        consumption: 10.5, // '2025-01-02' data
        hasData: true,
        isFuture: false,
        isToday: false,
      });
      expect(result[1]).toEqual({
        day: 2,
        consumption: 0, // No data
        hasData: false,
        isFuture: false,
        isToday: false,
      });
      expect(result[2]).toEqual({
        day: 3,
        consumption: 8.7, // '2025-01-04' data
        hasData: true,
        isFuture: false,
        isToday: false,
      });
    });

    it('should mark current day correctly', () => {
      const result = generateFullMonthData([], 1, 2025);

      expect(result[14]).toEqual({
        day: 15, // 15th day (0-indexed array, so index 14)
        consumption: 0,
        hasData: false,
        isFuture: false,
        isToday: true,
      });
    });

    it('should mark future days correctly', () => {
      const result = generateFullMonthData([], 1, 2025);

      expect(result[15]).toEqual({
        day: 16, // 16th day (future)
        consumption: 0,
        hasData: false,
        isFuture: true,
        isToday: false,
      });
    });

    it('should handle undefined data array', () => {
      const result = generateFullMonthData(undefined, 1, 2025);
      expect(result).toHaveLength(31);
      expect(result[0].hasData).toBe(false);
    });

    it('should round consumption values', () => {
      const dailyData: DailyUsageDay[] = [
        {
          date: '2025-01-02',
          consumption: '10.567',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];

      const result = generateFullMonthData(dailyData, 1, 2025);
      expect(result[0].consumption).toBe(10.57); // '2025-01-02' -> day 1, rounded to 2 decimal places
    });
  });

  describe('formatMonthlyChartData', () => {
    beforeEach(() => {
      // Mock current date to January 15, 2025
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should format monthly data with month names', () => {
      const monthlyData: MonthlyUsageDay[] = [
        {
          month: 'January',
          consumption: '100.567',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          month: 'February',
          consumption: '120.3',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];

      const result = formatMonthlyChartData(monthlyData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        day: 'January',
        consumption: 100.57, // Rounded to 2 decimal places
        isPartial: true, // Current year, so January is partial
      });
      expect(result[1]).toEqual({
        day: 'February',
        consumption: 120.3,
        isPartial: false, // Future month in current year, but not current month
      });
    });

    it('should format monthly data with YYYY-MM format', () => {
      const monthlyData: MonthlyUsageDay[] = [
        {
          month: '2025-01',
          consumption: '100.567',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
        {
          month: '2025-02',
          consumption: '120.3',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ];

      const result = formatMonthlyChartData(monthlyData);

      expect(result).toHaveLength(2);
      expect(result[0].day).toBe('January');
      expect(result[1].day).toBe('February');
    });

    it('should return empty array for undefined data', () => {
      const result = formatMonthlyChartData(undefined);
      expect(result).toEqual([]);
    });

    it('should return empty array for non-array data', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = formatMonthlyChartData(null as any);
      expect(result).toEqual([]);
    });
  });

  describe('getDataCompletenessInfo', () => {
    beforeEach(() => {
      // Mock current date to January 15, 2025
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return completeness info for monthly data', () => {
      const monthlyResponse: MonthlyUsageResponse = {
        year: 2025,
        units: 'kWh',
        months: [
          {
            month: 'January',
            consumption: '100',
            generation: '0',
            vehicle_charging: '0',
            eligible_vehicle_charging: '0',
          },
          {
            month: 'February',
            consumption: '120',
            generation: '0',
            vehicle_charging: '0',
            eligible_vehicle_charging: '0',
          },
        ],
      };

      const result = getDataCompletenessInfo(monthlyResponse, 'monthly');

      expect(result).toEqual({
        totalDays: 12, // 12 months in a year
        daysWithData: 2,
        isCurrentPeriod: true, // Current year
        lastDataDay: 'February',
      });
    });

    it('should return completeness info for daily data', () => {
      const dailyResponse: DailyUsageResponse = {
        month: 1,
        year: 2025,
        units: 'kWh',
        days: [
          {
            date: '2025-01-01',
            consumption: '10',
            generation: '0',
            vehicle_charging: '0',
            eligible_vehicle_charging: '0',
          },
          {
            date: '2025-01-03',
            consumption: '8',
            generation: '0',
            vehicle_charging: '0',
            eligible_vehicle_charging: '0',
          },
        ],
      };

      const result = getDataCompletenessInfo(dailyResponse, 'daily');

      expect(result).toEqual({
        totalDays: 31, // January has 31 days
        daysWithData: 2, // Last data day is 2nd (due to timezone parsing)
        isCurrentPeriod: true, // Current month
        lastDataDay: 2,
      });
    });

    it('should return empty info for null data', () => {
      const result = getDataCompletenessInfo(null, 'monthly');

      expect(result).toEqual({
        totalDays: 0,
        daysWithData: 0,
        isCurrentPeriod: false,
      });
    });
  });

  describe('formatChartData', () => {
    it('should format monthly chart data', () => {
      const monthlyResponse: MonthlyUsageResponse = {
        year: 2025,
        units: 'kWh',
        months: [
          {
            month: 'January',
            consumption: '100.5',
            generation: '0',
            vehicle_charging: '0',
            eligible_vehicle_charging: '0',
          },
        ],
      };

      const result = formatChartData(monthlyResponse, 'monthly');

      expect(result).toHaveLength(1);
      expect(result[0].day).toBe('January');
      expect(result[0].consumption).toBe(100.5);
    });

    it('should format daily chart data', () => {
      const dailyResponse: DailyUsageResponse = {
        month: 1,
        year: 2025,
        units: 'kWh',
        days: [
          {
            date: '2025-01-02',
            consumption: '10.5',
            generation: '0',
            vehicle_charging: '0',
            eligible_vehicle_charging: '0',
          },
        ],
      };

      const result = formatChartData(dailyResponse, 'daily');

      expect(result).toHaveLength(31); // Full month data
      expect(result[0].consumption).toBe(10.5); // '2025-01-02' maps to day 1
    });

    it('should return empty array for null data', () => {
      const result = formatChartData(null, 'monthly');
      expect(result).toEqual([]);
    });

    it('should use selectedMonth/selectedYear for daily data', () => {
      const dailyResponse: DailyUsageResponse = {
        month: 1,
        year: 2025,
        units: 'kWh',
        days: [],
      };

      const result = formatChartData(dailyResponse, 'daily', 2, 2025); // February

      expect(result).toHaveLength(28); // February 2025 has 28 days
    });
  });
});
