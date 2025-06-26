"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, Plus, ArrowLeft, FileUp, Eye, CloudUpload, AlertTriangle } from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { listenToProducts, deleteProduct, type Product } from "@/lib/firebase-products"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"

export default function AdminProducts() {
  const router = useRouter()
  const { toast } = useToast()
  const { formatPrice } = useCurrency()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Here you would check if the user has admin role
        // For demo purposes, we're just checking if the user is authenticated
        setIsAdmin(true)
        
        // Set up real-time listener for products
        const unsubscribe = listenToProducts((updatedProducts) => {
          setProducts(updatedProducts)
          setLoading(false)
        })
        
        // Return cleanup function
        return () => {
          unsubscribe()
        }
      } else {
        router.push("/login")
      }
    })

    return () => checkAuth()
  }, [router])

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      // Toast notification will show automatically due to real-time listener
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
        variant: "default",
      })
      setSelectedProduct(null)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete the product. Please try again.",
        variant: "destructive",
      })
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
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Button variant="outline" size="sm" className="mb-4" asChild>
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-gray-500 mt-2">View, edit, and delete products</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/admin/products/cloudinary-migration">
                <CloudUpload className="mr-2 h-4 w-4" />
                Cloudinary Migration
              </Link>
            </Button>
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/admin/products/import">
                <FileUp className="mr-2 h-4 w-4" />
                Import Products
              </Link>
            </Button>
            <Button variant="outline" asChild className="shrink-0">
              <Link href="/admin/products/cloudinary-report">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Missing Images
              </Link>
            </Button>
            <Button asChild className="shrink-0">
              <Link href="/admin/products/add">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-14 w-14 rounded-md border overflow-hidden">
                          <Image
                            src={product.images[0] || "/placeholder.jpg"}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // Fallback if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.inStock && product.stockQuantity > 10
                            ? "bg-green-100 text-green-800"
                            : product.inStock && product.stockQuantity > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.inStock 
                            ? product.stockQuantity > 10 
                              ? "In Stock" 
                              : `Low (${product.stockQuantity})`
                            : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link href={`/products/${product.id}`} target="_blank">
                              <span className="sr-only">View</span>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link href={`/admin/products/edit/${product.id}`}>
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                onClick={() => setSelectedProduct(product.id)}
                              >
                                <span className="sr-only">Delete</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this product? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setSelectedProduct(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => selectedProduct && handleDeleteProduct(selectedProduct)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No products found. Click "Add New Product" to create one or "Import Products" to import from scraped data.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
 