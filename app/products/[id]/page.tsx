"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react"
import { useRecommendations } from "@/hooks/use-recommendations"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCart } from "@/components/cart-provider"
import { Product } from "@/types"
import { products } from "@/lib/product-data"
import { useCurrency } from "@/hooks/use-currency"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = typeof params.id === 'string' ? decodeURIComponent(params.id) : ''
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { formatPrice } = useCurrency()
  const { trackProductView } = useRecommendations()
  const { addToCart } = useCart()
  
  // First try to find the product by direct ID match
  let product = products.find(p => p.id === productId)
  
  // If not found, try to match by transforming the URL slug into potential product IDs
  if (!product) {
    // Convert slug like "sprite-50cl" to potential IDs like "beverage-3"
    const slugParts = productId.split('-')
    const productName = slugParts[0].toLowerCase()
    
    // Try to find a product with a name containing the first part of the slug
    product = products.find(p => 
      p.name.toLowerCase().includes(productName) || 
      p.id.toLowerCase().includes(productName)
    )
  }
  
  console.log("Product ID:", productId)
  console.log("Found product:", product)

  useEffect(() => {
    if (product) {
      // Track this product view for recommendations
      trackProductView(product.id)
    }
  }, [product, trackProductView])

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.discount && product.discount > 0 
          ? product.price * (1 - product.discount / 100) 
          : product.price,
        image: product.images[0],
        quantity
      })
      alert("Product added to cart!")
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <p className="text-gray-600 mb-4">Requested ID: {productId}</p>
          <p className="text-gray-600 mb-4">Available IDs: {products.map(p => p.id).join(", ")}</p>
          <Button asChild variant="outline">
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Calculate discounted price if applicable
  const discountedPrice = product.discount && product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : null

  return (
    <div className="min-h-screen py-8 pt-32">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="relative aspect-square overflow-hidden rounded-md mb-4">
              <img
                src={product.images[0] || "/product_images/unknown-product.jpg"}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/product_images/unknown-product.jpg";
                }}
              />
              {product.discount && product.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            
            {/* Additional images would go here */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square border border-gray-200 rounded-md overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/product_images/unknown-product.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Origin */}
            <div className="flex items-center">
              <Badge variant="outline" className="capitalize">
                Origin: {product.origin}
              </Badge>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              {discountedPrice ? (
                <>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <Separator />

            {/* Quantity selector */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-medium mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-1 min-w-[40px] text-center">{quantity}</span>
                  <button 
                    className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <div className="flex space-x-4">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Product details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Origin:</span>
                  <span className="font-medium capitalize">{product.origin}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                {product.weight && (
                  <div className="flex flex-col">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{product.weight}g</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products would go here */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* We would show related products here */}
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white border border-gray-200 rounded overflow-hidden">
                  <Link href={`/products/${encodeURIComponent(relatedProduct.id)}`}>
                    <div className="relative h-48">
                      <img 
                        src={relatedProduct.images?.[0] || '/product_images/unknown-product.jpg'}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/product_images/unknown-product.jpg";
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{relatedProduct.name}</h3>
                      <p className="font-bold text-gray-900 mt-2">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Additional product information would go here */}
      </div>
    </div>
  )
}
