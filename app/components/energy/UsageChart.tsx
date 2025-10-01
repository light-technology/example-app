'use client';

import React, { useState } from 'react';
import { useEnergyUsage, ViewType } from '../../hooks/useEnergyUsage';
import {
  formatChartData,
  getDataCompletenessInfo,
} from '../../utils/energyChartUtils';
import { Card, ErrorDisplay, LoadingContainer, EmptyState } from '../ui';
import { ChartControls, ChartDisplay, ChartInfo } from './UsageChart/';

interface UsageChartProps {
  accountUuid: string;
  locationUuid: string;
}

const UsageChart: React.FC<UsageChartProps> = ({
  accountUuid,
  locationUuid,
}) => {
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const { monthlyData, dailyData, isLoading, error } = useEnergyUsage({
    accountUuid,
    locationUuid,
    viewType,
    selectedMonth,
    selectedYear,
  });

  const currentData = viewType === 'monthly' ? monthlyData : dailyData;
  const chartData = formatChartData(
    currentData,
    viewType,
    selectedMonth,
    selectedYear
  );
  const completenessInfo = getDataCompletenessInfo(
    currentData,
    viewType,
    selectedMonth,
    selectedYear
  );

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
          Energy Usage
        </h2>

        <ChartControls
          viewType={viewType}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onViewTypeChange={setViewType}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />
      </div>

      {error && <ErrorDisplay message={error} className="mb-6" />}

      {isLoading ? (
        <LoadingContainer size="lg" className="h-96" />
      ) : chartData.length > 0 ? (
        <ChartDisplay chartData={chartData} viewType={viewType} />
      ) : (
        <EmptyState
          icon="📊"
          title="No usage data available"
          description="Usage data will appear here once available"
          className="h-96"
        />
      )}

      <ChartInfo
        currentData={currentData}
        chartDataLength={chartData.length}
        viewType={viewType}
        completenessInfo={completenessInfo}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </Card>
  );
};

export default UsageChart;
