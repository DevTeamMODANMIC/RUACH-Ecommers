"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileUp, FileText, Check, AlertTriangle } from "lucide-react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { importScrapedProducts, ensureProductImages } from "@/lib/utils"
import { useCurrency } from "@/hooks/use-currency"

export default function ImportProducts() {
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
    products: Array<{name: string, status: string}>;
  } | null>(null)
  const [imagesReady, setImagesReady] = useState(false)

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        // Here you would check if the user has admin role
        // For demo purposes, we're just checking if the user is authenticated
        setIsAdmin(true)
        
        // Check if product images are ready
        ensureProductImages()
          .then(result => {
            setImagesReady(result.success)
            console.log("Product images status:", result.message)
          })
          .catch(error => {
            console.error("Error checking product images:", error)
          })
      } else {
        router.push("/login")
      }
    })

    return () => checkAuth()
  }, [router])

  const handleImport = async () => {
    try {
      setImporting(true)
      const results = await importScrapedProducts('/products.json', '/public/product_images')
      setImportResults(results)
    } catch (error) {
      console.error("Error importing products:", error)
      alert("Failed to import products. Please check the console for details.")
    } finally {
      setImporting(false)
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
          <h1 className="text-3xl font-bold">Import Products</h1>
          <p className="text-gray-500 mt-2">Import products from scraped data</p>
        </div>

        {!imagesReady && (
          <Card className="mb-4 border-l-4 border-l-yellow-500">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Product Images Not Ready</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Product images may not be available. This could affect the appearance of products on the site.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              <span>Import from Scraped Data</span>
            </CardTitle>
            <CardDescription>
              Import products from the scraped Ayotayo data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              This will import all products from the scraped data file. The images have already been copied to the
              public/product_images directory.
            </p>
            <Button 
              onClick={handleImport} 
              disabled={importing || importResults !== null}
              className="flex items-center gap-2"
            >
              {importing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Import Products</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {importResults && (
          <Card className={`border-l-4 ${importResults.failed > 0 ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {importResults.failed > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Check className="h-5 w-5 text-green-500" />
                )}
                <span>Import Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500">Successful Imports</p>
                    <p className="text-2xl font-bold text-green-600">{importResults.success}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-gray-500">Failed Imports</p>
                    <p className="text-2xl font-bold text-red-600">{importResults.failed}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Product Details</h3>
                  <div className="max-h-60 overflow-y-auto border rounded-md">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 text-left">Product</th>
                          <th className="py-2 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {importResults.products.map((product, index) => (
                          <tr key={index} className={product.status === 'success' ? 'bg-green-50' : 'bg-red-50'}>
                            <td className="py-2 px-4">{product.name}</td>
                            <td className={`py-2 px-4 text-right font-medium ${
                              product.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {product.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild>
                    <Link href="/admin/products">
                      View All Products
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 