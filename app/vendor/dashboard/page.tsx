"use client"

import { useVendor } from "@/hooks/use-vendor"

export default function VendorDashboardHome() {
  const { vendor } = useVendor()
  console.log("Dashboard Page:", { vendor })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to Your Dashboard</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify({ vendor }, null, 2)}
      </pre>
    </div>
  )
} 