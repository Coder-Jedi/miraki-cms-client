
import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// Mock orders data
const mockOrders = Array.from({ length: 15 }, (_, i) => {
  const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const paymentStatuses = ["pending", "paid", "failed", "refunded"];
  const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
  
  const names = [
    "Arjun Mehta", "Priya Sharma", "Rahul Desai", "Anjali Gupta", 
    "Vikram Singh", "Meera Patel", "Raj Kapoor", "Ananya Reddy"
  ];
  
  const locations = ["Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad"];
  
  // Generate order items (1-3 items per order)
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = Array.from({ length: numItems }, (_, j) => ({
    id: `item${i}${j}`,
    artwork: {
      id: `artwork${i * 3 + j}`,
      title: `Artwork ${i * 3 + j}`,
      artist: `Artist ${(i * 3 + j) % 8 + 1}`,
      image: `https://source.unsplash.com/random/100x100?art=${i * 3 + j}`
    },
    quantity: Math.floor(Math.random() * 2) + 1,
    price: Math.floor(Math.random() * 1000) + 500
  }));
  
  // Calculate order totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50;
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + shipping + tax;
  
  return {
    id: `ORD${100000 + i}`,
    userId: `user${i % 8}`,
    customerName: names[i % names.length],
    customerEmail: `${names[i % names.length].toLowerCase().replace(' ', '.')}@example.com`,
    items: items,
    shippingAddress: {
      name: names[i % names.length],
      line1: `${Math.floor(Math.random() * 100) + 1} ${['Park Street', 'Hill Road', 'Marine Drive', 'MG Road'][i % 4]}`,
      line2: `Apartment ${Math.floor(Math.random() * 100) + 1}`,
      city: locations[i % locations.length],
      state: "Maharashtra",
      postalCode: `${400000 + Math.floor(Math.random() * 100)}`,
      country: "India",
      phone: `+91 98${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`
    },
    paymentMethod: Math.random() > 0.5 ? "card" : "upi",
    paymentStatus: paymentStatus,
    status: status,
    trackingInfo: status === "shipped" || status === "delivered" ? {
      carrier: ["FedEx", "DHL", "Blue Dart"][Math.floor(Math.random() * 3)],
      trackingNumber: `TRK${Math.floor(Math.random() * 1000000)}`,
      trackingUrl: "https://example.com/tracking"
    } : null,
    summary: {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total
    },
    notes: Math.random() > 0.7 ? "Please handle with care." : "",
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString()
  };
});

// Filter options
const statusOptions = ["All", "pending", "processing", "shipped", "delivered", "cancelled"];
const paymentStatusOptions = ["All", "pending", "paid", "failed", "refunded"];

