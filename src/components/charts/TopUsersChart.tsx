import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import { baseChartOptions, chartColors, gridOptions } from '@/utils/chartConfig';
import type { UserSpendRow } from '@/api/dashboard';

export function TopUsersChart({ data }: { data: UserSpendRow[] }) {
  const top = [...data].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 8);
  const chartData: ChartData<'bar'> = {
    labels: top.map((u) => u.name),
    datasets: [
      {
        label: 'Total Spend',
        data: top.map((u) => u.totalSpend),
        backgroundColor: chartColors.gold,
        borderColor: chartColors.gold,
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    ...(baseChartOptions as ChartOptions<'bar'>),
    indexAxis: 'y',
    scales: gridOptions,
    plugins: {
      ...(baseChartOptions as ChartOptions<'bar'>).plugins,
      tooltip: {
        ...(baseChartOptions as ChartOptions<'bar'>).plugins?.tooltip,
        callbacks: {
          label: (ctx) => `₹${(ctx.parsed.x ?? 0).toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
