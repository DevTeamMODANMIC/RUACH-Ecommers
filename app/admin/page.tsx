"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, PlusCircle, ShoppingCart, Users } from "lucide-react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Admin check - in a real app, you would check admin role in Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        // Here you would check if the user has admin role
        // For demo purposes, we're just checking if the user is authenticated
        setIsAdmin(true)
      } else {
        router.push("/login")
      }
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Router will redirect
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your products, orders, and users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Products</span>
              </CardTitle>
              <CardDescription>
                Add, edit, or remove products from your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Manage your product catalog, update prices, descriptions and more.</p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button asChild className="w-full">
                <Link href="/admin/products">
                  View All Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/products/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Orders Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Orders</span>
              </CardTitle>
              <CardDescription>
                View and manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Process orders, update shipping status, and handle returns.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/orders">
                  Manage Orders
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">View customer accounts, update information, and manage access.</p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/admin/users">
                  Manage Users
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 