export default function Orders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [trackingInfo, setTrackingInfo] = useState({
    carrier: "",
    trackingNumber: "",
    trackingUrl: ""
  });
  const [statusNote, setStatusNote] = useState("");

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || order.status === statusFilter;
    
    const matchesPaymentStatus = 
      paymentStatusFilter === "All" || order.paymentStatus === paymentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const handleViewOrder = (order: any) => {
    setViewOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (order: any) => {
    setUpdatingOrder(order);
    setNewStatus(order.status);
    setTrackingInfo({
      carrier: order.trackingInfo?.carrier || "",
      trackingNumber: order.trackingInfo?.trackingNumber || "",
      trackingUrl: order.trackingInfo?.trackingUrl || ""
    });
    setStatusNote("");
    setIsUpdateStatusDialogOpen(true);
  };

  const saveStatusUpdate = () => {
    // In a real app, this would call the API
    const updatedOrders = orders.map(order => {
      if (order.id === updatingOrder.id) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        
        // Add tracking info if status is shipped or delivered
        if (newStatus === "shipped" || newStatus === "delivered") {
          updatedOrder.trackingInfo = {
            carrier: trackingInfo.carrier,
            trackingNumber: trackingInfo.trackingNumber,
            trackingUrl: trackingInfo.trackingUrl
          };
        }
        
        // Add status note if provided
        if (statusNote) {
          updatedOrder.notes = statusNote;
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    setIsUpdateStatusDialogOpen(false);
    
    toast({
      title: "Order status updated",
      description: `Order ${updatingOrder.id} has been updated to ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders across your Miraki Artistry Hub.
        </p>
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
                <span>Status: {statusFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {statusOptions.map((status) => (
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
                <span>Payment: {paymentStatusFilter}</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {paymentStatusOptions.map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => setPaymentStatusFilter(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("All");
            setPaymentStatusFilter("All");
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
                <TableHead className="w-[120px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customerName}</div>
                      <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>₹{order.summary.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleUpdateStatus(order)}
                        >
                          <Truck className="h-4 w-4" />
                          <span>Update Status</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No orders found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order {viewOrder?.id} placed on {viewOrder?.createdAt && new Date(viewOrder.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto py-4">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(viewOrder.status)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Payment:</span>
                  {getPaymentStatusBadge(viewOrder.paymentStatus)}
                </div>
              </div>
              
              <Separator />
              
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{viewOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{viewOrder.customerEmail}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-1">
                  <p>{viewOrder.shippingAddress.name}</p>
                  <p>{viewOrder.shippingAddress.line1}</p>
                  {viewOrder.shippingAddress.line2 && <p>{viewOrder.shippingAddress.line2}</p>}
                  <p>{viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.postalCode}</p>
                  <p>{viewOrder.shippingAddress.country}</p>
                  <p className="mt-1">{viewOrder.shippingAddress.phone}</p>
                </div>
              </div>
              
              {/* Tracking Info */}
              {viewOrder.trackingInfo && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Tracking Information</h3>
                    <div className="grid grid-cols-1 gap-1">
                      <p>Carrier: {viewOrder.trackingInfo.carrier}</p>
                      <p>Tracking Number: {viewOrder.trackingInfo.trackingNumber}</p>
                      {viewOrder.trackingInfo.trackingUrl && (
                        <a 
                          href={viewOrder.trackingInfo.trackingUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Track Package
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              
              {/* Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="space-y-4">
                  {viewOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-[60px] h-[60px] rounded overflow-hidden">
                        <img 
                          src={item.artwork.image} 
                          alt={item.artwork.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.artwork.title}</p>
                        <p className="text-sm text-muted-foreground">by {item.artwork.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{item.price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{viewOrder.summary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{viewOrder.summary.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{viewOrder.summary.tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{viewOrder.summary.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              {viewOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Notes</h3>
                    <p>{viewOrder.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button variant="outline" onClick={() => {
              setIsViewDialogOpen(false);
              handleUpdateStatus(viewOrder);
            }}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order {updatingOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {updatingOrder && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newStatus}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
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
              
              {/* Tracking Info - Only show for shipped/delivered */}
              {(newStatus === "shipped" || newStatus === "delivered") && (
                <div className="space-y-4 border p-4 rounded-md">
                  <h4 className="font-medium">Tracking Information</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carrier">Carrier</Label>
                    <Select 
                      value={trackingInfo.carrier}
                      onValueChange={(value) => setTrackingInfo({...trackingInfo, carrier: value})}
                    >
                      <SelectTrigger id="carrier">
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FedEx">FedEx</SelectItem>
                        <SelectItem value="DHL">DHL</SelectItem>
                        <SelectItem value="Blue Dart">Blue Dart</SelectItem>
                        <SelectItem value="DTDC">DTDC</SelectItem>
                        <SelectItem value="Delhivery">Delhivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trackingNumber">Tracking Number</Label>
                    <Input
                      id="trackingNumber"
                      value={trackingInfo.trackingNumber}
                      onChange={(e) => setTrackingInfo({...trackingInfo, trackingNumber: e.target.value})}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trackingUrl">Tracking URL (optional)</Label>
                    <Input
                      id="trackingUrl"
                      value={trackingInfo.trackingUrl}
                      onChange={(e) => setTrackingInfo({...trackingInfo, trackingUrl: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="notes">Status Notes (optional)</Label>
                <Textarea 
                  id="notes"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add any notes about this status change..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveStatusUpdate} className="flex items-center gap-2">
              {newStatus === "shipped" ? (
                <Truck className="h-4 w-4" />
              ) : newStatus === "delivered" ? (
                <CheckCircle className="h-4 w-4" />
              ) : newStatus === "cancelled" ? (
                <XCircle className="h-4 w-4" />
              ) : null}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
