"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { useVendor } from "@/hooks/use-vendor"
import Link from "next/link"
import { getCategoryById } from "@/lib/firebase-categories"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
  stockQuantity: number
}

export default function VendorProductsPage() {
  const { vendor } = useVendor()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{[key:string]: string}>({})

  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendor) return

      // Fetch vendor's products directly from Firestore
      const productsRef = collection(db, "products")
      const q = query(productsRef, where("vendorId", "==", vendor.uid))
      const snapshot = await getDocs(q)
      
      const vendorProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product))

      setProducts(vendorProducts)

      // Fetch categories for these products
      const categoryIds = [...new Set(vendorProducts.map(p => p.category))]
      const categoryMap: {[key:string]: string} = {}

      for (const categoryId of categoryIds) {
        const category = await getCategoryById(categoryId)
        if (category) {
          categoryMap[categoryId] = category.name
        }
      }

      setCategories(categoryMap)
    }

    fetchProducts()
  }, [vendor])

  if (!vendor) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Link href="/vendor/dashboard/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {categories[product.category] || product.category}
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    {product.inStock ? `${product.stockQuantity} in stock` : 'Out of Stock'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/vendor/dashboard/products/${product.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 