import { Suspense, lazy } from "react"
import Hero from "@/components/hero"
import Newsletter from "@/components/newsletter"
import { BulkOrderCTA } from "@/components/bulk-order-cta"

// Lazy load components that are below the fold
const FeaturedProducts = lazy(() => import("@/components/featured-products"))
const ProductShowcase = lazy(() => import("@/components/product-showcase"))
const ProductSlider = lazy(() => import("@/components/product-slider"))
const PersonalizedRecommendations = lazy(() => import("@/components/personalized-recommendations").then(mod => ({ default: mod.PersonalizedRecommendations })))

export default function HomePage() {
  return (
    <main className="flex flex-col bg-white text-gray-800">
      <div className="relative">
        <Hero />
      </div>
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading featured products...</div>}>
          <FeaturedProducts />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading product slider...</div>}>
          <ProductSlider />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading beverages showcase...</div>}>
          <ProductShowcase 
            category="Beverages" 
            title="Popular Beverages" 
            subtitle="Authentic drinks from around the world" 
          />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading food showcase...</div>}>
          <ProductShowcase 
            category="Food" 
            title="Traditional Foods" 
            subtitle="Authentic African culinary delights" 
          />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading spices showcase...</div>}>
          <ProductShowcase 
            category="Spices" 
            title="Premium Spices" 
            subtitle="Enhance your dishes with authentic flavors" 
          />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center text-gray-600">Loading recommendations...</div>}>
          <PersonalizedRecommendations />
        </Suspense>
        <div className="mb-20">
        <BulkOrderCTA />
        </div>
        <div id="newsletter-section">
          <Newsletter />
        </div>
      </div>
    </main>
  )
}
