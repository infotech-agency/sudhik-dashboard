import { useApi } from '@/hooks/useApi';
import { dashboardApi } from '@/api/dashboard';
import { StatCard } from '@/components/common/StatCard';
import { FullPageSpinner } from '@/components/common/Spinner';
import { RevenueLineChart } from '@/components/charts/RevenueLineChart';
import { OrdersBarChart } from '@/components/charts/OrdersBarChart';
import { MonthlySalesChart } from '@/components/charts/MonthlySalesChart';
import { StatusDoughnutChart } from '@/components/charts/StatusDoughnutChart';
import { PaymentSplitChart } from '@/components/charts/PaymentSplitChart';
import { TopUsersChart } from '@/components/charts/TopUsersChart';
import { formatCurrency, formatNumber } from '@/utils/format';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Clock,
} from 'lucide-react';

export function Dashboard() {
  const summary = useApi(() => dashboardApi.summary(), []);
  const monthly = useApi(() => dashboardApi.monthlySales(), []);
  const userSpend = useApi(() => dashboardApi.userSpend(), []);

  if (summary.loading) return <FullPageSpinner label="Loading dashboard..." />;

  const s = summary.data;
  const monthlyData = monthly.data ?? [];
  const userSpendData = userSpend.data ?? [];

  const orderBreakdown = s?.orderStatusBreakdown ?? {};
  const paymentSplit = s?.paymentMethodSplit ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-maroon-900">Dashboard</h1>
        <p className="mt-1 text-sm text-maroon-500">Overview of your store performance</p>
      </div>

      {/* Quick stat row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Users" value={formatNumber(s?.totalUsers ?? 0)} icon={Users} accent="maroon" />
        <StatCard label="Total Products" value={formatNumber(s?.totalProducts ?? 0)} icon={Package} accent="gold" />
        <StatCard label="Low Stock" value={formatNumber(s?.lowStockCount ?? 0)} icon={AlertTriangle} accent="amber" />
        <StatCard label="Pending Orders" value={formatNumber(s?.pendingOrders ?? 0)} icon={Clock} accent="red" />
        <StatCard label="Total Orders" value={formatNumber(s?.totalOrders ?? 0)} icon={ShoppingBag} accent="blue" />
        <StatCard label="Total Revenue" value={formatCurrency(s?.totalRevenue ?? 0)} icon={IndianRupee} accent="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card p-6 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-maroon-800">Revenue Trend</h3>
              <p className="text-xs text-maroon-500">Month-wise revenue</p>
            </div>
            <p className="font-serif text-2xl font-semibold text-maroon-900">
              {formatCurrency(s?.totalRevenue ?? 0)}
            </p>
          </div>
          <div className="h-72">
            <RevenueLineChart data={monthlyData} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-1 font-serif text-lg font-semibold text-maroon-800">Order Status</h3>
          <p className="mb-4 text-xs text-maroon-500">Breakdown by status</p>
          <div className="flex h-72 items-center justify-center">
            {Object.keys(orderBreakdown).length > 0 ? (
              <StatusDoughnutChart data={orderBreakdown} />
            ) : (
              <p className="text-sm text-maroon-400">No data</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-1 font-serif text-lg font-semibold text-maroon-800">Orders per Month</h3>
          <p className="mb-4 text-xs text-maroon-500">Monthly order volume</p>
          <div className="h-72">
            <OrdersBarChart data={monthlyData} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-1 font-serif text-lg font-semibold text-maroon-800">Monthly Sales</h3>
          <p className="mb-4 text-xs text-maroon-500">Units sold per month</p>
          <div className="h-72">
            <MonthlySalesChart data={monthlyData} />
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-1 font-serif text-lg font-semibold text-maroon-800">Payment Methods</h3>
          <p className="mb-4 text-xs text-maroon-500">COD vs Online split</p>
          <div className="flex h-72 items-center justify-center">
            {Object.keys(paymentSplit).length > 0 ? (
              <PaymentSplitChart data={paymentSplit} />
            ) : (
              <p className="text-sm text-maroon-400">No data</p>
            )}
          </div>
        </div>

        <div className="card p-6 xl:col-span-3">
          <h3 className="mb-1 font-serif text-lg font-semibold text-maroon-800">Top Spending Users</h3>
          <p className="mb-4 text-xs text-maroon-500">Highest lifetime spend</p>
          <div className="h-80">
            {userSpendData.length > 0 ? (
              <TopUsersChart data={userSpendData} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-maroon-400">
                No data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
