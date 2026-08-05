import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { baseChartOptions, chartColors, gridOptions } from '@/utils/chartConfig';

interface Point {
  month: string;
  revenue?: number;
}

export function RevenueLineChart({ data }: { data: Point[] }) {
  const chartData: ChartData<'line'> = {
    labels: data?.map((d) => d.month),
    datasets: [
      {
        label: 'Revenue',
        data: data?.map((d) => d.revenue ?? 0),
        borderColor: chartColors.maroon,
        backgroundColor: chartColors.maroonSoft,
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: chartColors.maroon,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    ...(baseChartOptions as ChartOptions<'line'>),
    scales: gridOptions,
    plugins: {
      ...(baseChartOptions as ChartOptions<'line'>).plugins,
      tooltip: {
        ...(baseChartOptions as ChartOptions<'line'>).plugins?.tooltip,
        callbacks: {
          label: (ctx) => `₹${(ctx.parsed.y ?? 0).toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
