import { renderHook, act } from '@testing-library/react';
import { trailingNMonthsSummary, useEnergyUsage } from './useEnergyUsage';
import { ApiService } from '../services/api';
import { MonthlyUsageResponse, DailyUsageResponse } from '../types/energy';

// Mock the ApiService
jest.mock('../services/api');
const mockApiService = ApiService as jest.Mocked<typeof ApiService>;

describe('useEnergyUsage', () => {
  const defaultProps = {
    accountUuid: 'test-account-uuid',
    locationUuid: 'test-location-uuid',
    viewType: 'monthly' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error in tests
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with correct initial state', () => {
    const { result } = renderHook(() => useEnergyUsage(defaultProps));

    expect(result.current.monthlyData).toBe(null);
    expect(result.current.dailyData).toBe(null);
    expect(result.current.isLoading).toBe(true); // Loading starts immediately due to useEffect
    expect(result.current.error).toBe(null);
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should fetch monthly data on mount when viewType is monthly', async () => {
    const monthlyData = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      .map((month) => ({
        month,
        consumption: '100.0',
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      })
    );
    const mockMonthlyData: MonthlyUsageResponse = {
      year: new Date().getFullYear(),
      units: 'kWh',
      months: monthlyData
    };

    mockApiService.getMonthlyUsage.mockResolvedValue(mockMonthlyData);

    const { result } = renderHook(() => useEnergyUsage(defaultProps));

    // Should start loading
    expect(result.current.isLoading).toBe(true);

    // Wait for API call to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getMonthlyUsage).toHaveBeenCalledWith(
      defaultProps.accountUuid,
      defaultProps.locationUuid,
      "2026",
    );
    expect(result.current.monthlyData?.months).toEqual(mockMonthlyData.months);
    expect(result.current.monthlyData?.units).toBe('kWh');
    expect(result.current.dailyData).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should fetch daily data when viewType is daily with selected month/year', async () => {
    const mockDailyData: DailyUsageResponse = {
      month: 1,
      year: 2025,
      units: 'kWh',
      days: [
        {
          date: '2025-01-01',
          consumption: '10.5',
          generation: '0',
          vehicle_charging: '0',
          eligible_vehicle_charging: '0',
        },
      ],
    };

    mockApiService.getDailyUsage.mockResolvedValue(mockDailyData);

    const { result } = renderHook(() =>
      useEnergyUsage({
        ...defaultProps,
        viewType: 'daily',
        selectedMonth: 1,
        selectedYear: 2025,
      })
    );

    // Wait for API call to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getDailyUsage).toHaveBeenCalledWith(
      defaultProps.accountUuid,
      defaultProps.locationUuid,
      1,
      2025
    );
    expect(result.current.dailyData).toEqual(mockDailyData);
    expect(result.current.monthlyData).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should not fetch daily data when viewType is daily but month/year not provided', async () => {
    const { result } = renderHook(() =>
      useEnergyUsage({
        ...defaultProps,
        viewType: 'daily',
      })
    );

    // Wait for potential API call
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getDailyUsage).not.toHaveBeenCalled();
    expect(result.current.dailyData).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle monthly data fetch error', async () => {
    const errorMessage = 'API Error';
    mockApiService.getMonthlyUsage.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useEnergyUsage(defaultProps));

    // Wait for API call to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.monthlyData).toBe(null);
    expect(result.current.error).toBe('Failed to load monthly usage data');
    expect(result.current.isLoading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching monthly usage:',
      expect.any(Error)
    );
  });

  it('should handle daily data fetch error', async () => {
    const errorMessage = 'API Error';
    mockApiService.getDailyUsage.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() =>
      useEnergyUsage({
        ...defaultProps,
        viewType: 'daily',
        selectedMonth: 1,
        selectedYear: 2025,
      })
    );

    // Wait for API call to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.dailyData).toBe(null);
    expect(result.current.error).toBe('Failed to load daily usage data');
    expect(result.current.isLoading).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching daily usage:',
      expect.any(Error)
    );
  });

  it('should refetch data when refetch is called', async () => {
    const mockMonthlyData: MonthlyUsageResponse = {
      year: 2025,
      units: 'kWh',
      months: [],
    };

    mockApiService.getMonthlyUsage.mockResolvedValue(mockMonthlyData);

    const { result } = renderHook(() => useEnergyUsage(defaultProps));

    // Wait for initial fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Clear the mock call count
    mockApiService.getMonthlyUsage.mockClear();

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // Wait for refetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getMonthlyUsage).toHaveBeenCalledTimes(1);
  });

  it('should refetch daily data when refetch is called with daily viewType', async () => {
    const mockDailyData: DailyUsageResponse = {
      month: 1,
      year: 2025,
      units: 'kWh',
      days: [],
    };

    mockApiService.getDailyUsage.mockResolvedValue(mockDailyData);

    const { result } = renderHook(() =>
      useEnergyUsage({
        ...defaultProps,
        viewType: 'daily',
        selectedMonth: 1,
        selectedYear: 2025,
      })
    );

    // Wait for initial fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Clear the mock call count
    mockApiService.getDailyUsage.mockClear();

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // Wait for refetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getDailyUsage).toHaveBeenCalledTimes(1);
  });

  it('should fetch new data when dependencies change', async () => {
    const mockMonthlyData: MonthlyUsageResponse = {
      year: new Date().getFullYear(),
      units: 'kWh',
      months: [],
    };

    mockApiService.getMonthlyUsage.mockResolvedValue(mockMonthlyData);

    const { result, rerender } = renderHook((props) => useEnergyUsage(props), {
      initialProps: defaultProps,
    });

    // Wait for initial fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getMonthlyUsage).toHaveBeenCalledTimes(1);
    expect(result.current).toBeDefined(); // Ensure result is used

    // Change account UUID and rerender
    const newProps = { ...defaultProps, accountUuid: 'new-account-uuid' };
    rerender(newProps);

    // Wait for new fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getMonthlyUsage).toHaveBeenCalledTimes(2);
    expect(mockApiService.getMonthlyUsage).toHaveBeenLastCalledWith(
      'new-account-uuid',
      defaultProps.locationUuid,
      `${new Date().getFullYear()}`
    );
  });

  it('should switch from monthly to daily data when viewType changes', async () => {
    const mockMonthlyData: MonthlyUsageResponse = {
      year: 2025,
      units: 'kWh',
      months: [],
    };
    const mockDailyData: DailyUsageResponse = {
      month: 1,
      year: 2025,
      units: 'kWh',
      days: [],
    };

    mockApiService.getMonthlyUsage.mockResolvedValue(mockMonthlyData);
    mockApiService.getDailyUsage.mockResolvedValue(mockDailyData);

    const { result, rerender } = renderHook((props) => useEnergyUsage(props), {
      initialProps: defaultProps,
    });

    // Wait for initial monthly fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.monthlyData).not.toBe(null);
    expect(result.current.dailyData).toBe(null);

    // Change to daily view
    const dailyProps = {
      ...defaultProps,
      viewType: 'daily' as const,
      selectedMonth: 1,
      selectedYear: 2025,
    };
    rerender(dailyProps);

    // Wait for daily fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(mockApiService.getDailyUsage).toHaveBeenCalledWith(
      defaultProps.accountUuid,
      defaultProps.locationUuid,
      1,
      2025
    );
    expect(result.current.dailyData).not.toBe(null);
    // Ensure result is used
    expect(result.current).toBeDefined();
  });

  it('should clear error state before new fetch', async () => {
    // First call fails
    mockApiService.getMonthlyUsage
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({ year: 2025, units: 'kWh', months: [] });

    const { result } = renderHook(() => useEnergyUsage(defaultProps));

    // Wait for first (failed) fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Failed to load monthly usage data');

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    // Error should be cleared immediately when refetch starts
    expect(result.current.error).toBe(null);

    // Wait for successful fetch
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe(null);
    expect(result.current.monthlyData).not.toBe(null);
  });

});

