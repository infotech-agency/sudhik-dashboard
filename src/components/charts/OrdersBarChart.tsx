import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { baseChartOptions, chartColors, gridOptions } from '@/utils/chartConfig';

interface Point {
  month: string;
  orders?: number;
}

export function OrdersBarChart({ data }: { data: Point[] }) {
  const chartData: ChartData<'bar'> = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Orders',
        data: data.map((d) => d.orders ?? 0),
        backgroundColor: chartColors.gold,
        borderColor: chartColors.gold,
        borderRadius: 6,
        maxBarThickness: 42,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    ...(baseChartOptions as ChartOptions<'bar'>),
    scales: gridOptions,
  };

  return <Bar data={chartData} options={options} />;
}
