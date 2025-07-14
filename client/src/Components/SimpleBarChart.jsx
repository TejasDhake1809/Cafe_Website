import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function SimpleBarChart(props) {
  return (
    <BarChart
      height={300}
      series={[
        { data: props.revenue, label: 'Revenue', id: 'revenueId' },
      ]}
      xAxis={[{ data: props.label }]}
      yAxis={[{ width: 50 }]}
    />
  );
}
