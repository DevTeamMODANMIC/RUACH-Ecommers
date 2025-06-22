"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProductGrid from "@/components/product-grid"
import { Product } from "@/types"
import { Loader2, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/product-data"

// Define available categories
const categories = [
  { id: "all", name: "All Products" },
  { id: "beverages", name: "Beverages" },
  { id: "food", name: "Food" },
  { id: "flour", name: "Flour" },
  { id: "rice", name: "Rice" },
  { id: "vegetables", name: "Vegetables" },
  { id: "spices", name: "Spices" },
  { id: "meat", name: "Meat" }
];

// Define price ranges
const priceRanges = [
  { id: "all", name: "All Prices" },
  { id: "under10", name: "Under £10", min: 0, max: 10 },
  { id: "10to20", name: "£10 - £20", min: 10, max: 20 },
  { id: "20to30", name: "£20 - £30", min: 20, max: 30 },
  { id: "over30", name: "Over £30", min: 30, max: Infinity }
];

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get category from URL or default to "all"
  const categoryParam = searchParams.get("category") || "all"
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  
  // Filter products based on selected filters
  useEffect(() => {
    setIsLoading(true)
    
    // Apply filters
    let result = [...products]
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category === selectedCategory)
    }
    
    // Filter by price range
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find(range => range.id === selectedPriceRange)
      if (range && range.min !== undefined && range.max !== undefined) {
        result = result.filter(product => {
          // Apply discount if available
          const finalPrice = product.discount && product.discount > 0
            ? product.price * (1 - product.discount / 100)
            : product.price
          return finalPrice >= range.min && finalPrice < range.max
        })
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    }
    
    setFilteredProducts(result)
    setIsLoading(false)
  }, [selectedCategory, selectedPriceRange, searchTerm])
  
  // Update URL when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (selectedCategory === "all") {
      params.delete("category")
    } else {
      params.set("category", selectedCategory)
    }
    
    router.replace(`/shop?${params.toString()}`)
  }, [selectedCategory, router, searchParams])
  
  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }
  
  // Handle price range change
  const handlePriceRangeChange = (rangeId: string) => {
    setSelectedPriceRange(rangeId)
  }
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }
  
  return (
    <div className="min-h-screen py-8 pt-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
            <p className="text-gray-600 mt-1">Browse our wide selection of products</p>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="flex w-full md:w-80">
              <Input
                type="search"
                placeholder="Search products..."
                className="rounded-r-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" className="rounded-l-none bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </form>
          </div>
        </div>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          
          {/* Sidebar filters */}
          <div className={`lg:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Categories</h2>
              <ul className="space-y-2 mb-6">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left py-1 px-2 rounded ${
                        selectedCategory === category.id
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              
              <h2 className="font-bold text-gray-900 mb-4">Price Range</h2>
              <ul className="space-y-2">
                {priceRanges.map((range) => (
                  <li key={range.id}>
                    <button
                      onClick={() => handlePriceRangeChange(range.id)}
                      className={`w-full text-left py-1 px-2 rounded ${
                        selectedPriceRange === range.id
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {range.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
