"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CloudUpload, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function CloudinaryMigrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationComplete, setMigrationComplete] = useState(false)
  const [migrationResults, setMigrationResults] = useState<any>(null)

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        // Here you would check if the user has admin role
        setIsAdmin(true)
      } else {
        router.push("/login")
      }
    })

    return () => checkAuth()
  }, [router])

  const handleMigrateAll = async () => {
    setIsMigrating(true)

    try {
      const res = await fetch("/api/cloudinary/migrate-all", {
        method: "POST",
      })
      const data = await res.json()
      if (data.success) {
        setMigrationResults(data.results)
        setMigrationComplete(true)
        toast({
          title: "Migration Complete",
          description: `Successfully migrated all product images to Cloudinary`,
        })
      } else {
        throw new Error(data.error || "Migration failed")
      }
    } catch (error) {
      console.error("Error migrating products:", error)
      toast({
        title: "Migration Failed",
        description: "There was an error migrating product images.",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

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
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" size="sm" className="mb-6" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Cloudinary Migration</h1>
          <p className="text-gray-500 mt-2">Migrate your product images to Cloudinary for better performance and management</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Cloudinary Image Migration</h2>
          <p className="mb-4">
            This tool will migrate all your product images to Cloudinary. This process will:
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li>Upload all product images to your Cloudinary account</li>
            <li>Update your product data with Cloudinary image URLs</li>
            <li>Organize images into folders based on product categories</li>
            <li>Apply proper tags for better organization</li>
          </ul>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleMigrateAll}
              disabled={isMigrating || migrationComplete}
              size="lg"
              className="px-8"
            >
              {isMigrating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Migrating Images...
                </>
              ) : migrationComplete ? (
                "Migration Complete!"
              ) : (
                <>
                  <CloudUpload className="mr-2 h-5 w-5" />
                  Start Migration
                </>
              )}
            </Button>
          </div>
          
          {isMigrating && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>This process may take several minutes depending on the number of images.</p>
              <p>Please do not close this page until the migration is complete.</p>
            </div>
          )}
          
          {migrationComplete && migrationResults && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Migration Summary</h3>
              <p className="text-green-700 mb-2">
                Successfully migrated {Object.keys(migrationResults).length} products to Cloudinary.
              </p>
              <p className="text-sm text-green-600">
                Your products now use optimized Cloudinary images for better performance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
