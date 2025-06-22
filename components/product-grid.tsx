"use client"

import Link from "next/link"
import { Product } from "@/types"
import { ShoppingCart } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"

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
      image: product.images[0],
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
        <div key={product.id} className="bg-white border border-gray-200 rounded overflow-hidden">
          <Link href={`/products/${encodeURIComponent(product.id)}`}>
            <div className="relative h-48">
              <img 
                src={product.images?.[0] || '/product_images/unknown-product.jpg'}
                alt={product.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/product_images/unknown-product.jpg";
                }}
              />
              {product.discount && product.discount > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1">
                  {product.discount}% OFF
                </div>
              )}
            </div>
          </Link>
          
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
