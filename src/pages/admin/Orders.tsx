
import { useState } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  TruckIcon,
  PackageCheck,
  XCircle,
  Calendar,
  ArrowUpDown,
  EyeIcon,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock orders data based on API response structure
const mockOrders = Array.from({ length: 15 }, (_, i) => {
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const paymentStatuses = ["pending", "paid", "failed", "refunded"];
  const status = statuses[Math.floor(Math.random() * 5)];
  
  return {
    id: `order${(i + 1).toString().padStart(3, '0')}`,
    userId: `user${Math.floor(Math.random() * 100) + 1}`,
    customerName: `Customer ${i + 1}`,
    email: `customer${i+1}@example.com`,
    items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
      artwork: {
        id: `artwork${Math.floor(Math.random() * 50) + 1}`,
        title: `Artwork ${Math.floor(Math.random() * 50) + 1}`,
        artist: `Artist ${Math.floor(Math.random() * 20) + 1}`,
        image: `https://source.unsplash.com/random/300x300?art=${Math.floor(Math.random() * 100)}`,
      },
      quantity: Math.floor(Math.random() * 2) + 1,
      price: Math.floor(Math.random() * 1000) + 500,
    })),
    status,
    paymentStatus: status === "cancelled" ? (Math.random() > 0.5 ? "refunded" : "failed") : paymentStatuses[Math.floor(Math.random() * 2)],
    summary: {
      subtotal: 0, // Will be calculated
      shipping: Math.floor(Math.random() * 100) + 50,
      tax: 0, // Will be calculated
      total: 0, // Will be calculated
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  };
}).map(order => {
  // Calculate totals
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% tax
  order.summary.subtotal = subtotal;
  order.summary.tax = tax;
  order.summary.total = subtotal + tax + order.summary.shipping;
  return order;
});

// Status filters
const orderStatuses = ["All Statuses", "pending", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["All Payment Statuses", "pending", "paid", "failed", "refunded"];

export default function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Statuses");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        statusFilter === "All Statuses" || order.status === statusFilter;
      const matchesPayment = 
        paymentFilter === "All Payment Statuses" || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would call the API
    setOrders(
      orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleUpdatePaymentStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would call the API
    setOrders(
      orders.map(order => 
        order.id === orderId 
          ? { ...order, paymentStatus: newStatus } 
          : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
    }
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "processing":
        return <ShoppingCart className="h-4 w-4 text-primary" />;
      case "shipped":
        return <TruckIcon className="h-4 w-4 text-info" />;
      case "delivered":
        return <PackageCheck className="h-4 w-4 text-success" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    let variant = "outline";
    switch (status) {
      case "pending":
        variant = "outline";
        break;
      case "processing":
        variant = "secondary";
        break;
      case "shipped":
        variant = "default";
        break;
      case "delivered":
        variant = "success";
        break;
      case "cancelled":
        variant = "destructive";
        break;
    }
    
    return (
      <Badge variant={variant as any} className="flex items-center gap-1 capitalize">
        {getStatusIcon(status)}
        <span>{status}</span>
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    let variant = "outline";
    switch (status) {
      case "pending":
        variant = "outline";
        break;
      case "paid":
        variant = "success";
        break;
      case "failed":
        variant = "destructive";
        break;
      case "refunded":
        variant = "secondary";
        break;
    }
    
    return (
      <Badge variant={variant as any} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and shipments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === "pending").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === "processing").length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter(o => o.status === "delivered").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Status:</span> 
                <span>{statusFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {orderStatuses.map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Payment:</span>
                <span>{paymentFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {paymentStatuses.map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => setPaymentFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <Calendar className="h-4 w-4" />
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{sortOrder === "asc" ? "Oldest First" : "Newest First"}</span>
          </Button>
          
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("All Statuses");
            setPaymentFilter("All Payment Statuses");
          }}>
            Clear
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="text-right">₹{order.summary.total}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                      className="flex items-center gap-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No orders found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order {selectedOrder?.id}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  <span>Invoice</span>
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-4">
              {/* Customer & Order Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Order Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <div>
                          <Select
                            value={selectedOrder.status}
                            onValueChange={(value) => handleUpdateOrderStatus(selectedOrder.id, value)}
                          >
                            <SelectTrigger className="h-7 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Payment:</span>
                        <div>
                          <Select
                            value={selectedOrder.paymentStatus}
                            onValueChange={(value) => handleUpdatePaymentStatus(selectedOrder.id, value)}
                          >
                            <SelectTrigger className="h-7 w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img 
                                src={item.artwork.image}
                                alt={item.artwork.title}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                              <span>{item.artwork.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.artwork.artist}</TableCell>
                          <TableCell className="text-right">₹{item.price}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.price * item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Order Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.summary.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹{selectedOrder.summary.shipping}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{selectedOrder.summary.tax}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{selectedOrder.summary.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
