"use client"

import { useEffect } from "react"
import { useVendor } from "@/hooks/use-vendor"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Package, BarChart3, Home, User } from "lucide-react"

export default function VendorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isVendor, loading } = useVendor()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // TEMPORARY BYPASS: Redirect is disabled to allow direct access for development.
    // TODO: Re-enable this guard before production.
    /*
    if (!loading && !isVendor) {
      router.push("/vendor/register")
    }
    */
  }, [isVendor, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-t-green-500 border-l-green-600 border-r-green-600 border-b-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  // Also bypassing this check to prevent a blank screen during development.
  /*
  if (!isVendor) return null
  */

  const isActive = (path: string) => pathname?.startsWith(path)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-gray-200 p-4 hidden md:block">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Vendor Dashboard</h2>
        </div>
        <nav className="space-y-1">
          <Link
            href="/vendor/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/vendor/dashboard") && pathname === "/vendor/dashboard" ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <Home className="h-5 w-5" /> Dashboard
          </Link>
          <Link
            href="/vendor/dashboard/profile"
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/vendor/dashboard/profile") ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <User className="h-5 w-5" /> Profile
          </Link>
          <Link
            href="/vendor/dashboard/products"
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/vendor/dashboard/products") ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <ShoppingBag className="h-5 w-5" /> My Products
          </Link>
          <Link
            href="/vendor/dashboard/orders"
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/vendor/dashboard/orders") ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <Package className="h-5 w-5" /> Orders
          </Link>
          <Link
            href="/vendor/dashboard/analytics"
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${isActive("/vendor/dashboard/analytics") ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            <BarChart3 className="h-5 w-5" /> Analytics
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  )
} 