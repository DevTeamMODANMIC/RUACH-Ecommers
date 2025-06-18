"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useCurrency } from "@/components/currency-provider"

const categoryData = {
  nigeria: [
    "Rice & Grains",
    "Spices & Seasonings",
    "Palm Oil & Oils",
    "Yam & Tubers",
    "Beans & Legumes",
    "Dried Fish",
    "Plantain Products",
    "Cassava Products",
  ],
  india: [
    "Spices & Masalas",
    "Basmati Rice",
    "Lentils & Dals",
    "Tea & Beverages",
    "Pickles & Chutneys",
    "Flours & Grains",
    "Sweets & Snacks",
    "Cooking Oils",
  ],
  ghana: [
    "Plantain Products",
    "Cassava & Gari",
    "Palm Nut & Oils",
    "Kenkey & Banku",
    "Dried Fish",
    "Spices & Peppers",
    "Yam Products",
    "Traditional Grains",
  ],
  jamaica: [
    "Scotch Bonnet Peppers",
    "Ackee & Callaloo",
    "Jerk Seasonings",
    "Plantain Products",
    "Caribbean Spices",
    "Tropical Fruits",
    "Rice & Peas",
    "Hot Sauces",
  ],
  uk: [
    "International Mix",
    "Organic Products",
    "Halal Certified",
    "Vegan Options",
    "Gluten Free",
    "Premium Range",
    "Bulk Items",
    "Seasonal Specials",
  ],
}

const brands = {
  nigeria: ["Mama Gold", "Dangote", "Golden Penny", "Honeywell", "Indomie"],
  india: ["Tata", "MDH", "Everest", "Aashirvaad", "India Gate"],
  ghana: ["Nkulenu", "Gino", "Frytol", "Ayoola", "Tilda"],
  jamaica: ["Grace", "Walkerswood", "Pickapeppa", "Busha Browne", "Matouk's"],
  uk: ["Tesco Finest", "Sainsbury's", "ASDA", "Morrisons", "Waitrose"],
}

interface ProductFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
  sortBy: string
  onSortChange: (sort: string) => void
  country: string
}

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  country,
}: ProductFiltersProps) {
  const { formatPrice } = useCurrency()
  const categories = categoryData[country as keyof typeof categoryData] || []
  const countryBrands = brands[country as keyof typeof brands] || []

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="all-categories"
                checked={selectedCategory === "all"}
                onCheckedChange={() => onCategoryChange("all")}
              />
              <Label htmlFor="all-categories" className="text-sm font-medium">
                All Categories
              </Label>
            </div>
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategory === category}
                  onCheckedChange={() => onCategoryChange(category)}
                />
                <Label htmlFor={category} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {countryBrands.slice(0, 5).map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox id={brand} />
                <Label htmlFor={brand} className="text-sm">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  )
}
