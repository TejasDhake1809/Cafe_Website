import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState, useEffect } from 'react';

export default function SimplePieChart(props) {
  const [items, setItems] = useState({});
  useEffect(() => {
    const fetchProps = () => {
      if (props) {
        setItems(props);
      }
    }

    fetchProps();
  }, [props]);

  
  console.log("this is props",props);
  const tempdata = [
            { id: 0, value: parseFloat(items.starterspercent), label: 'Starters' },
            { id: 1, value: parseFloat(items.maincoursepercent), label: 'Main Course' },
            { id: 2, value: parseFloat(items.dessertpercent), label: 'Dessert' },
            { id: 3, value: parseFloat(items.drinkspercent), label: 'Drinks' },
          ];
  return (
    <>
      {items ? (
      <PieChart
        series={[
          {
            data: tempdata,
          },
        ]}
        width={200}
        height={200}
      />
    ) : (
      <p>Loading chart data...</p>
    )}
    </>
  );
}
