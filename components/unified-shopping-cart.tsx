"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart,
  Calendar,
  Clock,
  MapPin,
  User,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Package,
  Wrench,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { Service, ServiceProvider, Product, ServiceBooking } from "@/types"

// Extended cart item to handle both products and services
export type CartItem = {
  id: string
  type: "product" | "service"
  // Product fields
  productId?: string
  name: string
  price: number
  quantity: number
  image: string
  // Service specific fields
  serviceId?: string
  providerId?: string
  providerName?: string
  scheduledDate?: string
  scheduledTime?: string
  duration?: number
  pricingType?: "fixed" | "custom" | "hourly"
  // Common fields
  subtotal: number
}

// Mock cart data with mixed products and services
const initialCartItems: CartItem[] = [
  {
    id: "cart_001",
    type: "product",
    productId: "prod_001",
    name: "Premium Organic Rice (5kg)",
    price: 8500,
    quantity: 2,
    image: "/api/placeholder/80/80",
    subtotal: 17000
  },
  {
    id: "cart_002", 
    type: "service",
    serviceId: "srv_001",
    providerId: "sp_001",
    name: "Professional Home Plumbing",
    providerName: "Lagos Professional Plumbers",
    price: 15000,
    quantity: 1,
    image: "/api/placeholder/80/80",
    scheduledDate: "2024-01-20",
    scheduledTime: "14:00",
    duration: 120,
    pricingType: "fixed",
    subtotal: 15000
  },
  {
    id: "cart_003",
    type: "product", 
    productId: "prod_002",
    name: "Fresh Tomatoes (1kg)",
    price: 1200,
    quantity: 3,
    image: "/api/placeholder/80/80",
    subtotal: 3600
  }
]

export default function UnifiedShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Calculate totals
  const productTotal = cartItems
    .filter(item => item.type === "product")
    .reduce((sum, item) => sum + item.subtotal, 0)
  
  const serviceTotal = cartItems
    .filter(item => item.type === "service") 
    .reduce((sum, item) => sum + item.subtotal, 0)
  
  const grandTotal = productTotal + serviceTotal
  const deliveryFee = productTotal > 0 ? 2500 : 0 // Only charge delivery for products
  const totalAmount = grandTotal + deliveryFee

  // Update quantity for products only
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(items =>
      items.map(item =>
        item.id === itemId && item.type === "product"
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      )
    )
  }

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  // Reschedule service
  const rescheduleService = (itemId: string, newDate: string, newTime: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId && item.type === "service"
          ? { ...item, scheduledDate: newDate, scheduledTime: newTime }
          : item
      )
    )
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    try {
      // Separate products and services for different processing
      const products = cartItems.filter(item => item.type === "product")
      const services = cartItems.filter(item => item.type === "service")
      
      // Handle product checkout (existing flow)
      if (products.length > 0) {
        console.log("Processing product order:", products)
      }
      
      // Handle service bookings
      if (services.length > 0) {
        console.log("Processing service bookings:", services)
      }
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert("Checkout successful! Orders and bookings have been processed.")
      setCartItems([])
      
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Checkout failed. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  const ProductCartItem = ({ item }: { item: CartItem }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            <p className="text-sm text-gray-600">₦{item.price.toLocaleString()} each</p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
              className="w-16 text-center"
              min={1}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-semibold">₦{item.subtotal.toLocaleString()}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const ServiceCartItem = ({ item }: { item: CartItem }) => (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Wrench className="h-6 w-6 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">SERVICE</span>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {item.providerName}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {item.scheduledDate && new Date(item.scheduledDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {item.scheduledTime} ({item.duration} min)
              </div>
            </div>
            
            <div className="mt-2">
              <Button variant="outline" size="sm" className="text-xs">
                Reschedule
              </Button>
            </div>
          </div>

          <div className="text-right">
            <div className="font-semibold">₦{item.subtotal.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mb-2">
              {item.pricingType === "fixed" ? "Fixed Price" : "Custom Quote"}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some products or book services to get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/shop">Browse Products</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/services/marketplace">Find Services</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Products Section */}
            {cartItems.some(item => item.type === "product") && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Products</h2>
                  <span className="text-sm text-gray-500">
                    ({cartItems.filter(item => item.type === "product").length} items)
                  </span>
                </div>
                
                {cartItems
                  .filter(item => item.type === "product")
                  .map(item => (
                    <ProductCartItem key={item.id} item={item} />
                  ))
                }
              </div>
            )}

            {/* Services Section */}
            {cartItems.some(item => item.type === "service") && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Service Bookings</h2>
                  <span className="text-sm text-gray-500">
                    ({cartItems.filter(item => item.type === "service").length} services)
                  </span>
                </div>
                
                {cartItems
                  .filter(item => item.type === "service")
                  .map(item => (
                    <ServiceCartItem key={item.id} item={item} />
                  ))
                }

                <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-yellow-800">
                      <p className="font-medium">Service Booking Notice</p>
                      <p className="text-sm">
                        Services requiring approval will be confirmed separately. 
                        Payment for services will be processed after confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  {productTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Products ({cartItems.filter(item => item.type === "product").length})</span>
                      <span>₦{productTotal.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {serviceTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Services ({cartItems.filter(item => item.type === "service").length})</span>
                      <span>₦{serviceTotal.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₦{deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>

                {/* Service Booking Notes */}
                {serviceTotal > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Service bookings will be processed separately and confirmed via email.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}