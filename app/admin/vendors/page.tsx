"use client"

import { useEffect, useState, useCallback } from "react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { approveVendor, rejectVendor } from "@/lib/firebase-vendors"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X, RefreshCw } from "lucide-react"
import Image from "next/image"

interface VendorApp {
  uid: string
  shopName: string
  bio: string
  logoUrl: string
}

export default function AdminVendorsPage() {
  const [loading, setLoading] = useState(true)
  const [pendingVendors, setPendingVendors] = useState<VendorApp[]>([])
  const [actionUid, setActionUid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const q = query(
        collection(db, "vendors"),
        where("approved", "==", false),
        orderBy("createdAt", "desc")
      )
      const querySnapshot = await getDocs(q)
      const fetchedVendors = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      } as VendorApp))
      setPendingVendors(fetchedVendors)
      console.log("Fetched pending vendors:", fetchedVendors)
    } catch (err: any) {
      console.error("Firebase Error:", err)
      setError("Failed to fetch vendors. Check Firestore security rules and console for details.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVendors()
  }, [fetchVendors])

  const handleAction = async (uid: string, action: 'approve' | 'reject') => {
    setActionUid(uid)
    try {
      if (action === 'approve') {
        await approveVendor(uid)
      } else {
        await rejectVendor(uid)
      }
      // Refresh the list after action
      setPendingVendors(prev => prev.filter(v => v.uid !== uid))
    } catch (err: any) {
      console.error(`Failed to ${action} vendor:`, err)
      setError(`Could not ${action} the vendor. Please try again.`)
    } finally {
      setActionUid(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Vendor Applications</h1>
        <Button variant="outline" size="sm" onClick={fetchVendors} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && pendingVendors.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800">No Pending Applications</h3>
          <p className="text-sm text-gray-500 mt-1">
            When a new user registers as a vendor, their application will appear here for approval.
          </p>
        </div>
      )}

      {!loading && !error && pendingVendors.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Shop Name</th>
                <th className="p-3 text-left">Bio</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingVendors.map((v) => (
                <tr key={v.uid}>
                  <td className="p-3 flex items-center gap-3">
                    <Image src={v.logoUrl} alt={v.shopName} width={40} height={40} className="rounded-full bg-gray-200" />
                    <span className="font-medium">{v.shopName}</span>
                  </td>
                  <td className="p-3 max-w-sm truncate">{v.bio}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-100 hover:text-red-700"
                        onClick={() => handleAction(v.uid, 'reject')}
                        disabled={actionUid === v.uid}
                      >
                        {actionUid === v.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction(v.uid, 'approve')}
                        disabled={actionUid === v.uid}
                      >
                        {actionUid === v.uid ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                        Approve
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 