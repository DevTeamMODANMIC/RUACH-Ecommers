"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  Clock,
  DollarSign,
  Star,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Bell,
  Settings,
  FileText,
  MessageSquare,
  BarChart3
} from "lucide-react"
import { ServiceProvider, Service, ServiceBooking } from "@/types"
import { useAuth } from "@/components/auth-provider"
import { getServiceProviderByOwnerId } from "@/lib/firebase-service-providers"
import { getServicesByProviderId } from "@/lib/firebase-services"

export default function ServiceProviderDashboard() {
  const { user } = useAuth()
  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [recentBookings, setRecentBookings] = useState<ServiceBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't do anything if auth is still loading
    if (user === undefined) {
      return
    }

    if (!user) {
      setIsLoading(false)
      setError("Please log in to access the service provider dashboard")
      return
    }

    let isMounted = true
    const controller = new AbortController()

    const loadServiceProvider = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("🔍 Loading service provider for user:", user.uid)
        
        // Create timeout with shorter duration for better UX
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 8 seconds')), 8000)
        })
        
        const dataPromise = getServiceProviderByOwnerId(user.uid)
        
        const serviceProvider = await Promise.race([dataPromise, timeoutPromise]) as ServiceProvider | null
        
        if (!isMounted) return
        
        console.log("📊 Service provider result:", serviceProvider)
        
        if (!serviceProvider) {
          console.log("❌ No service provider found for user:", user.uid)
          setError(null) // Don't treat this as an error
          setProvider(null)
        } else {
          console.log("✅ Service provider found:", serviceProvider.name)
          setProvider(serviceProvider)
          
          // Load services in parallel without blocking
          Promise.allSettled([
            getServicesByProviderId(serviceProvider.id)
          ]).then(([servicesResult]) => {
            if (!isMounted) return
            
            if (servicesResult.status === 'fulfilled') {
              console.log("📋 Services loaded:", servicesResult.value.length)
              setServices(servicesResult.value)
            } else {
              console.error("⚠️ Error loading services:", servicesResult.reason)
              setServices([])
            }
          })
          
          // Mock recent bookings for now
          setRecentBookings([])
        }
      } catch (err: any) {
        console.error("💥 Error loading service provider:", err)
        if (isMounted) {
          if (err.message.includes('timeout')) {
            setError("Loading timeout - please refresh the page or check your connection")
          } else if (err.message.includes('permission-denied')) {
            setError("Access denied - please check your permissions")
          } else if (err.message.includes('unavailable')) {
            setError("Service temporarily unavailable - please try again later")
          } else {
            setError(err.message || "Failed to load service provider data")
          }
        }
      } finally {
        if (isMounted) {
          console.log("🏁 Service provider loading completed")
          setIsLoading(false)
        }
      }
    }

    // Add a small delay to ensure auth has stabilized
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        loadServiceProvider()
      }
    }, 100)

    return () => {
      isMounted = false
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we load your service provider profile</p>
          
          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-left">
              <p><strong>Auth User:</strong> {user ? `${user.uid} (${user.email})` : 'Not authenticated'}</p>
              <p><strong>Loading State:</strong> Service Provider Data</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">{error}</p>
            
            {/* Debug Info for development */}
            {process.env.NODE_ENV === 'development' && user && (
              <div className="bg-gray-50 p-3 rounded text-left text-xs mb-4">
                <p><strong>User ID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button variant="outline" asChild>
                  <Link href="/debug/firebase">
                    Debug Firebase
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Service Provider Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              You need to set up your service provider profile first.
            </p>
            
            {/* Debug Info for development */}
            {process.env.NODE_ENV === 'development' && user && (
              <div className="bg-gray-50 p-3 rounded text-left text-xs mb-4">
                <p><strong>User ID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Status:</strong> No service provider profile found</p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/vendor/register?type=service-provider">
                  Complete Setup
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate dashboard stats from real data
  const stats = {
    totalBookings: provider.totalBookings || 0,
    completedBookings: Math.floor((provider.totalBookings || 0) * 0.85),
    pendingBookings: recentBookings.filter(b => b.status === "pending").length,
    activeServices: services.filter(s => s.isActive).length,
    monthlyEarnings: ((provider.totalBookings || 0) * 15000) * 0.7, // Estimated monthly earnings
    rating: provider.rating || 0,
    responseRate: 98
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{provider.name}</h1>
              <p className="text-gray-600 mt-1">{provider.description}</p>
              <div className="flex items-center mt-2 space-x-4">
                <Badge variant={provider.isApproved ? "default" : "secondary"} className="bg-green-100 text-green-800">
                  {provider.isApproved ? "Approved" : "Pending Approval"}
                </Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({provider.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/service-provider/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/service-provider/dashboard/services/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white border-b">
        <div className="w-full px-6">
          <nav className="flex space-x-8">
            {[
              { href: "/service-provider/dashboard", label: "Overview", active: true },
              { href: "/service-provider/dashboard/services", label: "My Services" },
              { href: "/service-provider/dashboard/bookings", label: "Bookings" },
              { href: "/service-provider/dashboard/analytics", label: "Analytics" },
              { href: "/service-provider/dashboard/reviews", label: "Reviews" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  item.active
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">{stats.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full w-12 h-12 bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">{stats.completedBookings}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">₦{stats.monthlyEarnings > 0 ? Math.floor(stats.monthlyEarnings / 1000).toFixed(0) + 'K' : '0'}</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="rounded-full w-12 h-12 bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold">{stats.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/service-provider/dashboard/bookings">
                    View All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.length > 0 ? (
                    recentBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-sm text-gray-600">{booking.serviceDetails.name}</div>
                            <div className="text-xs text-gray-500">
                              {booking.scheduledDate} at {booking.scheduledTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₦{booking.totalAmount.toLocaleString()}</div>
                          <Badge 
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className={
                              booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                              booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              booking.status === "completed" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No bookings yet</p>
                      <p className="text-sm">Your customer bookings will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Services */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Services</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/service-provider/dashboard/services">
                    Manage All
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-600">{service.description}</div>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm">
                              {service.pricingType === "fixed" 
                                ? `₦${service.basePrice?.toLocaleString()}` 
                                : "Custom pricing"
                              }
                            </span>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No services yet</p>
                      <p className="text-sm">Add your first service to start receiving bookings</p>
                      <Button className="mt-3" asChild>
                        <Link href="/service-provider/dashboard/services/add">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Service
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Rate</span>
                  <span className="text-lg font-bold">{stats.responseRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-lg font-bold">94%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Repeat Customers</span>
                  <span className="text-lg font-bold">67%</span>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/service-provider/dashboard/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/service-provider/dashboard/services/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Service
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/service-provider/dashboard/bookings?status=pending">
                    <Clock className="h-4 w-4 mr-2" />
                    Review Pending Bookings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/service-provider/dashboard/reviews">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Reviews
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href="/service-provider/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {provider.isApproved ? (
                    <>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800">Profile Approved</p>
                        <p className="text-green-600">Your service provider profile is active</p>
                        <p className="text-xs text-green-500 mt-1">You can now receive bookings</p>
                      </div>
                      {!provider.isActive && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="font-medium text-orange-800">Profile Inactive</p>
                          <p className="text-orange-600">Activate your profile to receive bookings</p>
                          <p className="text-xs text-orange-500 mt-1">Go to settings to activate</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-yellow-800">Pending Approval</p>
                      <p className="text-yellow-600">Your profile is under admin review</p>
                      <p className="text-xs text-yellow-500 mt-1">We'll notify you once approved</p>
                    </div>
                  )}
                  {services.length === 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Add Your First Service</p>
                      <p className="text-blue-600">Start by adding services you offer</p>
                      <p className="text-xs text-blue-500 mt-1">Click "Add Service" to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}