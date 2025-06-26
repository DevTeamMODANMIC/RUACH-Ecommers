"use client"

import Link from "next/link"
import { Product } from "@/types"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import CloudinaryImage from "@/components/cloudinary-image"
import Image from "next/image"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.discount && product.discount > 0 
        ? product.price * (1 - product.discount / 100) 
        : product.price,
      image: product.cloudinaryImages?.[0]?.url || product.images[0],
      quantity: 1
    });
  };

  if (products.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
        <p className="text-gray-600 max-w-md">
          We couldn't find any products matching your current filters. Try adjusting your filters or browse our categories.
        </p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              {product.cloudinaryImages && product.cloudinaryImages.length > 0 ? (
                <CloudinaryImage
                  publicId={product.cloudinaryImages[0].publicId}
                  alt={product.cloudinaryImages[0].alt || product.name}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                size="medium"
                />
              ) : (
              <Image
                src={product.images[0]}
                  alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/product_images/unknown-product.jpg";
                  }}
                />
              )}
            </div>
          
          <div className="p-3">
            <Link href={`/products/${encodeURIComponent(product.id)}`} className="hover:text-green-600">
              <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
            </Link>
            
            <div className="flex items-center justify-between mt-2">
              <div>
                {product.discount && product.discount > 0 ? (
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">
                      {formatCurrency(product.price * (1 - product.discount / 100))}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
                )}
              </div>
              
              <button 
                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded text-green-600 hover:bg-green-50"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart(product);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid;
