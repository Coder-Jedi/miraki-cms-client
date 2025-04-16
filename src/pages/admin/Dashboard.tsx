
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Palette, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Clock,
  CheckCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Mock data for the dashboard
const salesData = [
  { month: "Jan", amount: 12800 },
  { month: "Feb", amount: 18700 },
  { month: "Mar", amount: 15400 },
  { month: "Apr", amount: 21300 },
  { month: "May", amount: 16500 },
  { month: "Jun", amount: 23700 },
  { month: "Jul", amount: 25800 },
  { month: "Aug", amount: 19200 },
  { month: "Sep", amount: 27500 },
  { month: "Oct", amount: 24600 },
  { month: "Nov", amount: 32400 },
  { month: "Dec", amount: 36800 }
];

const categorySalesData = [
  { name: "Painting", value: 45 },
  { name: "Sculpture", value: 23 },
  { name: "Photography", value: 15 },
  { name: "Digital Art", value: 10 },
  { name: "Mixed Media", value: 7 }
];

const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5", "#D6BCFA", "#8E9196"];

const recentOrders = [
  {
    id: "ORD123456",
    customer: "Arjun Mehta",
    date: "2025-04-15",
    amount: 1450,
    status: "Delivered",
    items: 2
  },
  {
    id: "ORD123455",
    customer: "Priya Sharma",
    date: "2025-04-14",
    amount: 3200,
    status: "Processing",
    items: 1
  },
  {
    id: "ORD123454",
    customer: "Rahul Desai",
    date: "2025-04-14",
    amount: 750,
    status: "Shipped",
    items: 1
  },
  {
    id: "ORD123453",
    customer: "Meera Patel",
    date: "2025-04-13",
    amount: 2320,
    status: "Processing",
    items: 3
  },
  {
    id: "ORD123452",
    customer: "Anand Joshi",
    date: "2025-04-12",
    amount: 900,
    status: "Delivered",
    items: 1
  }
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalArtworks: 0,
    totalOrders: 0,
    totalArtists: 0,
    salesGrowth: 0,
    ordersGrowth: 0
  });

  useEffect(() => {
    // This would be an API call in a real app
    // Simulating loading data
    setTimeout(() => {
      setStats({
        totalSales: 275000,
        totalArtworks: 340,
        totalOrders: 128,
        totalArtists: 45,
        salesGrowth: 12.5,
        ordersGrowth: 8.3
      });
    }, 500);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "Shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "Processing":
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Miraki Artistry Hub admin dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Total Sales</span>
                <span className="text-2xl font-bold">₹{stats.totalSales.toLocaleString()}</span>
              </div>
              <div className="rounded-full p-3 bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>{stats.salesGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Total Orders</span>
                <span className="text-2xl font-bold">{stats.totalOrders}</span>
              </div>
              <div className="rounded-full p-3 bg-primary/10">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-500">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span>{stats.ordersGrowth}% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Total Artworks</span>
                <span className="text-2xl font-bold">{stats.totalArtworks}</span>
              </div>
              <div className="rounded-full p-3 bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Across various categories</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Total Artists</span>
                <span className="text-2xl font-bold">{stats.totalArtists}</span>
              </div>
              <div className="rounded-full p-3 bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-muted-foreground">Active on the platform</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Sales']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>₹{order.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Status */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-blue-100">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full p-3 bg-green-100">
                <CheckCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">34</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
