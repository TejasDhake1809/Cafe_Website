import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';

export default function PaymentTypePieChart(props) {
  
  const tempdata = [
            { id: 0, value: props.online, label: 'Online' },
            { id: 1, value: props.cash, label: 'Cash' },
          ];
  return (
      <PieChart
        series={[
          {
            data: tempdata,
          },
        ]}
        width={50}
        height={50}
      />
    )
}
