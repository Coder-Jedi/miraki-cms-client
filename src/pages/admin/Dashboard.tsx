import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderStats } from "@/hooks/use-orders";
import { useArtworks } from "@/hooks/use-artworks";
import { useArtists } from "@/hooks/use-artists";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  Users, 
  Palette, 
  ShoppingBag,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DateRange } from "react-day-picker";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend: number;
  isLoading?: boolean;
}

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  
  // Fetch data using our hooks
  const { data: orderStats, isLoading: isLoadingOrders } = useOrderStats({
    fromDate: dateRange?.from?.toISOString(),
    toDate: dateRange?.to?.toISOString(),
  });
  const { data: artworksData, isLoading: isLoadingArtworks } = useArtworks({ limit: 1 });
  const { data: artistsData, isLoading: isLoadingArtists } = useArtists({ limit: 1 });

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Prepare data for the sales chart
  const salesData = {
    labels: orderStats?.salesByMonth?.map(item => item.month) ?? [],
    datasets: [
      {
        label: 'Monthly Sales',
        data: orderStats?.salesByMonth?.map(item => item.sales) ?? [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
      },
    ],
  };

  // Prepare data for the orders by status chart
  const ordersByStatusData = {
    labels: Object.keys(orderStats?.ordersByStatus ?? {}),
    datasets: [
      {
        label: 'Orders by Status',
        data: Object.values(orderStats?.ordersByStatus ?? {}),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(255, 99, 132, 0.5)',
        ],
      },
    ],
  };

  // Helper function to render stat card
  const StatCard = ({ title, value, description, icon: Icon, trend, isLoading }: StatCardProps) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              {Math.abs(trend)}% from last month
            </div>
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your store's performance
          </p>
        </div>
        <CalendarDateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(orderStats?.totalRevenue ?? 0)}
          description="Total revenue across all orders"
          icon={DollarSign}
          trend={orderStats?.revenueTrend ?? 0}
          isLoading={isLoadingOrders}
        />
        <StatCard
          title="Total Orders"
          value={orderStats?.totalOrders ?? 0}
          description="Total number of orders placed"
          icon={ShoppingBag}
          trend={orderStats?.ordersTrend ?? 0}
          isLoading={isLoadingOrders}
        />
        <StatCard
          title="Active Artists"
          value={artistsData?.pagination?.total ?? 0}
          description="Number of active artists"
          icon={Users}
          trend={12.5}
          isLoading={isLoadingArtists}
        />
        <StatCard
          title="Total Artworks"
          value={artworksData?.pagination?.total ?? 0}
          description="Total artworks in your store"
          icon={Palette}
          trend={8.2}
          isLoading={isLoadingArtworks}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Line data={salesData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <Bar data={ordersByStatusData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
