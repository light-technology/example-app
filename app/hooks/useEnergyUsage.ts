import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/api';
import { MonthlyUsageResponse, DailyUsageResponse, MonthlyUsageSummary } from '../types/energy';

export type ViewType = 'monthly' | 'daily';

interface UseEnergyUsageProps {
  accountUuid: string;
  locationUuid: string;
  viewType: ViewType;
  selectedMonth?: number;
  selectedYear?: number;
}

interface UseEnergyUsageReturn {
  monthlyData: MonthlyUsageSummary | null;
  dailyData: DailyUsageResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

async function trailingNMonthsSummary(accountUuid: string, locationUuid: string, n: number): Promise<MonthlyUsageSummary> {
  let monthlyDataForCurrentYear: MonthlyUsageResponse = await ApiService.getMonthlyUsage(
    accountUuid,
    locationUuid,
    new Date().getFullYear().toString()
  );
  const allMonths: MonthlyUsageResponse[] = [monthlyDataForCurrentYear];
  for (let numMonths = monthlyDataForCurrentYear.months.length;
    // while we have more months to fetch _and_ have more months being returned
    numMonths < n && monthlyDataForCurrentYear.months.length > 0;
    numMonths += monthlyDataForCurrentYear.months.length) {
    const previousYear = (monthlyDataForCurrentYear.year - 1).toString();
    monthlyDataForCurrentYear = await ApiService.getMonthlyUsage(
      accountUuid,
      locationUuid,
      previousYear
    );
    allMonths.push(monthlyDataForCurrentYear);
  }

  // to get the trailing N months,
  // we need to reverse the months array and take the last N months
  const monthsReversed = allMonths
    .reverse()
    .flatMap(response => response.months);
  return {
    units: allMonths[0]?.units || 'kWh',
    months: monthsReversed.slice(-n)
  }
}

export function useEnergyUsage({
  accountUuid,
  locationUuid,
  viewType,
  selectedMonth,
  selectedYear,
}: UseEnergyUsageProps): UseEnergyUsageReturn {
  const [monthlyData, setMonthlyData] = useState<MonthlyUsageSummary | null>(
    null
  );
  const [dailyData, setDailyData] = useState<DailyUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await trailingNMonthsSummary(accountUuid, locationUuid, 12);
      setMonthlyData(data);
    } catch (err) {
      setError('Failed to load monthly usage data');
      console.error('Error fetching monthly usage:', err);
    } finally {
      setIsLoading(false);
    }
  }, [accountUuid, locationUuid]);

  const fetchDailyData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await ApiService.getDailyUsage(
        accountUuid,
        locationUuid,
        selectedMonth,
        selectedYear
      );
      setDailyData(data);
    } catch (err) {
      setError('Failed to load daily usage data');
      console.error('Error fetching daily usage:', err);
    } finally {
      setIsLoading(false);
    }
  }, [accountUuid, locationUuid, selectedMonth, selectedYear]);

  const refetch = () => {
    if (viewType === 'monthly') {
      fetchMonthlyData();
    } else {
      fetchDailyData();
    }
  };

  useEffect(() => {
    if (viewType === 'monthly') {
      fetchMonthlyData();
    } else {
      fetchDailyData();
    }
  }, [
    viewType,
    selectedMonth,
    selectedYear,
    accountUuid,
    locationUuid,
    fetchMonthlyData,
    fetchDailyData,
  ]);

  return {
    monthlyData,
    dailyData,
    isLoading,
    error,
    refetch,
  };
}
