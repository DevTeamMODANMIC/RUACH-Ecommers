import { Suspense } from "react"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
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
      <PersonalizedRecommendations />
      <BlogPreview />
      <BulkOrderCTA />
      <Newsletter />
    </main>
  )
}
