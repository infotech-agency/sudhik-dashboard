import { Doughnut } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { baseChartOptions, chartColors } from '@/utils/chartConfig';

const statusColors: Record<string, string> = {
  Processing: chartColors.amber,
  Shipped: chartColors.blue,
  Delivered: chartColors.green,
  Cancelled: chartColors.red,
  Pending: chartColors.gold,
};

export function StatusDoughnutChart({ data }: { data: Record<string, number> }) {
  const labels = Object.keys(data);
  const chartData: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        data: labels.map((l) => data[l]),
        backgroundColor: labels.map((l) => statusColors[l] ?? chartColors.maroon),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    ...(baseChartOptions as ChartOptions<'doughnut'>),
    cutout: '62%',
  };

  return <Doughnut data={chartData} options={options} />;
}
