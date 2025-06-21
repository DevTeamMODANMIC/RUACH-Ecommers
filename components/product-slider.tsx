"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SliderItem {
  id: string
  title: string
  description: string
  image: string
  link: string
}

export default function ProductSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showDebug, setShowDebug] = useState(false)
  
  const sliderItems: SliderItem[] = [
    {
      id: "slide1",
      title: "African Beverages",
      description: "Discover authentic drinks from across Africa",
      image: "/a/slider.png",
      link: "/shop?category=Beverages"
    },
    {
      id: "slide2",
      title: "Traditional Foods",
      description: "Experience the rich flavors of African cuisine",
      image: "/placeholder.jpg",
      link: "/shop?category=Food"
    },
    {
      id: "slide3",
      title: "Special Offers",
      description: "Save on bulk orders and popular products",
      image: "/placeholder.jpg",
      link: "/bulk-order"
    }
  ]
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length)
  }
  
  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    
    return () => clearInterval(timer)
  }, [])
  
  return (
    <section className="relative w-full h-[400px] overflow-hidden bg-gray-100">
      {/* Debug toggle */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDebug(!showDebug)}
            className="bg-white/80 backdrop-blur-sm"
          >
            {showDebug ? "Hide Debug" : "Show Debug"}
          </Button>
        </div>
      )}
      
      {/* Debug info */}
      {showDebug && (
        <div className="absolute top-16 right-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded max-w-xs overflow-auto max-h-60">
          <h3 className="font-bold mb-2 text-sm">Slider Images:</h3>
          <pre className="text-xs">{JSON.stringify(sliderItems.map(item => ({
            id: item.id,
            image: item.image
          })), null, 2)}</pre>
        </div>
      )}
      
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderItems.map((item) => (
          <div key={item.id} className="min-w-full h-full relative">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                console.error(`Failed to load image: ${item.image}`);
                const imgElement = e.currentTarget as HTMLImageElement;
                imgElement.src = "/placeholder.jpg";
                imgElement.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="text-center text-white p-6 max-w-lg">
                <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
                <p className="mb-6 text-lg">{item.description}</p>
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href={item.link}>Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {sliderItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
} 