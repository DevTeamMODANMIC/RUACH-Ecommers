"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { getVendor, Vendor } from "@/lib/firebase-vendors"

export function useVendor() {
  const { user, isLoading: authLoading } = useAuth()
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [vendorLoading, setVendorLoading] = useState(true)

  useEffect(() => {
    if (authLoading) {
      return // Wait for authentication to resolve
    }

    if (!user) {
      setVendor(null)
      setVendorLoading(false)
      return
    }

    let isMounted = true
    getVendor(user.uid)
      .then((vendorData) => {
        if (isMounted) {
          setVendor(vendorData)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch vendor data, this is expected if the user is not a vendor.", error.message)
        if (isMounted) {
          setVendor(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setVendorLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [user, authLoading])

  const loading = authLoading || vendorLoading

  // TEMPORARY BYPASS: Treat any logged-in user as a vendor.
  // Revert to `!!vendor?.approved` for production.
  const isVendor = !!user

  return { vendor, isVendor, loading }
} 