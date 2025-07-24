"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

interface SliderItem {
  id: string
  title: string
  description: string
  image: string
  link: string
}

export default function ProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean[]>([])
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  // Empty slider items array
  const sliderItems: SliderItem[] = []
  
  // Function to handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // swipe left
      nextSlide()
    }
    
    if (touchStart - touchEnd < -50) {
      // swipe right
      prevSlide()
    }
  }
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (sliderItems.length || 1))
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (sliderItems.length || 1)) % (sliderItems.length || 1))
  }
  
  const handleImageLoad = (index: number) => {
    setIsLoading((prev) => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
  }
  
  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (sliderItems.length > 0) {
        nextSlide()
      }
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])
  
  // If no slider items, show placeholder
  if (sliderItems.length === 0) {
    return (
      <section className="relative w-full h-[300px] overflow-hidden bg-white border-y border-gray-200 mt-4 mb-10">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500">
            <h3 className="text-xl font-medium mb-2">No featured products available</h3>
            <p>Check back later for our product highlights</p>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section 
      className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden bg-white border-y border-gray-200 mt-4 mb-10 shadow-md"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderItems.map((item, index) => (
          <div key={item.id} className="min-w-full h-full relative">
            {/* Loading indicator */}
            {isLoading[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
              priority={index === 0}
              onLoad={() => handleImageLoad(index)}
              onError={(e) => {
                console.error(`Failed to load image: ${item.image}`);
                const imgElement = e.currentTarget as HTMLImageElement;
                imgElement.src = "/product_images/unknown-product.jpg";
                imgElement.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-start">
              <div className="text-left text-white p-8 md:p-12 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 drop-shadow-md">{item.title}</h2>
                <p className="mb-8 text-base md:text-xl text-white/90 max-w-lg drop-shadow-sm">{item.description}</p>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base md:text-lg font-medium shadow-lg hover:shadow-xl transition-all rounded-md group relative overflow-hidden"
                >
                  <Link href={item.link}>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
                    {item.link.includes("bulk") ? "Bulk Orders" : "Shop Now"}
                    <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons - only show if there are slides */}
      {sliderItems.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:bg-opacity-90 rounded-full p-3 backdrop-blur-sm text-gray-800 shadow-md border border-gray-200 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white hover:bg-opacity-90 rounded-full p-3 backdrop-blur-sm text-gray-800 shadow-md border border-gray-200 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      {/* Indicator dots - only show if multiple slides */}
      {sliderItems.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {sliderItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-green-500 w-8" : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
} 