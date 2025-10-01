import {
  MonthlyUsageDay,
  DailyUsageDay,
  MonthlyUsageResponse,
  DailyUsageResponse,
} from '../types/energy';

export interface ChartDataPoint {
  day: string | number;
  consumption: number;
  isPartial?: boolean;
  isFuture?: boolean;
  isToday?: boolean;
  hasData?: boolean;
}

export interface DataCompletenessInfo {
  totalDays: number;
  daysWithData: number;
  isCurrentPeriod: boolean;
  lastDataDay?: string | number;
}

/**
 * Get the number of days in a specific month and year
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Find the last day that has actual data (not just today's date)
 */
export function getLastDataDay(days: DailyUsageDay[]): number | null {
  if (!days || days.length === 0) return null;

  // Sort by date and get the last day with data
  const sortedDays = days
    .filter((day) => day.date && parseFloat(day.consumption || '0') >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sortedDays.length === 0) return null;

  const lastDay = sortedDays[sortedDays.length - 1];
  return new Date(lastDay.date).getDate();
}

/**
 * Find the last month that has actual data
 */
export function getLastDataMonth(months: MonthlyUsageDay[]): string | null {
  if (!months || months.length === 0) return null;

  const monthsWithData = months.filter(
    (month) => month.month && parseFloat(month.consumption || '0') >= 0
  );

  if (monthsWithData.length === 0) return null;

  return monthsWithData[monthsWithData.length - 1].month;
}

/**
 * Check if we're currently in the specified month/year
 */
export function isCurrentMonth(month: number, year: number): boolean {
  const now = new Date();
  return now.getMonth() + 1 === month && now.getFullYear() === year;
}

/**
 * Check if we're currently in the specified year
 */
export function isCurrentYear(year: number): boolean {
  return new Date().getFullYear() === year;
}

/**
 * Generate a complete month's worth of data with placeholders for missing days
 */
export function generateFullMonthData(
  days: DailyUsageDay[] | undefined,
  month: number,
  year: number
): ChartDataPoint[] {
  const totalDays = getDaysInMonth(month, year);
  const today = new Date();
  const currentDay = today.getDate();
  const isThisMonth = isCurrentMonth(month, year);

  // Create a map of existing data by day
  const dataMap = new Map<number, DailyUsageDay>();
  if (days) {
    days.forEach((day) => {
      const dayNumber = new Date(day.date).getDate();
      dataMap.set(dayNumber, day);
    });
  }

  // Generate complete array with all days
  const result: ChartDataPoint[] = [];
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const hasData = dataMap.has(dayNum);
    const isFuture = isThisMonth && dayNum > currentDay;
    const isToday = isThisMonth && dayNum === currentDay;

    result.push({
      day: dayNum,
      consumption: hasData
        ? Math.round(
            parseFloat(dataMap.get(dayNum)!.consumption || '0') * 100
          ) / 100
        : 0,
      hasData,
      isFuture,
      isToday,
    });
  }

  return result;
}

/**
 * Format monthly data with indicators for current/partial months
 */
export function formatMonthlyChartData(
  months: MonthlyUsageDay[] | undefined
): ChartDataPoint[] {
  if (!months || !Array.isArray(months)) {
    return [];
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() is 0-based, but we need 1-based

  return months.map((month) => {
    // Parse month string - could be "YYYY-MM" format or just month name
    let monthYear: number;
    let monthNum: number;
    let displayMonth: string;

    if (month.month.includes('-')) {
      // Format: "YYYY-MM"
      const [yearStr, monthStr] = month.month.split('-');
      monthYear = parseInt(yearStr);
      monthNum = parseInt(monthStr);
      displayMonth = new Date(monthYear, monthNum - 1).toLocaleDateString(
        'en-US',
        { month: 'long' }
      );
    } else {
      // Format: Month name like "January"
      displayMonth = month.month;
      // Assume current year for month names
      monthYear = currentYear;
      monthNum = new Date(`${month.month} 1, ${currentYear}`).getMonth() + 1;
    }

    // Check if this is the current month of the current year
    const isPartial = monthYear === currentYear && monthNum === currentMonth;

    return {
      day: displayMonth,
      consumption: Math.round(parseFloat(month.consumption || '0') * 100) / 100,
      isPartial,
    };
  });
}

/**
 * Get data completeness information for display
 */
export function getDataCompletenessInfo(
  data: MonthlyUsageResponse | DailyUsageResponse | null,
  viewType: 'monthly' | 'daily',
  selectedMonth?: number,
  selectedYear?: number
): DataCompletenessInfo {
  if (!data) {
    return {
      totalDays: 0,
      daysWithData: 0,
      isCurrentPeriod: false,
    };
  }

  if (viewType === 'monthly') {
    const monthlyData = data as MonthlyUsageResponse;
    const isCurrentPeriod = isCurrentYear(monthlyData.year);
    const lastDataMonth = getLastDataMonth(monthlyData.months);

    return {
      totalDays: 12, // 12 months in a year
      daysWithData: monthlyData.months?.length || 0,
      isCurrentPeriod,
      lastDataDay: lastDataMonth || undefined,
    };
  } else {
    const dailyData = data as DailyUsageResponse;
    const month = selectedMonth || dailyData.month;
    const year = selectedYear || dailyData.year;
    const totalDays = getDaysInMonth(month, year);
    const isCurrentPeriod = isCurrentMonth(month, year);
    const lastDataDay = getLastDataDay(dailyData.days);

    return {
      totalDays,
      daysWithData: lastDataDay || 0,
      isCurrentPeriod,
      lastDataDay: lastDataDay || undefined,
    };
  }
}

/**
 * Format chart data based on view type
 */
export function formatChartData(
  data: MonthlyUsageResponse | DailyUsageResponse | null,
  viewType: 'monthly' | 'daily',
  selectedMonth?: number,
  selectedYear?: number
): ChartDataPoint[] {
  if (!data) return [];

  if (viewType === 'monthly') {
    const monthlyData = data as MonthlyUsageResponse;
    return formatMonthlyChartData(monthlyData.months);
  } else {
    const dailyData = data as DailyUsageResponse;
    const month = selectedMonth || dailyData.month;
    const year = selectedYear || dailyData.year;
    return generateFullMonthData(dailyData.days, month, year);
  }
}
