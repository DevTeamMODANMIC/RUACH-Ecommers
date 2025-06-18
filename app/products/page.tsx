"use client"

import { useState } from "react"
import { Filter } from "@/components/filter"
import { CountryAwareProductGrid } from "@/components/country-aware-product-grid"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [sortBy, setSortBy] = useState<"price" | "name" | null>(null)

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  const handleSortByChange = (sort: "price" | "name" | null) => {
    setSortBy(sort)
  }

  // Convert our state to what CountryAwareProductGrid expects
  const getSortValue = () => {
    if (!sortBy) return "popularity"
    return sortBy === "price" ? "price" : "name"
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <Filter
            categories={["Category A", "Category B", "Category C"]}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onSortByChange={handleSortByChange}
          />
        </div>
        <div className="w-full md:w-3/4">
          <CountryAwareProductGrid
            category={selectedCategory || "all"}
            priceRange={priceRange}
            sortBy={getSortValue()}
            showCountryFilter={true}
          />
        </div>
      </div>
    </div>
  )
}
