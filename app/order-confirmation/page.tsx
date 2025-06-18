"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, Truck, Calendar, ArrowRight } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const { formatPrice } = useCurrency()
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // In a real app, you'd fetch order details from your API
    if (orderId) {
      // Mock order details
      setOrderDetails({
        id: orderId,
        date: new Date().toISOString(),
        status: "confirmed",
        total: 89.97,
        items: [
          {
            id: 1,
            name: "Premium Jollof Rice Mix",
            quantity: 2,
            price: 8.99,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 4,
            name: "Basmati Rice Premium (5kg)",
            quantity: 1,
            price: 24.99,
            image: "/placeholder.svg?height=100&width=100",
          },
        ],
        shipping: {
          method: "Standard Delivery",
          cost: 4.99,
          estimatedDelivery: "5-7 business days",
          address: {
            name: "John Doe",
            line1: "123 Main Street",
            city: "London",
            postalCode: "SW1A 1AA",
            country: "United Kingdom",
          },
        },
        payment: {
          method: "Credit Card",
          last4: "1234",
        },
      })
    }
  }, [orderId])

  if (!orderId || !orderDetails) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">We couldn't find the order you're looking for.</p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const estimatedDeliveryDate = new Date()
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7)

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order Number:</span>
                    <div className="font-medium">{orderDetails.id}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>
                    <div className="font-medium">
                      {new Date(orderDetails.date).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment Method:</span>
                    <div className="font-medium">
                      {orderDetails.payment.method} ending in {orderDetails.payment.last4}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Amount:</span>
                    <div className="font-medium text-lg">{formatPrice(orderDetails.total)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Ordered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderDetails.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Delivery Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>{orderDetails.shipping.address.name}</div>
                    <div>{orderDetails.shipping.address.line1}</div>
                    <div>
                      {orderDetails.shipping.address.city}, {orderDetails.shipping.address.postalCode}
                    </div>
                    <div>{orderDetails.shipping.address.country}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground">Shipping Method:</span>
                    <div className="font-medium">{orderDetails.shipping.method}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <div className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {estimatedDeliveryDate.toLocaleDateString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Receipt
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile/orders">
                    <Truck className="h-4 w-4 mr-2" />
                    Track Order
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* What's Next */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Order Confirmed</div>
                      <div className="text-muted-foreground">We've received your order</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <div className="font-medium">Processing</div>
                      <div className="text-muted-foreground">We're preparing your items</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <div className="font-medium">Shipped</div>
                      <div className="text-muted-foreground">Your order is on its way</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <div>
                      <div className="font-medium">Delivered</div>
                      <div className="text-muted-foreground">Enjoy your products!</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold">Continue Shopping</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover more authentic products from around the world
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/products">
                      Browse Products
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium">Confirmation Email Sent</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We've sent a confirmation email with your order details to your email address. If you don't see it in
                  your inbox, please check your spam folder.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
