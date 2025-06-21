"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Award, TrendingUp, ChevronRight, Heart, Sparkles } from "lucide-react"
import { getProducts, type Product } from "@/lib/firebase-products"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDebug, setShowDebug] = useState(false)
  
  // Hardcoded featured products with images from /a directory
const featuredProducts = [
  {
      id: "coca-cola-50cl",
      name: "Coca-Cola 50cl",
      description: "Refreshing Coca-Cola soft drink in a 50cl bottle. Perfect for quenching your thirst.",
      price: 1.20,
      images: ["/a/coke-50cl-250x250.jpg", "/a/coke 50cl (PAck).png"],
      rating: 4.8,
      reviewCount: 245,
      bestseller: true,
      category: "Soft Drinks"
    },
    {
      id: "fanta-50cl",
      name: "Fanta Orange 50cl",
      description: "Vibrant orange-flavored Fanta soft drink in a 50cl bottle. Sweet, fizzy, and refreshing.",
      price: 1.20,
      images: ["/a/Fanta-PET-Bottles-50cl.jpg", "/a/Fanta-50cl-pack-150x150.png"],
      rating: 4.6,
      reviewCount: 189,
      new: true,
      category: "Soft Drinks",
      discount: 10
    },
    {
      id: "amstel-malta",
      name: "Amstel Malta",
      description: "Non-alcoholic malt drink rich in vitamins and nutrients. A premium African malt beverage.",
      price: 1.50,
      images: ["/a/Amstel-malta-150x150.jpg"],
      rating: 4.7,
      reviewCount: 124,
      category: "Malt Drinks"
    },
    {
      id: "malta-guinness-pack",
      name: "Malta Guinness (Pack of 24)",
      description: "Case of 24 Malta Guinness non-alcoholic malt drinks. Rich, nourishing malt flavor with vitamins and minerals.",
      price: 28.99,
      originalPrice: 33.99,
      images: ["/a/malta guinness can (pack of 24).png", "/a/malt guiness bottle(Pack of 24).png"],
      rating: 4.9,
      reviewCount: 78,
      popular: true,
      category: "Bulk Packs"
    }
  ]
  
  useEffect(() => {
    // Use hardcoded products instead of fetching
    setProducts(featuredProducts as unknown as Product[])
    setLoading(false)
    console.log("Featured products loaded from /a directory")
  }, [])
  
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-60 bg-gray-200" />
                <CardContent className="pt-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                  <div className="h-9 bg-gray-200 rounded w-1/3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Handpicked Selection</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Products</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6"></div>
          <p className="text-gray-600 text-center max-w-2xl mb-8">
            Discover our curated selection of premium African and international beverages, loved by our customers.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDebug(!showDebug)}
              className="ml-4"
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </Button>
          )}
        </div>

        {showDebug && (
          <div className="bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-60 max-w-6xl mx-auto">
            <h3 className="font-bold mb-2">Image Paths:</h3>
            <pre className="text-xs">{JSON.stringify(products.map(p => ({ name: p.name, images: p.images })), null, 2)}</pre>
          </div>
        )}
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="group relative overflow-hidden border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all duration-200 rounded-xl"
              >
                <div className="absolute right-3 top-3 z-20">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 backdrop-blur-sm shadow-sm">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                </div>

                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative h-60 bg-white overflow-hidden">
                    {product.category && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                          {product.category}
                        </Badge>
                      </div>
                    )}
                    
                    {product.discount && (
                      <div className="absolute top-12 left-0 z-10 bg-red-500 text-white text-xs font-bold px-3 py-0.5 rounded-r-lg shadow-md">
                        -{product.discount}% OFF
                      </div>
                    )}

                    {product.originalPrice && (
                      <div className="absolute top-12 left-0 z-10 bg-red-500 text-white text-xs font-bold px-3 py-0.5 rounded-r-lg shadow-md">
                        SAVE £{(product.originalPrice - product.price).toFixed(2)}
                      </div>
                    )}
                    
                    {product.bestseller && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-sm flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Bestseller
                        </Badge>
                      </div>
                    )}
                    
                    {product.new && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-sm">
                          New Arrival
                        </Badge>
                      </div>
                    )}
                    
                    {product.popular && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-sm flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Top Rated
                        </Badge>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                    
                    <Image
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      onError={(e) => {
                        console.error(`Failed to load image: ${product.images?.[0]}`);
                        const imgElement = e.currentTarget as HTMLImageElement;
                        imgElement.src = "/placeholder.jpg";
                        imgElement.onerror = null;
                      }}
                    />
                  </div>
                </Link>
                
                <CardContent className="pt-4">
                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="font-semibold text-lg truncate group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2 h-10">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3.5 w-3.5 ${
                              product.rating && i < Math.floor(product.rating) 
                                ? 'text-amber-400 fill-amber-400' 
                                : product.rating && i < product.rating 
                                  ? 'text-amber-400 fill-amber-400 opacity-50' 
                                  : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between items-center pt-0">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">£{product.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-lg font-bold text-green-700">£{product.price.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 rounded-full flex items-center gap-1 shadow-sm text-white"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 max-w-6xl mx-auto">
            <p>No featured products available yet.</p>
          </div>
        )}
        
        <div className="mt-14 text-center">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-full text-base shadow-md hover:shadow-lg flex items-center mx-auto transition-all"
            asChild
          >
            <Link href="/shop">
              Browse All Products
              <ChevronRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
