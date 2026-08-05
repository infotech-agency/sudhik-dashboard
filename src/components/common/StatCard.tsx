import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'maroon',
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: 'maroon' | 'gold' | 'green' | 'amber' | 'red' | 'blue';
}) {
  const accentBg: Record<string, string> = {
    maroon: 'bg-maroon-700 text-cream-50',
    gold: 'bg-gold-500 text-white',
    green: 'bg-green-600 text-white',
    amber: 'bg-amber-500 text-white',
    red: 'bg-red-600 text-white',
    blue: 'bg-blue-600 text-white',
  };

  return (
    <div className="card p-5 transition-shadow hover:shadow-card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-maroon-500">{label}</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-maroon-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentBg[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trend.up ? (
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-600" />
          )}
          <span className={trend.up ? 'text-green-600' : 'text-red-600'}>{trend.value}</span>
          <span className="text-maroon-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
