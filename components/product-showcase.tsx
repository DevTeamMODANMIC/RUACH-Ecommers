"use client"
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Eye, Heart, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { getProducts, type Product } from "@/lib/firebase-products"
import { useCart } from "@/components/cart-provider"
import { useWishlist, type WishlistItem } from "@/hooks/use-wishlist"
import { formatCurrency } from "@/lib/utils"

interface ProductShowcaseProps {
  category: string
  title?: string
  limit?: number
}

export default function ProductShowcase({ category, title, limit = 8 }: ProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true)
        const { products: allProducts } = await getProducts({ category }, limit)
        setProducts(allProducts.filter(p => p.inStock))
        console.log(`${category} products loaded:`, allProducts.length)
      } catch (error) {
        console.error(`Error loading ${category} products:`, error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    loadCategoryProducts()
  }, [category])

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.jpg",
      quantity: 1,
      options: {}
    })
  }

  const handleQuickView = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    setQuickViewProduct(product)
  }

  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.jpg",
      category: product.category,
      inStock: product.inStock
    }
    toggleWishlist(wishlistItem)
  }

  // Get a URL-friendly category name for the "View All" link
  const mapCategoryToShopCategory = (showcaseCategory: string): string => {
    const categoryMap: Record<string, string> = {
      "Beverages": "drinks",
      "Food": "food",
      "Spices": "spices",
      "Flour": "flour",
      "Vegetables & Fruits": "vegetables",
      "Meat & Fish": "meat"
    };
    return categoryMap[showcaseCategory] || showcaseCategory.toLowerCase()
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = "/product_images/unknown-product.jpg"
  }

  return (
    <section className="my-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <Link 
          href={`/shop?category=${mapCategoryToShopCategory(category)}`} 
          className="mt-2 md:mt-0 flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Card 
              key={product.id}
              className="overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain p-1 group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={handleImageError}
                  />
                </Link>
                
                {product.discount && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 hover:bg-red-600">
                      -{product.discount}% OFF
                    </Badge>
                  </div>
                )}
                
                {/* Wishlist button */}
                <div className="absolute top-2 right-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-rose-500"
                    onClick={(e) => handleToggleWishlist(product, e)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                  </Button>
                </div>
                
                {/* Hover actions */}
                <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'}`}>
                  <button 
                    onClick={(e) => handleQuickView(product, e)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-medium text-lg hover:text-green-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {product.category}
                </p>
                
                {product.rating && (
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            product.rating && i < Math.floor(product.rating) 
                              ? "text-amber-400 fill-amber-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">
                      ({product.reviewCount || 0})
                    </span>
                  </div>
                )}
                
                <div className="mt-2">
                  {product.discount ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">
                        {formatCurrency(product.price * (1 - product.discount / 100))}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold">
                      {formatCurrency(product.price)}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 border border-dashed border-gray-200 rounded-lg">
          No products available in this category at the moment.
        </div>
      )}

      {/* Quick View Modal */}
      <Dialog open={quickViewProduct !== null} onOpenChange={(isOpen: boolean) => !isOpen && setQuickViewProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{quickViewProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={quickViewProduct.images?.[0] || "/placeholder.jpg"}
                    alt={quickViewProduct.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">{quickViewProduct.category}</p>
                  <div className="text-2xl font-bold">
                    {formatCurrency(quickViewProduct.price)}
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(quickViewProduct)}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