describe('trailingNMonthsSummary', () => {
  it('should refetch once to produce 15 months worth of data', async () => {
    const mockMonthlyDataResponses: MonthlyUsageResponse[] = [];
    for (let yearOffset = 0; yearOffset < 2; yearOffset++) {
      const year = 2024 - yearOffset;
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(year, i).toLocaleString('default', { month: 'long' }),
        consumption: (100 + i).toString(),
        generation: '0',
        vehicle_charging: '0',
        eligible_vehicle_charging: '0',
      }));
      mockMonthlyDataResponses.push({
        year,
        units: 'kWh',
        months,
        previous: 'non-empty-string-to-encourage-refetch'
      });
    }

    mockApiService.getMonthlyUsage
      .mockResolvedValueOnce(mockMonthlyDataResponses[0]) // 2024
      .mockResolvedValueOnce(mockMonthlyDataResponses[1]); // 2023

    const result = await trailingNMonthsSummary(
      'test-account-uuid',
      'test-location-uuid',
      15
    );

    expect(mockApiService.getMonthlyUsage).toHaveBeenCalledTimes(2);
    expect(result.months.length).toBe(15);
    expect(result.months[0].month).toBe('October'); // 2023
    expect(result.months[14].month).toBe('December'); // 2024
    expect(result.units).toBe('kWh');
  });
  it('should try to fetch twice but only get 12 months of data if earlier year has no data', async () => {
    const mockMonthlyDataResponses: MonthlyUsageResponse[] = [];
    // 2024 has data
    const months2024 = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleString('default', { month: 'long' }),
      consumption: (100 + i).toString(),
      generation: '0',
      vehicle_charging: '0',
      eligible_vehicle_charging: '0',
    }));
    mockMonthlyDataResponses.push({
      year: 2024,
      units: 'kWh',
      months: months2024,
      previous: 'non-empty-string-to-encourage-refetch'
    });
    // 2023 has no data
    mockMonthlyDataResponses.push({
      year: 2023,
      units: 'kWh',
      months: [],
    });

    mockApiService.getMonthlyUsage
      .mockResolvedValueOnce(mockMonthlyDataResponses[0]) // 2024
      .mockResolvedValueOnce(mockMonthlyDataResponses[1]); // 2023

    const result = await trailingNMonthsSummary(
      'test-account-uuid',
      'test-location-uuid',
      15
    );

    expect(mockApiService.getMonthlyUsage).toHaveBeenCalledTimes(2);
    expect(result.months.length).toBe(12);
    expect(result.months[0].month).toBe('January'); // 2024
    expect(result.months[11].month).toBe('December'); // 2024
    expect(result.units).toBe('kWh');
  });
});
