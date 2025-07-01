"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Eye, ShoppingCart, Heart, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { useWishlist, type WishlistItem } from "@/hooks/use-wishlist"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  discount?: number
  images?: string[]
  category?: string
  displayCategory?: string
  rating?: number
  reviewCount?: number
  bestseller?: boolean
  new?: boolean
  popular?: boolean
  outOfStock?: boolean
  inStock?: boolean
}

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price,
      image: product.images?.[0] || "/placeholder.jpg",
      quantity: 1
    });
  };

  const handleQuickView = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setQuickViewProduct(product);
  };

  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
      originalPrice: product.discount ? product.price : undefined,
      image: product.images?.[0] || "/placeholder.jpg",
      category: product.category || product.displayCategory,
      inStock: product.inStock !== false && !product.outOfStock // Default to true if not specified
    };
    
    toggleWishlist(wishlistItem);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-gray-200">
            <div className="aspect-square bg-gray-100 relative">
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            </div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse mb-4 w-1/2" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <Card 
            key={product.id} 
            className="group relative overflow-hidden hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setHoveredProductId(product.id)}
            onMouseLeave={() => setHoveredProductId(null)}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Link href={`/products/${product.id}`}>
                <div className="absolute inset-0 z-10">
                  {product.outOfStock && (
                    <div className="absolute top-4 left-0 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-r-lg shadow-md">
                      Out of Stock
                    </div>
                  )}
                  
                  {product.discount && (
                    <div className="absolute top-12 left-0 z-20 bg-red-500 text-white text-xs font-bold px-3 py-0.5 rounded-r-lg shadow-md">
                      -{product.discount}% OFF
                    </div>
                  )}
                  
                  {product.bestseller && (
                    <div className="absolute bottom-4 left-4 z-20">
                      <Badge className="bg-amber-500 hover:bg-amber-600">Bestseller</Badge>
                    </div>
                  )}
                  
                  {product.new && (
                    <div className="absolute bottom-4 left-4 z-20">
                      <Badge className="bg-blue-500 hover:bg-blue-600">New Arrival</Badge>
                    </div>
                  )}
                </div>
              
                <Image
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
              </Link>
              
              {/* Wishlist button */}
              <div className="absolute top-3 right-3 z-20">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-500 hover:text-rose-500 shadow-sm"
                  onClick={(e) => handleToggleWishlist(product, e)}
                >
                  <Heart 
                    className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span className="sr-only">Toggle wishlist</span>
                </Button>
              </div>
              
              {/* Hover actions */}
              <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                  onClick={(e) => handleQuickView(product, e)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  aria-label="Quick view"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button 
                  onClick={(e) => handleAddToCart(product, e)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  aria-label="Add to cart"
                  disabled={product.outOfStock}
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`} className="block">
                <h3 className="font-medium text-lg hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{product.displayCategory || product.category}</p>
              
              {product.rating && (
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  {product.reviewCount && (
                    <>
                      <span className="mx-1 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
                    </>
                  )}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
              <div className="flex flex-col">
                {product.discount ? (
                  <>
                    <span className="font-bold text-green-600">
                      {formatCurrency(product.price * (1 - product.discount / 100))}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  </>
                ) : product.originalPrice ? (
                  <>
                    <span className="font-bold text-green-600">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Quick View Modal */}
      <Dialog open={quickViewProduct !== null} onOpenChange={(isOpen) => !isOpen && setQuickViewProduct(null)}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{quickViewProduct?.name}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          {quickViewProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={quickViewProduct.images?.[0] || "/placeholder.jpg"}
                  alt={quickViewProduct.name}
                  fill
                  className="object-contain p-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
                
                {quickViewProduct.outOfStock && (
                  <div className="absolute top-4 left-0 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-r-lg shadow-md">
                    Out of Stock
                  </div>
                )}
                
                {quickViewProduct.discount && (
                  <div className="absolute top-12 left-0 z-10 bg-red-500 text-white text-xs font-bold px-3 py-0.5 rounded-r-lg shadow-md">
                    -{quickViewProduct.discount}% OFF
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <div>
                  <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                  <p className="text-gray-600">{quickViewProduct.displayCategory || quickViewProduct.category}</p>
                  
                  {quickViewProduct.rating && (
                    <div className="flex items-center mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(quickViewProduct.rating) 
                                ? "text-amber-400 fill-amber-400" 
                                : i < quickViewProduct.rating 
                                  ? "text-amber-400 fill-amber-400" 
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {quickViewProduct.reviewCount && (
                        <span className="text-sm text-gray-600 ml-2">
                          ({quickViewProduct.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    {quickViewProduct.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(quickViewProduct.price * (1 - quickViewProduct.discount / 100))}
                        </span>
                        <span className="text-gray-500 line-through">
                          {formatCurrency(quickViewProduct.price)}
                        </span>
                      </div>
                    ) : quickViewProduct.originalPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(quickViewProduct.price)}
                        </span>
                        <span className="text-gray-500 line-through">
                          {formatCurrency(quickViewProduct.originalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold">
                        {formatCurrency(quickViewProduct.price)}
                      </span>
                    )}
                  </div>
                  
                  {quickViewProduct.description && (
                    <div className="mt-4 text-gray-600">
                      <p>{quickViewProduct.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => handleAddToCart(quickViewProduct)}
                    className="flex-1 flex items-center justify-center gap-2"
                    disabled={quickViewProduct.outOfStock}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleToggleWishlist(quickViewProduct)}
                    className={`flex-1 flex items-center justify-center gap-2
                    ${isInWishlist(quickViewProduct.id) 
                      ? 'border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100' 
                      : ''}`}
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(quickViewProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isInWishlist(quickViewProduct.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </Button>
                  
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/products/${quickViewProduct.id}`} className="flex items-center justify-center gap-2">
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
