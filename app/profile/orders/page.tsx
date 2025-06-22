"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Package, Search, Filter, ChevronRight, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function OrdersPage() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  
  // Mock order history - in a real app, you would fetch this from your backend
  const allOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 89.97,
      items: [
        { id: 1, name: "Maltina Can (24-pack)", quantity: 1, price: 24.99 },
        { id: 2, name: "Jollof Rice Mix", quantity: 2, price: 7.99 },
        { id: 3, name: "Palm Oil (1L)", quantity: 1, price: 14.99 },
      ],
      shipping: {
        method: "Standard Delivery",
        address: "123 Main St, London, SW1A 1AA",
        cost: 4.99
      },
      payment: {
        method: "Credit Card",
        last4: "4242"
      }
    },
    {
      id: "ORD-2023-089",
      date: "2023-12-28",
      status: "Processing",
      total: 45.50,
      items: [
        { id: 4, name: "Garri (2kg)", quantity: 1, price: 12.50 },
        { id: 5, name: "Chin Chin (500g)", quantity: 2, price: 8.99 },
      ],
      shipping: {
        method: "Express Delivery",
        address: "123 Main St, London, SW1A 1AA",
        cost: 7.99
      },
      payment: {
        method: "PayPal",
        last4: ""
      }
    },
    {
      id: "ORD-2023-075",
      date: "2023-12-10",
      status: "Shipped",
      total: 123.45,
      items: [
        { id: 6, name: "Egusi Seeds (500g)", quantity: 1, price: 9.99 },
        { id: 7, name: "Plantain Chips (200g)", quantity: 3, price: 4.99 },
        { id: 8, name: "Fanta Orange (24-pack)", quantity: 1, price: 22.99 },
        { id: 9, name: "Suya Spice Mix", quantity: 2, price: 6.99 },
      ],
      shipping: {
        method: "Standard Delivery",
        address: "123 Main St, London, SW1A 1AA",
        cost: 4.99
      },
      payment: {
        method: "Credit Card",
        last4: "1234"
      }
    },
    {
      id: "ORD-2023-042",
      date: "2023-11-05",
      status: "Delivered",
      total: 67.25,
      items: [
        { id: 10, name: "Indomie Noodles (40-pack)", quantity: 1, price: 24.99 },
        { id: 11, name: "Peak Milk Powder (900g)", quantity: 2, price: 14.99 },
      ],
      shipping: {
        method: "Standard Delivery",
        address: "123 Main St, London, SW1A 1AA",
        cost: 4.99
      },
      payment: {
        method: "Credit Card",
        last4: "4242"
      }
    },
  ]

  // Filter orders based on search query and status filter
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Please log in</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view your orders.</p>
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile">My Account</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Orders</h1>
              <p className="text-gray-600">View and track your order history</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search orders..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="h-4 w-4 text-gray-500" />
                <Label htmlFor="status-filter" className="whitespace-nowrap">Filter by status:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-filter" className="w-full md:w-40">
                    <SelectValue placeholder="All orders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All orders</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden hover:border-green-200 transition-colors">
                <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <p className="text-sm text-gray-500">Placed on {order.date}</p>
                      </div>
                      <Badge className={`${getStatusColor(order.status)} ml-0 sm:ml-2`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/profile/orders/${order.id}`}>
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-600">{item.quantity} ×</div>
                          <div className="text-sm">{item.name}</div>
                        </div>
                        <div className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-sm text-gray-500">
                        + {order.items.length - 2} more items
                      </div>
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col sm:flex-row justify-between text-sm">
                    <div>
                      <span className="text-gray-600">Payment: </span>
                      {order.payment.method}
                      {order.payment.last4 && ` (ending in ${order.payment.last4})`}
                    </div>
                    <div>
                      <span className="text-gray-600">Shipping: </span>
                      {order.shipping.method}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 