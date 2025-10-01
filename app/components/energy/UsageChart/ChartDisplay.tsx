'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ViewType } from '../../../hooks/useEnergyUsage';
import { ChartDataPoint } from '../../../utils/energyChartUtils';

interface ChartDisplayProps {
  chartData: ChartDataPoint[];
  viewType: ViewType;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData, viewType }) => {
  const getBarFill = (dataPoint: ChartDataPoint): string => {
    if (viewType === 'daily') {
      if (dataPoint.isFuture) return '#e5e7eb'; // Light gray for future days
      if (!dataPoint.hasData) return '#f3f4f6'; // Very light gray for missing past data
    } else if (viewType === 'monthly' && dataPoint.isPartial) {
      return 'url(#partialMonth)'; // Use pattern for partial current month
    }
    return '#3b82f6'; // Default blue for all data days
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <pattern
              id="partialMonth"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="#3b82f6" />
              <rect width="4" height="8" fill="#93c5fd" />
            </pattern>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 'medium' }}
            formatter={(value: number) => [`${value} kWh`, 'Consumption']}
            labelFormatter={(label) => `Day ${label}`}
          />
          <Bar dataKey="consumption" name="Consumption" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarFill(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDisplay;
