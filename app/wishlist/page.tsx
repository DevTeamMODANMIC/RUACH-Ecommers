"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrency } from "@/components/currency-provider"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// Mock wishlist product data - in a real app this would come from an API or context
const mockWishlistProducts = [
  {
    id: 1,
    name: "Premium Jollof Rice Mix",
    price: 8.99,
    originalPrice: 12.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Rice & Grains",
    inStock: true,
  },
  {
    id: 2,
    name: "Red Palm Oil (500ml)",
    price: 15.99,
    originalPrice: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Palm Oil & Oils",
    inStock: false,
  },
  {
    id: 3,
    name: "Dried Stockfish (Large)",
    price: 45.99,
    originalPrice: 52.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Dried Fish",
    inStock: true,
  },
]

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useLocalStorage<typeof mockWishlistProducts>("wishlist-items", mockWishlistProducts)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    // Simulate loading wishlist from server or localStorage
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const removeFromWishlist = (id: number) => {
    setWishlistProducts(wishlistProducts.filter(product => product.id !== id))
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist",
    })
  }

  const addToCart = (product: typeof mockWishlistProducts[0]) => {
    // In a real app, this would add to cart context
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const clearWishlist = () => {
    setWishlistProducts([])
    
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">Items you've saved for later</p>
        </div>
        {wishlistProducts.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearWishlist}
            className="mt-4 md:mt-0"
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <Link href={`/products/${product.id}`} className="block">
                  <h3 className="font-semibold text-lg mb-1 hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-4">{product.category}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12">
          <Alert>
            <Heart className="h-5 w-5 mr-2" />
            <AlertTitle>Your wishlist is empty</AlertTitle>
            <AlertDescription>
              Browse our products and click the heart icon to add items to your wishlist.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link href="/shop">Browse Products</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 