"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, Mail, ShoppingBag, ArrowRight } from "lucide-react"

// Updated slides with better images and content
const slides = [
  {
    id: 1,
    title: "Premium African & International Foods",
    subtitle: "Discover authentic flavors from around the world",
    description: "Experience the tastes of home with our carefully curated selection of international groceries",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2940&auto=format&fit=crop",
    cta: "Shop Now",
    ctaLink: "/shop"
  },
  {
    id: 2,
    title: "Fresh Beverages from Home",
    subtitle: "Authentic drinks from your homeland",
    description: "Quench your thirst with our wide range of international beverages and refreshments",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=2970&auto=format&fit=crop",
    cta: "View Collection",
    ctaLink: "/shop?category=beverages"
  },
  {
    id: 3,
    title: "Bulk Orders Available",
    subtitle: "Perfect for events, restaurants & catering",
    description: "Get volume discounts on bulk purchases with our special wholesale options",
    image: "https://images.unsplash.com/photo-1467453678174-768ec283a940?q=80&w=2844&auto=format&fit=crop",
    cta: "Bulk Orders",
    ctaLink: "/bulk-order"
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean[]>([true, true, true])
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 7000) // Slightly longer duration for a more professional feel
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleImageLoad = (index: number) => {
    setIsLoading((prev) => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
  }

  const scrollToNewsletter = () => {
    const newsletterSection = document.getElementById('newsletter-section')
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      className="relative h-[60vh] sm:h-[70vh] md:h-[85vh] overflow-hidden bg-gray-900 border-b border-gray-200/10"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Authentication Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-10 shadow-md">
          <Link href="/login">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Login</span>
            <span className="xs:hidden">Log</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-10 shadow-md backdrop-blur-sm">
          <Link href="/register">
            <span className="hidden xs:inline">Register</span>
            <span className="xs:hidden">Reg</span>
          </Link>
        </Button>
      </div>

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Loading effect */}
          {isLoading[index] && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            quality={90}
            priority={index === 0}
            className="object-cover transition-transform duration-10000 ease-out"
            onLoad={() => handleImageLoad(index)}
            style={{ 
              transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              transitionDuration: '15000ms'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center md:items-start">
            <div 
              className={`text-center md:text-left max-w-5xl px-6 md:px-16 transform transition-all duration-1000 ease-out ${
                index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <span className="inline-block px-4 py-1 bg-green-600 text-white text-xs md:text-sm rounded-full mb-4 shadow-lg">Limited Time Offers</span>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg text-white">
                {slide.title}
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-white/90 drop-shadow-md max-w-2xl">
                {slide.subtitle}
              </p>
              
              <p className="hidden md:block text-white/80 max-w-xl mb-6 text-lg">
                {slide.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center justify-center md:justify-start gap-3 sm:gap-4 mt-6">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-6 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all rounded-full group"
                >
                  <Link href={slide.ctaLink}>
                    <ShoppingBag className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                    {slide.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={scrollToNewsletter}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-6 sm:px-8 py-6 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl transition-all backdrop-blur-sm rounded-full"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe to Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-md backdrop-blur-sm bg-black/30 hidden sm:flex"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-white hover:bg-black/20 h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-md backdrop-blur-sm bg-black/30 hidden sm:flex"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">Next</span>
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-green-500 w-8 sm:w-10" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
