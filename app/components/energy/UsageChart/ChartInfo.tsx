'use client';

import React from 'react';
import { ViewType } from '../../../hooks/useEnergyUsage';
import { DataCompletenessInfo } from '../../../utils/energyChartUtils';
import {
  DailyUsageResponse,
  MonthlyUsageSummary,
} from '../../../types/energy';

interface ChartInfoProps {
  currentData: MonthlyUsageSummary | DailyUsageResponse | null;
  chartDataLength: number;
  viewType: ViewType;
  completenessInfo: DataCompletenessInfo;
  selectedMonth: number;
  selectedYear: number;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ChartInfo: React.FC<ChartInfoProps> = ({
  currentData,
  chartDataLength,
  viewType,
  completenessInfo,
  selectedMonth,
  selectedYear,
}) => {
  if (!currentData || chartDataLength === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm text-gray-600">
        <p>
          Showing {viewType} usage data in {currentData.units}
          {viewType === 'daily' &&
            ` for ${months[selectedMonth - 1]} ${selectedYear}`}
          {viewType === 'monthly' && ` for Trailing ${chartDataLength} months`}
        </p>
      </div>

      {viewType === 'daily' &&
        completenessInfo.isCurrentPeriod &&
        completenessInfo.daysWithData > 0 && (
          <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
            <p>
              ⚠️ Current month data is incomplete: showing data through day{' '}
              {completenessInfo.daysWithData} of {completenessInfo.totalDays}
            </p>
          </div>
        )}

      {viewType === 'daily' && (
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Data available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Future/No data</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartInfo;
