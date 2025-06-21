"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import ProductGrid from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { getProducts, type Product } from "@/lib/firebase-products"

const categories = [
  { name: "Drinks", href: "/shop?category=drinks" },
  { name: "Flour", href: "/shop?category=flour" },
  { name: "Rice", href: "/shop?category=rice" },
  { name: "Pap/Custard", href: "/shop?category=pap-custard" },
  { name: "Spices", href: "/shop?category=spices" },
  { name: "Beverages", href: "/shop?category=beverages" },
  { name: "Dried Spices", href: "/shop?category=dried-spices" },
  { name: "Oil", href: "/shop?category=oil" },
  { name: "Provisions", href: "/shop?category=provisions" },
  { name: "Fresh Produce", href: "/shop?category=fresh-produce" },
  { name: "Fresh Vegetables", href: "/shop?category=fresh-vegetables" },
  { name: "Snack/Bread/Cereal", href: "/shop?category=snack-bread-cereal" },
  { name: "Vegetable Oil", href: "/shop?category=vegetable-oil" },
  { name: "Meat/Beef", href: "/shop?category=meat-beef" }
]

// Hardcoded products with images from /a directory
const hardcodedProducts = [
  {
    id: "cola-50cl",
    name: "Coca-Cola 50cl",
    description: "Refreshing Coca-Cola soft drink in a 50cl bottle. Perfect for quenching your thirst.",
    price: 1.20,
    images: ["/a/coke-50cl-250x250.jpg", "/a/coke 50cl (PAck).png"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 120,
    origin: "Nigeria"
  },
  {
    id: "fanta-50cl",
    name: "Fanta Orange 50cl",
    description: "Vibrant orange-flavored Fanta soft drink in a 50cl bottle. Sweet, fizzy, and refreshing.",
    price: 1.20,
    images: ["/a/Fanta-PET-Bottles-50cl.jpg", "/a/Fanta-50cl-pack-150x150.png"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 95,
    origin: "Nigeria"
  },
  {
    id: "amstel-malta",
    name: "Amstel Malta",
    description: "Non-alcoholic malt drink rich in vitamins and nutrients. A premium African malt beverage.",
    price: 1.50,
    images: ["/a/Amstel-malta-150x150.jpg"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 75,
    origin: "Nigeria"
  },
  {
    id: "malta-guinness-pack",
    name: "Malta Guinness (Pack of 24)",
    description: "Case of 24 Malta Guinness non-alcoholic malt drinks. Rich, nourishing malt flavor with vitamins and minerals.",
    price: 28.99,
    images: ["/a/malta guinness can (pack of 24).png", "/a/malt guiness bottle(Pack of 24).png"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 18,
    origin: "Nigeria"
  },
  {
    id: "lacasara-drink",
    name: "Lacasara Drink",
    description: "Traditional Nigerian Lacasara soft drink. Sweet and refreshing citrus flavor.",
    price: 1.35,
    images: ["/a/Lacasara-150x150.jpg", "/a/Lacasara pack.png"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 62,
    origin: "Nigeria"
  },
  {
    id: "teem-soda-pack",
    name: "Teem Soda (Pack)",
    description: "Pack of refreshing Teem lemon-lime soda. A popular Nigerian soft drink with a crisp, citrus taste.",
    price: 15.99,
    images: ["/a/teem (Pack).png"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 25,
    origin: "Nigeria"
  },
  {
    id: "team-drink",
    name: "Team Drink",
    description: "Team soft drink with a unique fruity flavor. Refreshing and sweet.",
    price: 1.25,
    images: ["/a/Team-drink-250x250.jpg"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 48,
    origin: "Nigeria"
  },
  {
    id: "vamino-soy-milk",
    name: "Vamino Soy Milk",
    description: "Nutritious Vamino soy milk. Plant-based, dairy-free alternative rich in protein.",
    price: 2.99,
    images: ["/a/Vamino-soy-milk-1-250x250.jpg"],
    category: "Beverages",
    inStock: true,
    stockQuantity: 35,
    origin: "Nigeria"
  }
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDebug, setShowDebug] = useState(false)
  const searchParams = useSearchParams()
  const category = searchParams.get('category')?.toLowerCase()
  
  useEffect(() => {
    // Simulate loading
    setLoading(true)
    
    // Filter hardcoded products based on category
    setTimeout(() => {
      let filteredProducts = [...hardcodedProducts]
      
      if (category) {
        filteredProducts = hardcodedProducts.filter(
          p => p.category.toLowerCase() === category
        )
      }
      
      setProducts(filteredProducts as Product[])
      setLoading(false)
      console.log("Shop products loaded:", filteredProducts.length)
    }, 500) // Short delay to simulate loading
    
  }, [category])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Navigation Bar */}
      <div className="bg-green-600 text-white overflow-x-auto">
        <div className="container mx-auto flex space-x-6 py-3 whitespace-nowrap px-4">
          {categories.map((category) => (
            <Link 
              key={category.name}
              href={category.href}
              className="hover:text-green-200 transition-colors font-medium text-sm"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Shop Title Banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-8 flex justify-between items-center px-4">
                <div>
            <h1 className="text-3xl font-bold">Shop</h1>
            <p className="text-gray-500 mt-2">Browse our collection of authentic African products</p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                {showDebug ? 'Hide Debug' : 'Show Debug'}
              </button>
                </div>
          )}
              </div>
            </div>

      {/* Debug Info */}
      {showDebug && (
        <div className="container mx-auto mt-4 px-4">
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            <h3 className="font-bold mb-2">Current Filter:</h3>
            <p>Category: {category || 'None'}</p>
            
            <h3 className="font-bold mt-4 mb-2">Product Images:</h3>
            <pre className="text-xs">{JSON.stringify(products.map(p => ({ name: p.name, images: p.images })), null, 2)}</pre>
          </div>
              </div>
            )}

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductFilters />
              </div>
          <div className="lg:col-span-3">
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
