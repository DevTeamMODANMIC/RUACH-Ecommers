"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Plus, ChevronRight, Eye, X, Heart } from "lucide-react"
import { getRandomCategoryImage } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { useWishlist, type WishlistItem } from "@/hooks/use-wishlist"

interface ProductShowcaseProps {
  category?: string;
  title?: string;
  subtitle?: string;
}

export default function ProductShowcase({ 
  category = "Beverages", 
  title = "Popular Products", 
  subtitle = "Authentic products from around the world" 
}: ProductShowcaseProps) {
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();


  // Empty product data object
  const productData = {
    "Beverages": [],
    "Food": [],
    "Spices": [],
    "Flour": [],
    "Vegetables & Fruits": [],
    "Meat & Fish": []
  }


  // Get products for the selected category, or default to empty array
  const products = productData[category as keyof typeof productData] || [];

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
    return categoryMap[showcaseCategory] || "all";
  };

  const handleAddToCart = (product: any, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };

  const handleQuickView = (product: any, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setQuickViewProduct(product);
  };

  const handleToggleWishlist = (product: any, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.subtitle || category
    };
    
    toggleWishlist(wishlistItem);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/product_images/unknown-product.jpg";
  };

  return (
    <section className="my-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-gray-600">{subtitle}</p>
        </div>
        <Link 
          href={`/shop?category=${mapCategoryToShopCategory(category)}`} 
          className="mt-2 md:mt-0 flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {/* Product Grid */}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Card 
              key={product.id}
              className="overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 group"
              onMouseEnter={() => setHoveredProductId(product.id)}
              onMouseLeave={() => setHoveredProductId(null)}
            >
              {/* Card content */}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12 border border-dashed border-gray-200 rounded-lg">
          No products available in this category at the moment.
        </div>
      )}

      {/* Quick View Modal */}
      <Dialog open={quickViewProduct !== null} onOpenChange={(isOpen) => !isOpen && setQuickViewProduct(null)}>
        {/* Modal content */}

      </Dialog>
    </section>
  )
}

