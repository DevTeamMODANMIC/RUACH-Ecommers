"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, ArrowLeft, Truck, CreditCard, Calendar, Check, AlertTriangle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { useToast } from "@/hooks/use-toast"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock order data - in a real app, you would fetch this from your backend
const mockOrders = {
  "ORD-2024-001": {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 89.97,
    items: [
      { id: 1, name: "Maltina Can (24-pack)", quantity: 1, price: 24.99, image: "/placeholder.svg" },
      { id: 2, name: "Jollof Rice Mix", quantity: 2, price: 7.99, image: "/placeholder.svg" },
      { id: 3, name: "Palm Oil (1L)", quantity: 1, price: 14.99, image: "/placeholder.svg" },
    ],
    shipping: {
      method: "Standard Delivery",
      address: "123 Main St, London, SW1A 1AA",
      cost: 4.99,
      trackingNumber: "TRK123456789",
      estimatedDelivery: "January 18, 2024",
      deliveredOn: "January 17, 2024"
    },
    payment: {
      method: "Credit Card",
      last4: "4242",
      subtotal: 84.98,
      tax: 0,
      total: 89.97
    },
    timeline: [
      { status: "Order Placed", date: "January 15, 2024", time: "09:15 AM" },
      { status: "Payment Confirmed", date: "January 15, 2024", time: "09:16 AM" },
      { status: "Processing", date: "January 15, 2024", time: "11:30 AM" },
      { status: "Shipped", date: "January 16, 2024", time: "02:45 PM" },
      { status: "Delivered", date: "January 17, 2024", time: "03:20 PM" },
    ]
  },
  "ORD-2023-089": {
    id: "ORD-2023-089",
    date: "2023-12-28",
    status: "Processing",
    total: 45.50,
    items: [
      { id: 4, name: "Garri (2kg)", quantity: 1, price: 12.50, image: "/placeholder.svg" },
      { id: 5, name: "Chin Chin (500g)", quantity: 2, price: 8.99, image: "/placeholder.svg" },
    ],
    shipping: {
      method: "Express Delivery",
      address: "123 Main St, London, SW1A 1AA",
      cost: 7.99,
      trackingNumber: "TRK987654321",
      estimatedDelivery: "December 30, 2023"
    },
    payment: {
      method: "PayPal",
      subtotal: 37.51,
      tax: 0,
      total: 45.50
    },
    timeline: [
      { status: "Order Placed", date: "December 28, 2023", time: "14:22 PM" },
      { status: "Payment Confirmed", date: "December 28, 2023", time: "14:23 PM" },
      { status: "Processing", date: "December 29, 2023", time: "10:15 AM" },
    ]
  }
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from your API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const orderData = mockOrders[id];
        if (orderData) {
          setOrder(orderData);
        } else {
          toast({
            title: "Order not found",
            description: "The order you're looking for doesn't exist.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load order details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, toast]);

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
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <Check className="h-4 w-4 text-green-600" />;
      case "processing":
        return <Package className="h-4 w-4 text-yellow-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Please log in</h1>
            <p className="text-gray-600 mb-8">You need to be logged in to view order details.</p>
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild>
              <Link href="/profile/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
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
              <BreadcrumbLink href="/profile/orders">My Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{order.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Order {order.id}</h1>
              <p className="text-gray-600">Placed on {order.date}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-sm py-1 px-3`}>
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-600" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="bg-gray-100 rounded-md w-16 h-16 flex items-center justify-center overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gray-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-1">Delivery Address</h3>
                    <p className="text-gray-600">{order.shipping.address}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Shipping Method</h3>
                    <p className="text-gray-600">{order.shipping.method}</p>
                  </div>
                  {order.shipping.trackingNumber && (
                    <div>
                      <h3 className="font-medium mb-1">Tracking Number</h3>
                      <p className="text-gray-600">{order.shipping.trackingNumber}</p>
                    </div>
                  )}
                  {order.shipping.estimatedDelivery && (
                    <div>
                      <h3 className="font-medium mb-1">
                        {order.status === "Delivered" ? "Delivered On" : "Estimated Delivery"}
                      </h3>
                      <p className="text-gray-600">
                        {order.status === "Delivered" && order.shipping.deliveredOn
                          ? order.shipping.deliveredOn
                          : order.shipping.estimatedDelivery}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative border-l border-gray-200 ml-3">
                  {order.timeline.map((event: any, index: number) => (
                    <li key={index} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white">
                        {getStatusIcon(event.status)}
                      </span>
                      <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                        {event.status}
                      </h3>
                      <time className="block mb-2 text-sm font-normal leading-none text-gray-500">
                        {event.date} at {event.time}
                      </time>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(order.payment.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(order.shipping.cost)}</span>
                  </div>
                  {order.payment.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>{formatCurrency(order.payment.tax)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.payment.total)}</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment Method:</span>{" "}
                      {order.payment.method}
                      {order.payment.last4 && ` (ending in ${order.payment.last4})`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button asChild className="w-full">
                <a href={`mailto:support@borderlessbuy.com?subject=Help with Order ${order.id}`}>
                  Need Help With This Order?
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/profile/orders">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Orders
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}