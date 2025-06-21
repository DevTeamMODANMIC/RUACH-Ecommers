"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, ChevronDown } from "lucide-react"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    origin: false,
  })
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    })
}

  const categoryOptions = [
    { id: 'beverages', label: 'Beverages' },
    { id: 'rice', label: 'Rice' },
    { id: 'flour', label: 'Flour' },
    { id: 'spices', label: 'Spices' },
    { id: 'oil', label: 'Oil' },
  ]
  
  const originOptions = [
    { id: 'nigeria', label: 'Nigeria' },
    { id: 'ghana', label: 'Ghana' },
    { id: 'kenya', label: 'Kenya' },
    { id: 'south-africa', label: 'South Africa' },
  ]

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm sticky top-4">
      <div className="flex items-center mb-6">
        <Filter className="h-5 w-5 mr-2 text-green-600" />
        <h2 className="text-xl font-medium">Filter Products</h2>
      </div>
      
      {/* Search */}
      <div className="mb-8">
        <h3 className="text-base font-medium mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 border-gray-300 h-10"
          />
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-8">
        <div 
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => toggleSection('price')}
        >
          <h3 className="text-base font-medium">Price Range</h3>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} 
          />
        </div>
        
        {expandedSections.price && (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">
                £{priceRange[0]} - £{priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 100]}
              max={100}
              step={1}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as number[])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>£0</span>
              <span>£100</span>
            </div>
          </>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div 
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => toggleSection('categories')}
        >
          <h3 className="text-base font-medium">Categories</h3>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} 
          />
        </div>
        
        {expandedSections.categories && (
          <div className="space-y-2">
            {categoryOptions.map(category => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Origin */}
      <div className="mb-8">
        <div 
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => toggleSection('origin')}
        >
          <h3 className="text-base font-medium">Origin</h3>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 transition-transform ${expandedSections.origin ? 'rotate-180' : ''}`} 
            />
          </div>
        
        {expandedSections.origin && (
          <div className="space-y-2">
            {originOptions.map(origin => (
              <div key={origin.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`origin-${origin.id}`}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor={`origin-${origin.id}`} className="ml-2 text-sm text-gray-700">
                  {origin.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base"
        onClick={() => console.log("Applying filters", { priceRange, searchQuery })}
      >
        Apply Filters
      </Button>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <button className="text-green-600 hover:underline">Reset all filters</button>
      </div>
    </div>
  )
}
