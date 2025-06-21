"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { type Product } from "@/lib/firebase-products"

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export default function ProductGrid({ products = [], loading = false }: ProductGridProps) {
  const [showDebug, setShowDebug] = useState(false)
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-64 bg-gray-200" />
            <CardContent className="pt-6 px-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </CardContent>
            <CardFooter className="flex justify-between px-6 pb-6">
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
  return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
    </div>
  )
}

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDebug(!showDebug)}
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </Button>
        </div>
      )}
      
      {showDebug && (
        <div className="bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-60">
          <h3 className="font-bold mb-2">Product Images:</h3>
          <pre className="text-xs">{JSON.stringify(products.map(p => ({ id: p.id, name: p.name, images: p.images })), null, 2)}</pre>
            </div>
      )}
    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg group">
            <div className="relative">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-64 bg-gray-50">
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      console.error(`Failed to load image: ${product.images?.[0]}`);
                      const imgElement = e.currentTarget as HTMLImageElement;
                      imgElement.src = "/placeholder.jpg";
                      imgElement.onerror = null;
                    }}
                    />
                </div>
              </Link>
              
              {/* Quick action buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white shadow-md">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full bg-white shadow-md">
                  <Eye className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Sale badge */}
              {(product as any).salePrice && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                  SALE
      </div>
              )}
              
              {/* Origin badge */}
              {product.origin && (
                <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full">
                  {product.origin}
            </div>
          )}
        </div>

            <CardContent className="pt-6 px-6">
              <Link href={`/products/${product.id}`} className="block">
                <h3 className="font-medium text-xl truncate group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
              </Link>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center px-6 pb-6">
              <div>
                {(product as any).salePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-600">£{((product as any).salePrice).toFixed(2)}</span>
                    <span className="text-sm text-gray-500 line-through">£{product.price.toFixed(2)}</span>
            </div>
                ) : (
                  <span className="text-xl font-bold">£{product.price.toFixed(2)}</span>
              )}
            </div>
              <Button 
                size="default" 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add</span>
          </Button>
            </CardFooter>
          </Card>
        ))}
        </div>
    </>
  )
}
