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
      images: ["/product_images/beverages/coke-50cl-250x250.jpg"],
      rating: 4.8,
      reviewCount: 245,
      bestseller: true,
      category: "Beverages"
    },
    {
      id: "fanta-50cl",
      name: "Fanta Orange 50cl",
      description: "Vibrant orange-flavored Fanta soft drink in a 50cl bottle. Sweet, fizzy, and refreshing.",
      price: 1.20,
      images: ["/product_images/beverages/Fanta-PET-Bottles-50cl.jpg"],
      rating: 4.6,
      reviewCount: 189,
      new: true,
      category: "Beverages",
      discount: 10
    },
    {
      id: "aani-basmati-rice",
      name: "Aani Basmati Rice",
      description: "Premium Aani Basmati Rice - 10kg. Aromatic long grain rice perfect for special meals.",
      price: 19.99,
      images: ["/product_images/rice/Aani-Basmatic-rice-10kg-4-250x250.jpg"],
      rating: 4.9,
      reviewCount: 31,
      category: "Rice & Grains"
    },
    {
      id: "ayoola-pounded-yam",
      name: "Ayoola Pounded Yam Flour",
      description: "Authentic Ayoola Pounded Yam Flour. Easy to prepare, smooth texture with authentic taste.",
      price: 8.99,
      images: ["/product_images/flour/Ayoola-pounded-yam-250x250.jpg"],
      rating: 4.8,
      reviewCount: 26,
      popular: true,
      category: "Flour"
    },
    {
      id: "cat-fish",
      name: "Cat Fish",
      description: "Fresh Cat Fish. Perfect for traditional Nigerian fish stews and soups.",
      price: 9.99,
      images: ["/product_images/meat/Cat-fish-250x250.jpg"],
      rating: 4.8,
      reviewCount: 17,
      category: "Meat & Fish"
    },
    {
      id: "everyday-seasoning",
      name: "Everyday Seasoning",
      description: "All-purpose Everyday Seasoning blend. Perfect for enhancing the flavor of any dish.",
      price: 4.50,
      images: ["/product_images/spices/Everyday-seasoning-250x250.jpg"],
      rating: 4.8,
      reviewCount: 28,
      bestseller: true,
      category: "Spices & Seasonings"
    },
    {
      id: "cerelac-honey-wheat",
      name: "Cerelac Honey and Wheat",
      description: "Cerelac Honey and Wheat baby food - 1kg. Nutritious baby cereal with honey and wheat.",
      price: 8.99,
      images: ["/product_images/food/Cerelac-Honey-and-wheat-1kg-1-250x250.jpg"],
      rating: 4.8,
      reviewCount: 24,
      category: "Food"
    },
    {
      id: "bitter-leaf",
      name: "Bitter Leaf",
      description: "Fresh Bitter Leaf. Essential ingredient for traditional Nigerian soups and stews.",
      price: 3.50,
      images: ["/product_images/vegetables/Bitter-leaf-250x250.jpg"],
      rating: 4.6,
      reviewCount: 12,
      new: true,
      category: "Vegetables & Fruits"
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="h-60 bg-gray-100" />
                <CardContent className="pt-4">
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="h-5 bg-gray-100 rounded w-1/4" />
                  <div className="h-9 bg-gray-100 rounded w-1/3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white text-gray-800">
      <div className="flex flex-col items-center mb-12">
        <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-green-100">
          <Sparkles className="h-4 w-4 mr-2" />
          <span>Handpicked Selection</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">Featured Products</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6"></div>
        <p className="text-gray-600 text-center max-w-2xl mb-8">
          Discover our curated selection of premium African and international products, from beverages and food to spices and fresh produce.
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
          <h3 className="font-bold mb-2 text-gray-800">Image Paths:</h3>
          <pre className="text-xs text-gray-600">{JSON.stringify(products.map(p => ({ name: p.name, images: p.images })), null, 2)}</pre>
        </div>
      )}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group relative overflow-hidden border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-200 rounded-xl bg-white"
            >
              <div className="absolute right-3 top-3 z-20">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-rose-500 backdrop-blur-sm shadow-sm">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </div>

              <Link href={`/products/${encodeURIComponent(product.id)}`} className="block">
                <div className="relative h-60 bg-white overflow-hidden">
                  {product.category && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                  
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
                <Link href={`/products/${encodeURIComponent(product.id)}`} className="block">
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
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full h-9 px-3"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No featured products found.</p>
        </div>
      )}
      
      <div className="flex justify-center mt-12">
        <Button asChild variant="outline" className="group border-green-600 text-green-700 hover:bg-green-50">
          <Link href="/shop">
            View All Products
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
