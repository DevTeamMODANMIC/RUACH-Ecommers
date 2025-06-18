"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Star, MapPin, Truck, Shield, RotateCcw } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"
import { BulkOrderButton } from "@/components/bulk-order-button"
import { ProductRecommendations } from "@/components/product-recommendations"
import { useRecommendations } from "@/hooks/use-recommendations"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductReviews } from "@/components/product-reviews"

// Mock product detail data
const productDetails = {
  1: {
    id: 1,
    name: "Premium Jollof Rice Mix",
    description: "Authentic Nigerian jollof rice seasoning blend with traditional spices",
    longDescription:
      "Our Premium Jollof Rice Mix is carefully crafted using traditional Nigerian spices and seasonings. This authentic blend includes tomatoes, onions, garlic, ginger, bay leaves, thyme, curry powder, and our secret blend of West African spices. Perfect for creating restaurant-quality jollof rice at home.",
    price: 8.99,
    originalPrice: 12.99,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    category: "Rice & Grains",
    brand: "Mama Gold",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    stockCount: 45,
    origin: "Lagos, Nigeria",
    country: "nigeria",
    localName: "Jollof Rice Spice",
    discount: 31,
    isOrganic: false,
    isHalal: true,
    tags: ["Traditional", "Spicy", "Family Pack"],
    weight: "500g",
    ingredients: [
      "Tomato powder",
      "Onion powder",
      "Garlic powder",
      "Ginger",
      "Bay leaves",
      "Thyme",
      "Curry powder",
      "Salt",
      "Natural spices",
    ],
    nutritionalInfo: {
      calories: "15 per serving",
      fat: "0.5g",
      carbs: "3g",
      protein: "0.8g",
      sodium: "450mg",
    },
    shelfLife: "24 months",
    storage: "Store in a cool, dry place",
    availableCountries: ["nigeria", "uk", "ghana"],
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { formatPrice } = useCurrency()
  const { trackProductView } = useRecommendations()

  const product = productDetails[productId as keyof typeof productDetails]

  useEffect(() => {
    if (product) {
      // Track this product view for recommendations
      trackProductView(product.id)
    }
  }, [product, trackProductView])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/products">Back to Products</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded border-2 transition-colors ${
                    selectedImage === index ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.brand}</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.origin}
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.localName !== product.name && (
                <p className="text-lg text-muted-foreground italic mb-4">{product.localName}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-green-600">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Tags & Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
              {product.isHalal && <Badge className="bg-blue-100 text-blue-800">Halal</Badge>}
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button size="lg" disabled={!product.inStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <BulkOrderButton
                  productId={product.id}
                  productName={product.name}
                  basePrice={product.price}
                  country={product.country}
                />
              </div>

              <Button variant="outline" size="lg" className="w-full" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free shipping over £50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Quality guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-green-600" />
                    <span>30-day returns</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-12">
          <ProductRecommendations
            productId={product.id}
            country={product.country}
            type="frequently-bought-together"
            title="Frequently Bought Together"
            limit={4}
          />
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed">{product.longDescription}</p>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Product Details</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                          <strong>Weight:</strong> {product.weight}
                        </li>
                        <li>
                          <strong>Origin:</strong> {product.origin}
                        </li>
                        <li>
                          <strong>Shelf Life:</strong> {product.shelfLife}
                        </li>
                        <li>
                          <strong>Storage:</strong> {product.storage}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.isHalal && <Badge className="bg-blue-100 text-blue-800">Halal Certified</Badge>}
                        {product.isOrganic && <Badge className="bg-green-100 text-green-800">Organic</Badge>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Information</CardTitle>
                  <p className="text-sm text-muted-foreground">Per serving (1 tablespoon)</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="text-center p-4 border rounded">
                        <div className="font-semibold text-lg">{value}</div>
                        <div className="text-sm text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Reviews feature coming soon!</p>
                    <p className="text-sm mt-2">Be the first to review this product.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Product Reviews */}
        <div className="mt-12">
          <ProductReviews
            productId={product.id}
            productName={product.name}
            availableCountries={product.availableCountries || ["nigeria"]}
          />
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <ProductRecommendations
            productId={product.id}
            country={product.country}
            category={product.category}
            type="related"
            title="Related Products"
            limit={4}
          />
        </div>

        {/* You Might Also Like */}
        <div className="mt-12">
          <ProductRecommendations
            productId={product.id}
            country={product.country}
            type="you-might-like"
            title="You Might Also Like"
            limit={4}
          />
        </div>

        {/* Recently Viewed */}
        <div className="mt-12">
          <ProductRecommendations
            productId={product.id}
            country={product.country}
            type="recently-viewed"
            title="Recently Viewed"
            limit={4}
          />
        </div>
      </div>
    </div>
  )
}
