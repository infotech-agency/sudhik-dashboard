import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { baseChartOptions, chartColors, gridOptions } from '@/utils/chartConfig';

interface Point {
  month: string;
  unitsSold?: number;
}

export function MonthlySalesChart({ data }: { data: Point[] }) {
  const chartData: ChartData<'bar'> = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Units Sold',
        data: data.map((d) => d.unitsSold ?? 0),
        backgroundColor: chartColors.maroon,
        borderColor: chartColors.maroon,
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
