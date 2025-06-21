"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Plus, ChevronRight } from "lucide-react"

export default function BeverageShowcase() {
  const [showDebug, setShowDebug] = useState(false)
  
  const beverages = [
    {
      id: "coca-cola-50cl",
      name: "Coca-Cola",
      subtitle: "50cl Bottle",
      price: 1.20,
      image: "/product_images/coke-50cl-250x250.jpg",
      fallbackImage: "/product_images/beverages/coke-50cl-250x250.jpg",
      slug: "/products/coca-cola-50cl",
      rating: 4.9,
      reviews: 124,
      isBestSeller: true
    },
    {
      id: "fanta-50cl",
      name: "Fanta Orange",
      subtitle: "50cl Bottle",
      price: 1.20,
      image: "/product_images/Fanta-PET-Bottles-50cl.jpg",
      fallbackImage: "/product_images/beverages/Fanta-PET-Bottles-50cl.jpg",
      slug: "/products/fanta-50cl",
      rating: 4.7,
      reviews: 86
    },
    {
      id: "sprite-50cl",
      name: "Sprite",
      subtitle: "50cl Bottle",
      price: 1.20,
      image: "/product_images/Sprite-50cl-1-250x250.jpg",
      fallbackImage: "/product_images/beverages/Sprite-50cl-1-250x250.jpg",
      slug: "/products/sprite-50cl",
      rating: 4.8,
      reviews: 92
    },
    {
      id: "amstel-malta",
      name: "Amstel Malta",
      subtitle: "Non-Alcoholic Malt Drink",
      price: 1.50,
      image: "/product_images/Amstel-malta-150x150.jpg",
      fallbackImage: "/product_images/beverages/Amstel-malta-150x150.jpg",
      slug: "/products/amstel-malta",
      rating: 4.6,
      reviews: 58
    },
    {
      id: "malta-guinness-pack",
      name: "Malta Guinness",
      subtitle: "Pack of 24 Cans",
      price: 28.99,
      image: "/product_images/malta_guinness_can_(pack_of_24).png",
      fallbackImage: "/product_images/beverages/malta_guinness_can_(pack_of_24).png",
      slug: "/products/malta-guinness-pack",
      rating: 4.9,
      reviews: 73,
      isBulk: true
    },
    {
      id: "schweppes-chapman",
      name: "Schweppes Chapman",
      subtitle: "Pack of 24",
      price: 26.99,
      image: "/product_images/swhwappes_chapman_pack_of_24.png",
      fallbackImage: "/product_images/beverages/swhwappes_chapman_pack_of_24.png",
      slug: "/products/schweppes-chapman",
      rating: 4.8,
      reviews: 42,
      isBulk: true,
      isNew: true
    },
    {
      id: "lacasera",
      name: "LaCasera",
      subtitle: "Sparkling Apple Drink",
      price: 1.35,
      image: "/product_images/Lacasara-150x150.jpg",
      fallbackImage: "/product_images/beverages/Lacasara-150x150.jpg", 
      slug: "/products/lacasera",
      rating: 4.7,
      reviews: 36,
      isNew: true
    },
    {
      id: "maltina-can",
      name: "Maltina",
      subtitle: "Premium Malt Drink (Can)",
      price: 1.40,
      image: "/product_images/Maltina-can-150x150.jpg",
      fallbackImage: "/product_images/beverages/Maltina-can-150x150.jpg",
      slug: "/products/maltina-can",
      rating: 4.8,
      reviews: 64
    }
  ]

  // Function to handle image error and try fallback images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, beverage: any) => {
    console.error(`Failed to load image: ${(e.target as HTMLImageElement).src}`);
    const imgElement = e.currentTarget;
    
    if (beverage.fallbackImage && imgElement.src !== beverage.fallbackImage) {
      imgElement.src = beverage.fallbackImage;
    } else if (beverage.fallbackImage && imgElement.src === beverage.fallbackImage) {
      imgElement.src = "/placeholder.jpg";
    } else {
      imgElement.src = "/placeholder.jpg";
    }
    
    imgElement.onerror = null; // Prevent infinite loops
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Popular Beverages</h2>
            <p className="text-gray-600 mt-2">Authentic drinks from around the world</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <Link href="/shop?category=Beverages" className="flex items-center text-green-600 hover:text-green-700 font-medium">
              View All Products
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
            
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
        </div>
        
        {showDebug && (
          <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-bold mb-2">Image Paths:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify(beverages.map(b => ({ name: b.name, image: b.image, fallback: b.fallbackImage })), null, 2)}</pre>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beverages.map((beverage) => (
            <Card key={beverage.id} className="overflow-hidden transition-all hover:shadow-lg border border-gray-200 hover:border-green-200 group">
              <Link href={beverage.slug}>
                <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {(beverage.isBestSeller || beverage.isNew || beverage.isBulk) && (
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {beverage.isBestSeller && (
                        <Badge className="bg-amber-500 hover:bg-amber-600">Best Seller</Badge>
                      )}
                      {beverage.isNew && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                      )}
                      {beverage.isBulk && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">Bulk</Badge>
                      )}
                    </div>
                  )}
                  
                  <Image
                    src={beverage.image}
                    alt={beverage.name}
                    fill
                    className="object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => handleImageError(e, beverage)}
                    priority
                  />
                </div>
                
                <CardContent className="p-4 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                        {beverage.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">{beverage.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium ml-1 text-gray-700">{beverage.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs text-gray-500">{beverage.reviews} reviews</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-green-600 font-bold text-lg">£{beverage.price.toFixed(2)}</p>
                    <Button size="sm" variant="ghost" className="rounded-full hover:bg-green-50 hover:text-green-600">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/shop?category=Beverages">
            <Button className="bg-green-600 hover:bg-green-700 rounded-full px-6">
              View All Beverages
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 