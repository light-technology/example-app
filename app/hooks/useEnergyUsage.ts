import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/api';
import { MonthlyUsageResponse, DailyUsageResponse } from '../types/energy';

export type ViewType = 'monthly' | 'daily';

interface UseEnergyUsageProps {
  accountUuid: string;
  locationUuid: string;
  viewType: ViewType;
  selectedMonth?: number;
  selectedYear?: number;
}

interface UseEnergyUsageReturn {
  monthlyData: MonthlyUsageResponse | null;
  dailyData: DailyUsageResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEnergyUsage({
  accountUuid,
  locationUuid,
  viewType,
  selectedMonth,
  selectedYear,
}: UseEnergyUsageProps): UseEnergyUsageReturn {
  const [monthlyData, setMonthlyData] = useState<MonthlyUsageResponse | null>(
    null
  );
  const [dailyData, setDailyData] = useState<DailyUsageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ApiService.getMonthlyUsage(accountUuid, locationUuid);
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
