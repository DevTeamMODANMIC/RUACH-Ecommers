import { Suspense } from "react"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import BeverageShowcase from "@/components/beverage-showcase"
import ProductSlider from "@/components/product-slider"
import BlogPreview from "@/components/blog-preview"
import Newsletter from "@/components/newsletter"
import { BulkOrderCTA } from "@/components/bulk-order-cta"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<div>Loading...</div>}>
        <FeaturedProducts />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductSlider />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <BeverageShowcase />
      </Suspense>
      <PersonalizedRecommendations />
      <BlogPreview />
      <BulkOrderCTA />
      <div id="newsletter-section">
      <Newsletter />
      </div>
    </main>
  )
}
