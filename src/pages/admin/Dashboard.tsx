
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Users, ShoppingCart, DollarSign } from "lucide-react";

// Mock dashboard data based on API response structure
const dashboardData = {
  totalSales: 12500,
  totalOrders: 45,
  totalArtworks: 340,
  totalArtists: 28,
  recentOrders: [
    { id: "order1", customer: "John Doe", amount: 450, status: "completed" },
    { id: "order2", customer: "Alice Smith", amount: 750, status: "processing" },
    { id: "order3", customer: "Robert Brown", amount: 325, status: "processing" },
  ],
  salesByCategory: [
    { category: "Painting", sales: 6500, count: 23 },
    { category: "Sculpture", sales: 2800, count: 8 },
    { category: "Photography", sales: 1900, count: 10 },
    { category: "Digital Art", sales: 1300, count: 4 },
  ],
  salesByMonth: [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1900 },
    { month: "Mar", sales: 1300 },
    { month: "Apr", sales: 1700 },
    { month: "May", sales: 1450 },
    { month: "Jun", sales: 2100 },
  ],
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Miraki Artistry Hub platform.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Artworks
            </CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalArtworks}</div>
            <p className="text-xs text-muted-foreground">
              +15 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Artists
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalArtists}</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts as simple cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
            <CardDescription>
              Sales trend over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              {dashboardData.salesByMonth.map((item) => (
                <div key={item.month} className="flex items-center justify-between">
                  <span>{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="bg-primary h-4" 
                      style={{ 
                        width: `${(item.sales / Math.max(...dashboardData.salesByMonth.map(i => i.sales))) * 200}px`
                      }}
                    />
                    <span>₹{item.sales}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Distribution of sales across artwork categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              {dashboardData.salesByCategory.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <span>{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`h-4 ${
                        index % 4 === 0 ? "bg-primary" : 
                        index % 4 === 1 ? "bg-secondary" : 
                        index % 4 === 2 ? "bg-accent" : "bg-muted"
                      }`} 
                      style={{ 
                        width: `${(item.sales / Math.max(...dashboardData.salesByCategory.map(i => i.sales))) * 200}px`
                      }}
                    />
                    <span>₹{item.sales}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Latest orders processed on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2">₹{order.amount}</td>
                  <td className="p-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === "completed"
                          ? "bg-success/20 text-success"
                          : order.status === "processing"
                          ? "bg-warning/20 text-warning"
                          : "bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>
            Number of items sold by category
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-2">
            {dashboardData.salesByCategory.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <span>{item.category}</span>
                <div className="flex items-center gap-2">
                  <div 
                    className={`h-4 ${
                      index % 4 === 0 ? "bg-primary" : 
                      index % 4 === 1 ? "bg-secondary" : 
                      index % 4 === 2 ? "bg-accent" : "bg-muted"
                    }`} 
                    style={{ 
                      width: `${(item.count / Math.max(...dashboardData.salesByCategory.map(i => i.count))) * 200}px`
                    }}
                  />
                  <span>{item.count} items</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
