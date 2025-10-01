'use client';

import React from 'react';
import { ViewType } from '../../../hooks/useEnergyUsage';

interface ChartControlsProps {
  viewType: ViewType;
  selectedMonth: number;
  selectedYear: number;
  onViewTypeChange: (viewType: ViewType) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
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

const ChartControls: React.FC<ChartControlsProps> = ({
  viewType,
  selectedMonth,
  selectedYear,
  onViewTypeChange,
  onMonthChange,
  onYearChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {viewType === 'daily' && (
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 4 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onViewTypeChange('monthly')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewType === 'monthly'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onViewTypeChange('daily')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            viewType === 'daily'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Daily
        </button>
      </div>
    </div>
  );
};

export default ChartControls;
