"use client"

import { VendorDashboardStats } from "@/components/vendor-dashboard-stats"
import { useVendor } from "@/hooks/use-vendor"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VendorDashboardPage() {
  const { vendor } = useVendor()

  if (!vendor) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome, {vendor.displayName || vendor.email}
        </h1>
        <div className="flex space-x-2">
          <Link href="/vendor/dashboard/products/new">
            <Button>Add Product</Button>
          </Link>
          <Link href="/vendor/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>

      <VendorDashboardStats vendorId={vendor.uid} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
          {/* Add recent products list */}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {/* Add recent orders list */}
        </div>
      </div>
    </div>
  )
} 