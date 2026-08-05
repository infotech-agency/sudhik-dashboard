import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const MAROON = '#4A1020';
export const GOLD = '#C9A227';
export const CREAM = '#FDF6EC';

export const chartColors = {
  maroon: '#4A1020',
  maroonSoft: 'rgba(74, 16, 32, 0.12)',
  gold: '#C9A227',
  goldSoft: 'rgba(201, 162, 39, 0.18)',
  cream: '#FDF6EC',
  green: '#2E7D32',
  amber: '#ED6C02',
  red: '#C62828',
  blue: '#1565C0',
};

export const baseChartOptions: ChartOptions<'line' | 'bar' | 'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#4A1020', font: { family: 'Inter', size: 12 } },
    },
    tooltip: {
      backgroundColor: '#4A1020',
      titleColor: '#FDF6EC',
      bodyColor: '#FDF6EC',
      borderColor: '#C9A227',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      titleFont: { family: 'Inter', size: 13, weight: 'bold' },
      bodyFont: { family: 'Inter', size: 12 },
    },
  },
};

export const gridOptions = {
  x: { ticks: { color: '#6E2438', font: { family: 'Inter', size: 11 } }, grid: { display: false } },
  y: {
    ticks: { color: '#6E2438', font: { family: 'Inter', size: 11 } },
    grid: { color: 'rgba(74, 16, 32, 0.06)' },
  },
};
