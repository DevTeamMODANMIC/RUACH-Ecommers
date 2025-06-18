"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { CountrySelector } from "@/components/country-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { useCountry } from "@/components/country-provider"
import { useCurrency } from "@/components/currency-provider"

// Mock product data - replace with actual API calls
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    brand: "TechSound",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isNew: false,
    isSale: true,
    tags: ["wireless", "premium", "noise-cancelling"],
    description: "High-quality wireless headphones with active noise cancellation",
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    brand: "FitTech",
    rating: 4.3,
    reviews: 89,
    inStock: true,
    isNew: true,
    isSale: false,
    tags: ["fitness", "smart", "waterproof"],
    description: "Advanced fitness tracking with heart rate monitoring",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    category: "Clothing",
    brand: "EcoWear",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    isNew: false,
    isSale: false,
    tags: ["organic", "cotton", "sustainable"],
    description: "Comfortable organic cotton t-shirt in various colors",
  },
  {
    id: "4",
    name: "Professional Camera Lens",
    price: 899.99,
    originalPrice: 1099.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    brand: "PhotoPro",
    rating: 4.8,
    reviews: 67,
    inStock: false,
    isNew: false,
    isSale: true,
    tags: ["photography", "professional", "telephoto"],
    description: "High-performance telephoto lens for professional photography",
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    price: 449.99,
    originalPrice: null,
    image: "/placeholder.svg?height=300&width=300",
    category: "Furniture",
    brand: "ComfortDesk",
    rating: 4.4,
    reviews: 156,
    inStock: true,
    isNew: true,
    isSale: false,
    tags: ["ergonomic", "office", "adjustable"],
    description: "Ergonomic office chair with lumbar support and adjustable height",
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    originalPrice: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
    brand: "HydroLife",
    rating: 4.6,
    reviews: 312,
    inStock: true,
    isNew: false,
    isSale: true,
    tags: ["stainless-steel", "insulated", "eco-friendly"],
    description: "Insulated stainless steel water bottle keeps drinks cold for 24 hours",
  },
]

const categories = ["All", "Electronics", "Clothing", "Furniture", "Home & Garden"]
const brands = ["All", "TechSound", "FitTech", "EcoWear", "PhotoPro", "ComfortDesk", "HydroLife"]
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A-Z" },
]

export default function ShopPage() {
  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)

  const { selectedCountry } = useCountry()
  const { formatPrice } = useCurrency()

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Brand filter
    if (selectedBrand !== "All") {
      filtered = filtered.filter((product) => product.brand === selectedBrand)
    }

    // Price range filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Stock filter
    if (showOnlyInStock) {
      filtered = filtered.filter((product) => product.inStock)
    }

    // Sale filter
    if (showOnlySale) {
      filtered = filtered.filter((product) => product.isSale)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, showOnlyInStock, showOnlySale])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All")
    setSelectedBrand("All")
    setPriceRange([0, 1000])
    setShowOnlyInStock(false)
    setShowOnlySale(false)
    setSortBy("featured")
  }

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "All" ? selectedCategory : null,
    selectedBrand !== "All" ? selectedBrand : null,
    showOnlyInStock,
    showOnlySale,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Shop</h1>
              <p className="text-muted-foreground">Discover amazing products from {selectedCountry.name}</p>
            </div>
            <CountrySelector />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                    {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
                  </CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <ProductFilters onPriceRangeChange={setPriceRange} priceRange={priceRange} />

                {/* Quick Filters */}
                <div className="space-y-3">
                  <label className="text-sm font-medium block">Quick Filters</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showOnlyInStock}
                        onChange={(e) => setShowOnlyInStock(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showOnlySale}
                        onChange={(e) => setShowOnlySale(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">On Sale</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedBrand !== "All" && (
                  <Badge variant="secondary" className="gap-1">
                    Brand: {selectedBrand}
                    <button
                      onClick={() => setSelectedBrand("All")}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {showOnlyInStock && (
                  <Badge variant="secondary" className="gap-1">
                    In Stock
                    <button
                      onClick={() => setShowOnlyInStock(false)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {showOnlySale && (
                  <Badge variant="secondary" className="gap-1">
                    On Sale
                    <button
                      onClick={() => setShowOnlySale(false)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-48 w-full mb-4" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-6 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} viewMode={viewMode} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
