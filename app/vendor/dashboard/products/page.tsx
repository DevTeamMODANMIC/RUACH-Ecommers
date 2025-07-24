"use client"

import { useVendor } from "@/hooks/use-vendor"
import { useEffect, useState } from "react"
import { getVendorProducts } from "@/lib/firebase-vendors"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

interface ProductItem {
  id: string
  name: string
  price: number
  inStock: boolean
}

export default function VendorProductsPage() {
  const { vendor } = useVendor()
  const [products, setProducts] = useState<ProductItem[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!vendor) return
      const list = await getVendorProducts(vendor.uid)
      setProducts(list as unknown as ProductItem[])
    }
    fetchProducts()
  }, [vendor])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <Link href="/vendor/dashboard/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  <Link href={`/vendor/dashboard/products/${p.id}`} className="text-green-600 underline">
                    {p.name}
                  </Link>
                </td>
                <td className="p-2">£{p.price.toFixed(2)}</td>
                <td className="p-2">{p.inStock ? "In Stock" : "Out of Stock"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 